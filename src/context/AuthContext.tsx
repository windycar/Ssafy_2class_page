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
      setCurrentUser(null);
      setIsLoading(false);
      return null;
    }
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      setCurrentUser(null);
      setIsLoading(false);
      return null;
    }
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
        setCurrentUser(null);
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
    setCurrentUser(user);
    setIsLoading(false);
    return user;
  }, []);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    if (supabase) await supabase.auth.signOut().catch(() => undefined);
  }, []);

  const changeUser = logout;

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
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
    isLoading,
    login,
    logout,
    changeUser,
    changePassword,
    refreshProfile,
  }), [changePassword, changeUser, currentUser, isLoading, login, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}

