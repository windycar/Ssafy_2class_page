import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authStorage } from "../services/storage/authStorage";
import type { AuthUser, AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authStorage.get());

  useEffect(() => {
    if (currentUser) authStorage.set(currentUser);
    else authStorage.clear();
  }, [currentUser]);

  const login = (student: AuthUser) => setCurrentUser(student);

  const logout = () => setCurrentUser(null);

  const changeUser = () => setCurrentUser(null);

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated: !!currentUser, login, logout, changeUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

