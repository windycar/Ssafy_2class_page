import type { Student } from "../types/student";
import type { Team, TeamColor } from "../types/team";

export const TEAM_COLORS: TeamColor[] = [
  { bg: "bg-blue-50", border: "border-blue-200", headerBg: "bg-blue-100", badgeBg: "bg-blue-200", badgeText: "text-blue-800", nameText: "text-blue-700", avatarBg: "bg-blue-200" },
  { bg: "bg-emerald-50", border: "border-emerald-200", headerBg: "bg-emerald-100", badgeBg: "bg-emerald-200", badgeText: "text-emerald-800", nameText: "text-emerald-700", avatarBg: "bg-emerald-200" },
  { bg: "bg-amber-50", border: "border-amber-200", headerBg: "bg-amber-100", badgeBg: "bg-amber-200", badgeText: "text-amber-800", nameText: "text-amber-700", avatarBg: "bg-amber-200" },
  { bg: "bg-violet-50", border: "border-violet-200", headerBg: "bg-violet-100", badgeBg: "bg-violet-200", badgeText: "text-violet-800", nameText: "text-violet-700", avatarBg: "bg-violet-200" },
  { bg: "bg-rose-50", border: "border-rose-200", headerBg: "bg-rose-100", badgeBg: "bg-rose-200", badgeText: "text-rose-800", nameText: "text-rose-700", avatarBg: "bg-rose-200" },
  { bg: "bg-orange-50", border: "border-orange-200", headerBg: "bg-orange-100", badgeBg: "bg-orange-200", badgeText: "text-orange-800", nameText: "text-orange-700", avatarBg: "bg-orange-200" },
  { bg: "bg-teal-50", border: "border-teal-200", headerBg: "bg-teal-100", badgeBg: "bg-teal-200", badgeText: "text-teal-800", nameText: "text-teal-700", avatarBg: "bg-teal-200" },
  { bg: "bg-pink-50", border: "border-pink-200", headerBg: "bg-pink-100", badgeBg: "bg-pink-200", badgeText: "text-pink-800", nameText: "text-pink-700", avatarBg: "bg-pink-200" },
  { bg: "bg-cyan-50", border: "border-cyan-200", headerBg: "bg-cyan-100", badgeBg: "bg-cyan-200", badgeText: "text-cyan-800", nameText: "text-cyan-700", avatarBg: "bg-cyan-200" },
  { bg: "bg-indigo-50", border: "border-indigo-200", headerBg: "bg-indigo-100", badgeBg: "bg-indigo-200", badgeText: "text-indigo-800", nameText: "text-indigo-700", avatarBg: "bg-indigo-200" },
];

export const AUTO_TEAM_NAMES = ["알파", "베타", "감마", "델타", "엡실론", "제타", "에타", "세타", "이오타", "카파", "람다", "뮤"];

export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildTeams(
  students: Student[],
  teamCount: number,
  sortAlpha: boolean,
  autoTeamName: boolean,
  preserveColors?: TeamColor[]
): Team[] {
  const shuffled = fisherYatesShuffle(students);
  const base = Math.floor(shuffled.length / teamCount);
  const extra = shuffled.length % teamCount;
  const teams: Team[] = [];
  let idx = 0;
  for (let i = 0; i < teamCount; i++) {
    const size = base + (i < extra ? 1 : 0);
    let members = shuffled.slice(idx, idx + size);
    if (sortAlpha) members = [...members].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    teams.push({
      id: i + 1,
      name: autoTeamName ? `${AUTO_TEAM_NAMES[i % AUTO_TEAM_NAMES.length]}팀` : `${i + 1}팀`,
      members,
      color: preserveColors?.[i] ?? TEAM_COLORS[i % TEAM_COLORS.length],
    });
    idx += size;
  }
  return teams;
}

export function teamsResultKey(teams: Team[]): string {
  return teams.map((t) => t.members.map((m) => m.id).join(",")).join("|");
}
