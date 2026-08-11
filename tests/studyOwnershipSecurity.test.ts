import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const STUDY_SCHEMA_FILES = [
  "supabase/study_progress.sql",
  "supabase/web_study_progress.sql",
  "supabase/ai_python_study_progress.sql",
  "supabase/ai_python_week_progress.sql",
];

test("모든 학습 기록 SQL은 익명 접근을 제거하고 회원·학생 소유권을 함께 검사한다", () => {
  for (const path of STUDY_SCHEMA_FILES) {
    const sql = readFileSync(path, "utf8");
    assert.doesNotMatch(sql, /to\s+anon\s*,/i, `${path}: anon 정책이 남아 있습니다.`);
    assert.doesNotMatch(
      sql,
      /auth_user_id\s+is\s+null\s+or/i,
      `${path}: null 소유자 허용 정책이 남아 있습니다.`,
    );
    assert.match(sql, /(?:members|m)\.auth_user_id\s*=\s*\(select auth\.uid\(\)\)/i);
    assert.match(sql, /members\.student_id|m\.student_id/i);
    assert.match(sql, /for\s+update\s+to\s+authenticated/i);
  }
});

test("보안 마이그레이션은 기존 기록을 회원에게 귀속하고 anon 권한을 회수한다", () => {
  const sql = readFileSync(
    "supabase/migrations/20260811055937_secure_study_attempt_ownership.sql",
    "utf8",
  );

  for (const table of [
    "study_attempts",
    "web_study_attempts",
    "ai_python_study_attempts",
  ]) {
    assert.match(sql, new RegExp(`update public\\.${table}`, "i"));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from anon`, "i"));
  }
});
