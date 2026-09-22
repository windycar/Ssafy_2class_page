import type { TeamClassRoster } from "../types/classRoster";

export type TeamRosterMember = {
  id: number;
  student_id: number | null;
  name: string;
  username: string;
  class_name: string;
};

function classLabel(value: string) {
  return value.trim().replace(/_/g, " ").replace(/\s+/g, " ");
}

export function buildMemberTeamRosters(
  baseRosters: TeamClassRoster[],
  members: TeamRosterMember[],
): TeamClassRoster[] {
  const byClass = new Map<string, TeamClassRoster>();
  const rosters = baseRosters.map((roster) => {
    const next = { ...roster, students: [] as TeamClassRoster["students"] };
    byClass.set(classLabel(roster.name), next);
    return next;
  });

  for (const member of members) {
    const label = classLabel(member.class_name);
    if (!label) continue;
    let roster = byClass.get(label);
    if (!roster) {
      roster = { id: `member-class:${label}`, name: label, students: [] };
      byClass.set(label, roster);
      rosters.push(roster);
    }
    roster.students.push({
      id: member.student_id ?? 900_000_000 + member.id,
      name: member.name,
      username: member.username,
      class: member.class_name,
    });
  }

  return rosters;
}
