import type { Student } from "./student";

export interface TeamColor {
  bg: string;
  border: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  nameText: string;
  avatarBg: string;
}

export interface Team {
  id: number;
  name: string;
  members: Student[];
  color: TeamColor;
}
