import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSpecialMockExamAttemptFilter,
  countUniqueSolvedQuestions,
} from "../api/adminStudyProgress.ts";
import {
  getSpecialMockExamAttemptIdPrefix,
  SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS,
  SPECIAL_MOCK_EXAM_ROUNDS,
} from "../src/types/specialMockExam.ts";

test("counts each solved question once per question bank", () => {
  const counts = countUniqueSolvedQuestions([
    [
      { student_id: 101, question_id: "python-1" },
      { student_id: 101, question_id: "python-1" },
      { student_id: 101, question_id: "python-2" },
      { student_id: 202, question_id: "python-1" },
    ],
    [
      { student_id: 101, question_id: "python-1" },
      { student_id: 101, question_id: "web-1" },
    ],
    [],
    [],
    [
      { student_id: 101, question_id: "assessment-2-round-1-exam-mc-001" },
      { student_id: 101, question_id: "assessment-2-round-1-exam-mc-001" },
    ],
  ]);

  assert.equal(counts.get(101), 5);
  assert.equal(counts.get(202), 1);
});

test("관리자 명단 조회는 과목평가 2·3회차의 현재 문제은행 ID만 필터링한다", () => {
  const filter = buildSpecialMockExamAttemptFilter(
    SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS,
    SPECIAL_MOCK_EXAM_ROUNDS,
    getSpecialMockExamAttemptIdPrefix,
  );
  assert.equal(filter.match(/and\(/g)?.length, 10);
  assert.match(
    filter,
    /and\(assessment_round\.eq\.2,mock_round\.eq\.1,id\.like\.special-mock-a2-r1-v3-%\)/,
  );
  assert.match(
    filter,
    /and\(assessment_round\.eq\.3,mock_round\.eq\.5,id\.like\.special-mock-a3-r5-v1-%\)/,
  );
  assert.doesNotMatch(filter, /undefined/);
});
