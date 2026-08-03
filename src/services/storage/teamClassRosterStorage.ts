import type { TeamClassRoster } from "../../types/classRoster";

const ROSTERS_KEY = "ssafy-team-class-rosters-v1";
const SELECTED_CLASS_KEY = "ssafy-team-selected-class-v1";

function isTeamClassRoster(value: unknown): value is TeamClassRoster {
  if (!value || typeof value !== "object") return false;
  const roster = value as TeamClassRoster;
  return (
    typeof roster.id === "string" &&
    typeof roster.name === "string" &&
    Array.isArray(roster.students) &&
    roster.students.every(
      (student) =>
        student &&
        typeof student.id === "number" &&
        typeof student.name === "string" &&
        typeof student.username === "string" &&
        typeof student.class === "string",
    )
  );
}

export const teamClassRosterStorage = {
  getRosters(): TeamClassRoster[] {
    try {
      const raw = localStorage.getItem(ROSTERS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isTeamClassRoster) : [];
    } catch {
      return [];
    }
  },

  setRosters(rosters: TeamClassRoster[]): void {
    try {
      localStorage.setItem(ROSTERS_KEY, JSON.stringify(rosters));
    } catch {
      // 팀 편성 자체는 저장 공간을 사용할 수 없는 환경에서도 계속 동작합니다.
    }
  },

  getSelectedClassId(): string | null {
    try {
      return localStorage.getItem(SELECTED_CLASS_KEY);
    } catch {
      return null;
    }
  },

  setSelectedClassId(classId: string): void {
    try {
      localStorage.setItem(SELECTED_CLASS_KEY, classId);
    } catch {
      // 선택 상태 저장이 실패해도 현재 화면의 반 전환은 유지합니다.
    }
  },
};
