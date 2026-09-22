import assert from "node:assert/strict";
import test from "node:test";
import { buildMemberTeamRosters } from "../src/utils/memberTeamRosters.ts";

const base = [
  { id: "gwangju-class-1", name: "광주 1반", students: [{ id: 99, name: "옛 학생", username: "@old", class: "광주_1반" }] },
  { id: "gwangju-class-2", name: "광주 2반", students: [] },
];

test("관리자에 등록된 회원 명단이 기존 반 명단을 교체한다", () => {
  const rosters = buildMemberTeamRosters(base, [
    { id: 7, student_id: 1001, name: "새 학생", username: "@new", class_name: "광주_1반" },
    { id: 8, student_id: null, name: "번호 없는 학생", username: "@none", class_name: "광주_2반" },
  ]);

  assert.deepEqual(rosters.map((roster) => roster.students.length), [1, 1]);
  assert.equal(rosters[0].students[0].name, "새 학생");
  assert.equal(rosters[1].students[0].id, 900_000_008);
  assert.equal(base[0].students[0].name, "옛 학생");
});

test("관리자에서 새로 만든 반도 선택 목록에 추가하고 빈 반은 유지한다", () => {
  const rosters = buildMemberTeamRosters(base, [
    { id: 9, student_id: 5001, name: "다른 학생", username: "@other", class_name: "광주_5반" },
  ]);

  assert.deepEqual(rosters.map((roster) => roster.name), ["광주 1반", "광주 2반", "광주 5반"]);
  assert.equal(rosters[0].students.length, 0);
  assert.equal(rosters[2].students[0].id, 5001);
});
