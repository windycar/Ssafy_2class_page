import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { AuthContextValue, AuthUser, MemberRole } from "../types/auth";
import {
  profileMatchesSession,
  shouldRefreshProfileForAuthEvent,
} from "../utils/authSession";

type ServerProfile = {
  memberId: number;
  studentId: number | null;
  authId: string;
  name: string;
  username: string;
  loginId: string;
  className: string;
  role: MemberRole;
  isActive: boolean;
  canAccessSpecialMockExam: boolean;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
};

type AuthApiResponse = {
  session?: { access_token: string; refresh_token: string };
  profile?: ServerProfile;
  error?: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const DEMO_SESSION_KEY = "ssafy-g2-demo-session";

const DEMO_USER: AuthUser = {
  id: 0,
  memberId: 0,
  studentId: null,
  authId: "",
  name: "체험 방문자",
  username: "@demo",
  loginId: "demo",
  class: "체험",
  className: "체험",
  role: "member",
  isActive: false,
  isDemo: true,
  canAccessSpecialMockExam: false,
  mustChangePassword: false,
  passwordChangedAt: null,
  lastLoginAt: null,
};

function hasDemoSession() {
  try {
    return sessionStorage.getItem(DEMO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function setDemoSession(active: boolean) {
  try {
    if (active) sessionStorage.setItem(DEMO_SESSION_KEY, "1");
    else sessionStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    // Browsers can disable session storage. The current tab still works.
  }
}

function toAuthUser(profile: ServerProfile): AuthUser {
  return {
    id: profile.studentId ?? 900_000_000 + profile.memberId,
    memberId: profile.memberId,
    studentId: profile.studentId,
    authId: profile.authId,
    name: profile.name,
    username: profile.username,
    loginId: profile.loginId,
    class: profile.className,
    className: profile.className,
    role: profile.role,
    isActive: profile.isActive,
    canAccessSpecialMockExam: profile.canAccessSpecialMockExam,
    mustChangePassword: profile.mustChangePassword,
    passwordChangedAt: profile.passwordChangedAt,
    lastLoginAt: profile.lastLoginAt,
  };
}

async function authRequest(
  body: Record<string, unknown>,
  accessToken?: string,
): Promise<AuthApiResponse> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({})) as AuthApiResponse;
  if (!response.ok) throw new Error(payload.error || "인증 요청을 처리하지 못했습니다.");
  return payload;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      const demo = hasDemoSession() ? DEMO_USER : null;
      setCurrentUser(demo);
      setIsLoading(false);
      return demo;
    }
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      const demo = hasDemoSession() ? DEMO_USER : null;
      setCurrentUser(demo);
      setIsLoading(false);
      return demo;
    }
    setDemoSession(false);
    try {
      const response = await authRequest({ action: "profile" }, accessToken);
      if (!response.profile) throw new Error("회원 정보를 받지 못했습니다.");

      const { data: latestSessionData } = await supabase.auth.getSession();
      if (!profileMatchesSession(
        response.profile.authId,
        latestSessionData.session?.user.id,
      )) {
        return null;
      }

      const user = toAuthUser(response.profile);
      setCurrentUser(user);
      return user;
    } catch (error) {
      await supabase.auth.signOut().catch(() => undefined);
      setCurrentUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile().catch(() => undefined);
    if (!supabase) return;
    let refreshTimer: number | undefined;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || event === "SIGNED_OUT") {
        if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
        setCurrentUser(hasDemoSession() ? DEMO_USER : null);
        setIsLoading(false);
        return;
      }

      if (shouldRefreshProfileForAuthEvent(event, true)) {
        if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          void refreshProfile().catch(() => undefined);
        }, 0);
      }
    });
    return () => {
      if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
      listener.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const login = useCallback(async (loginId: string, password: string) => {
    if (!supabase) throw new Error("Supabase 연결 설정이 필요합니다.");
    const response = await authRequest({ action: "login", loginId, password });
    if (!response.session || !response.profile) throw new Error("로그인 응답이 올바르지 않습니다.");
    const { data, error } = await supabase.auth.setSession({
      access_token: response.session.access_token,
      refresh_token: response.session.refresh_token,
    });
    if (error) throw error;
    if (!profileMatchesSession(response.profile.authId, data.user?.id)) {
      await supabase.auth.signOut().catch(() => undefined);
      throw new Error("로그인 계정과 회원 정보가 일치하지 않습니다.");
    }
    const user = toAuthUser(response.profile);
    setDemoSession(false);
    setCurrentUser(user);
    setIsLoading(false);
    return user;
  }, []);

  const startDemo = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setDemoSession(true);
    setCurrentUser(DEMO_USER);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setDemoSession(false);
    setCurrentUser(null);
    if (supabase) await supabase.auth.signOut().catch(() => undefined);
  }, []);

  const changeUser = logout;

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (hasDemoSession()) throw new Error("체험 계정에서는 비밀번호를 변경할 수 없습니다.");
    if (!supabase) throw new Error("Supabase 연결 설정이 필요합니다.");
    const { data } = await supabase.auth.getSession();
    if (!data.session?.access_token) throw new Error("로그인이 필요합니다.");
    const response = await authRequest(
      { action: "change-password", currentPassword, newPassword },
      data.session.access_token,
    );
    if (!response.profile) throw new Error("회원 정보를 갱신하지 못했습니다.");
    setCurrentUser(toAuthUser(response.profile));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isDemo: currentUser?.isDemo === true,
    isLoading,
    login,
    startDemo,
    logout,
    changeUser,
    changePassword,
    refreshProfile,
  }), [changePassword, changeUser, currentUser, isLoading, login, logout, refreshProfile, startDemo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}

