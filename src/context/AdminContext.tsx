import { createContext, useContext, useState, type ReactNode } from "react";

type AdminContextValue = {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  request: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

async function adminFetch(action: string, password: string, payload?: Record<string, unknown>) {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!response.ok) throw new Error("Admin request failed");
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState(() => sessionStorage.getItem("g2-admin-password") ?? "");
  const isAdmin = Boolean(password);

  const login = async (nextPassword: string) => {
    try {
      await adminFetch("verify", nextPassword);
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

  const request = (action: string, payload?: Record<string, unknown>) => adminFetch(action, password, payload);

  return <AdminContext.Provider value={{ isAdmin, login, logout, request }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
