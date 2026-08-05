import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

type AdminContextValue = {
  isAdmin: boolean;
  login: (password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  request: <T = { ok: boolean }>(action: string, payload?: Record<string, unknown>) => Promise<T>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

async function adminFetch<T>(action: string, payload?: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error("Supabase 연결 설정이 필요합니다.");
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("관리자 로그인이 필요합니다.");

  const response = await fetch("/api/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const result = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(result.error || "관리자 요청을 처리하지 못했습니다.");
  return result;
}
export function AdminProvider({ children }: { children: ReactNode }) {
  const { currentUser, logout: authLogout } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const request = useCallback(<T,>(action: string, payload?: Record<string, unknown>) => (
    adminFetch<T>(action, payload)
  ), []);

  const login = useCallback(async () => {
    if (!isAdmin) return false;
    try {
      await request("verify");
      return true;
    } catch {
      return false;
    }
  }, [isAdmin, request]);

  const value = useMemo<AdminContextValue>(() => ({
    isAdmin,
    login,
    logout: authLogout,
    request,
  }), [authLogout, isAdmin, login, request]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
