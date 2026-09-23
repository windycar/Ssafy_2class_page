import type { TeamClassRoster } from "../types/classRoster";

/** 여러 반에 같은 교육생 번호가 있어도 편성 후보를 각각 구분합니다. */
export function combineTeamClassRosters(rosters: TeamClassRoster[]): TeamClassRoster {
  if (rosters.length === 0) {
    throw new Error("조합할 반이 없습니다.");
  }
  if (rosters.length === 1) return rosters[0];

  const usedIds = new Set<number>();
  let nextId = -1;
  const students = rosters.flatMap((roster) =>
    roster.students.map((student) => {
      let id = student.id;
      if (usedIds.has(id)) {
        while (usedIds.has(nextId)) nextId--;
        id = nextId--;
      }
      usedIds.add(id);
      return { ...student, id };
    }),
  );

  return {
    id: `combined:${rosters.map((roster) => roster.id).join("+")}`,
    name: rosters.map((roster) => roster.name).join(" + "),
    students,
  };
}
