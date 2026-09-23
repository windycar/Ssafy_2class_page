import assert from "node:assert/strict";
import test from "node:test";
import { combineTeamClassRosters } from "../src/utils/combineTeamClassRosters.ts";
import { buildMemberTeamRosters } from "../src/utils/memberTeamRosters.ts";

test("선택한 여러 반만 조합하고 같은 번호의 교육생도 각각 포함한다", () => {
  const first = {
    id: "first", name: "광주 1반",
    students: [{ id: 1, name: "가", username: "@a", class: "광주_1반" }],
  };
  const second = {
    id: "second", name: "광주 2반",
    students: [{ id: 1, name: "나", username: "@b", class: "광주_2반" }],
  };
  const combined = combineTeamClassRosters([first, second]);

  assert.equal(combined.name, "광주 1반 + 광주 2반");
  assert.deepEqual(combined.students.map((student) => student.name), ["가", "나"]);
  assert.equal(new Set(combined.students.map((student) => student.id)).size, 2);
  assert.equal(first.students[0].id, 1);
  assert.strictEqual(combineTeamClassRosters([first]), first);
});

test("관리자 등록 명단으로 광주 1~5반 전체 편성 후보를 만든다", () => {
  const base = Array.from({ length: 5 }, (_, index) => ({
    id: `gwangju-class-${index + 1}`,
    name: `광주 ${index + 1}반`,
    students: [],
  }));
  const rosters = buildMemberTeamRosters(base, [
    { id: 11, student_id: 101, name: "1반 신규", username: "@first", class_name: "광주_1반" },
    { id: 12, student_id: 202, name: "2반 신규", username: "@second", class_name: "광주_2반" },
    { id: 13, student_id: 404, name: "4반 신규", username: "@fourth", class_name: "광주_4반" },
  ]);
  const combined = combineTeamClassRosters(rosters);

  assert.equal(rosters.length, 5);
  assert.deepEqual(combined.students.map((student) => student.name), [
    "1반 신규", "2반 신규", "4반 신규",
  ]);
});
