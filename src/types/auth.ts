import type { Student } from "./student";

export type MemberRole = "member" | "admin";

export interface AuthUser extends Student {
  memberId: number;
  studentId: number | null;
  authId: string;
  loginId: string;
  className: string;
  role: MemberRole;
  isActive: boolean;
  canAccessSpecialMockExam: boolean;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  changeUser: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<AuthUser | null>;
}

