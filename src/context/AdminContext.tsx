import { createContext, useContext, useState, type ReactNode } from "react";

type AdminContextValue = {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  request: <T = { ok: boolean }>(
    action: string,
    payload?: Record<string, unknown>,
  ) => Promise<T>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

async function adminFetch<T>(
  action: string,
  password: string,
  payload?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ action, ...payload }),
  });
  const responseBody = await response.text();
  if (!response.ok) {
    const fallbackMessage =
      response.status === 401
        ? "관리자 비밀번호가 올바르지 않습니다."
        : response.status === 500
          ? "관리자 서버 환경 변수를 확인해 주세요."
          : "관리자 요청을 처리하지 못했습니다.";
    throw new Error(responseBody || fallbackMessage);
  }

  if (!responseBody) return undefined as T;
  try {
    return JSON.parse(responseBody) as T;
  } catch {
    return undefined as T;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState(() => sessionStorage.getItem("g2-admin-password") ?? "");
  const isAdmin = Boolean(password);

  const login = async (nextPassword: string) => {
    try {
      await adminFetch<{ ok: boolean }>("verify", nextPassword);
      sessionStorage.setItem("g2-admin-password", nextPassword);
      setPassword(nextPassword);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("g2-admin-password");
    setPassword("");
  };

  const request = <T,>(action: string, payload?: Record<string, unknown>) =>
    adminFetch<T>(action, password, payload);

  return <AdminContext.Provider value={{ isAdmin, login, logout, request }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
