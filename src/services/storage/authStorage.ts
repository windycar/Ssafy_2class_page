import type { AuthUser } from "../../types/auth";

const KEY = "ssafy-gwangju-2-auth";

export const authStorage = {
  get(): AuthUser | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },
  set(user: AuthUser): void {
    localStorage.setItem(KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(KEY);
  },
};

