import type { Student } from "./student";

export interface AuthUser extends Student {}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (student: AuthUser) => void;
  logout: () => void;
  changeUser: () => void;
}

