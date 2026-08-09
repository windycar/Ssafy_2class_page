import assert from "node:assert/strict";
import test from "node:test";
import { countUniqueSolvedQuestions } from "../api/adminStudyProgress.ts";

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
  ]);

  assert.equal(counts.get(101), 4);
  assert.equal(counts.get(202), 1);
});
