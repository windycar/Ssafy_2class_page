import assert from "node:assert/strict";
import test from "node:test";
import {
  getAiPythonWeekAttemptIdPrefix,
  isCurrentAiPythonWeekAttempt,
} from "../src/types/aiPythonWeekStudy.ts";

test("교체된 주차별 문제은행은 현재 버전 기록만 사용한다", () => {
  assert.equal(getAiPythonWeekAttemptIdPrefix("week1"), "ai-python-week-v6-");
  assert.equal(getAiPythonWeekAttemptIdPrefix("week2"), "ai-python-week-v8-");

  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v5-old", week: "week1" }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v6-new", week: "week1" }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v5-old", week: "week2" }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v6-old", week: "week2" }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v7-old", week: "week2" }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({ id: "ai-python-week-v8-new", week: "week2" }),
    true,
  );
});
