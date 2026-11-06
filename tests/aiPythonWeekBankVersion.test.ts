import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  getAiPythonWeekAttemptIdPrefix,
  isCurrentAiPythonWeekAttempt,
} from "../src/types/aiPythonWeekStudy.ts";

test("교체된 주차별 문제은행은 현재 버전 기록만 사용한다", () => {
  assert.equal(getAiPythonWeekAttemptIdPrefix("week1"), "ai-python-week-v6-");
  assert.equal(getAiPythonWeekAttemptIdPrefix("week2"), "ai-python-week-v8-");
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week3-1"),
    "ai-python-week3-1-v1-",
  );
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week3-2"),
    "ai-python-week3-2-v1-",
  );
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week4-1"),
    "ai-python-week4-1-v1-",
  );
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week4-2"),
    "ai-python-week4-2-v1-",
  );
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week5-1"),
    "ai-python-week5-1-v1-",
  );
  assert.equal(
    getAiPythonWeekAttemptIdPrefix("week5-2"),
    "ai-python-week5-2-v1-",
  );

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
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week3-1-v1-new",
      week: "week3-1",
    }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week3-1-v0-old",
      week: "week3-1",
    }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week3-2-v1-new",
      week: "week3-2",
    }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week3-2-v0-old",
      week: "week3-2",
    }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week4-1-v1-new",
      week: "week4-1",
    }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week4-1-v0-old",
      week: "week4-1",
    }),
    false,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week4-2-v1-new",
      week: "week4-2",
    }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week5-1-v1-new",
      week: "week5-1",
    }),
    true,
  );
  assert.equal(
    isCurrentAiPythonWeekAttempt({
      id: "ai-python-week5-2-v1-new",
      week: "week5-2",
    }),
    true,
  );
});

test("AI Python 5-2 풀이 기록을 Supabase 허용 범위에 포함한다", () => {
  const migration = readFileSync(
    new URL(
      "../supabase/migrations/20260826130117_ai_python_week5_2.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const schema = readFileSync(
    new URL("../supabase/ai_python_week_progress.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /drop constraint if exists ai_python_week_attempts_week_check/i);
  assert.match(migration, /'week5-1', 'week5-2'/);
  assert.match(schema, /'week5-1', 'week5-2'/);
});
