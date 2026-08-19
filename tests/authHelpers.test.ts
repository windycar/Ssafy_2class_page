import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeLoginId,
  providerPassword,
  isMissingSpecialMockExamAccessColumn,
  studyOwnerStudentId,
} from "../api/auth.ts";
import {
  profileMatchesSession,
  shouldRefreshProfileForAuthEvent,
} from "../src/utils/authSession.ts";

test("로그인 아이디는 @, 공백, 대문자를 정규화한다", () => {
  assert.equal(normalizeLoginId("  @BlueIshSun24  "), "blueishsun24");
});

test("사용자에게 보이는 4자리 비밀번호는 Auth 공급자용 긴 비밀번호로 변환된다", () => {
  const transformed = providerPassword("1234");
  assert.notEqual(transformed, "1234");
  assert.ok(transformed.length >= 12);
  assert.equal(providerPassword("1234"), transformed);
  assert.notEqual(providerPassword("5678"), transformed);
});

test("Supabase 로그인·토큰 갱신 이벤트에서 회원 프로필을 다시 읽는다", () => {
  assert.equal(shouldRefreshProfileForAuthEvent("SIGNED_IN", true), true);
  assert.equal(shouldRefreshProfileForAuthEvent("TOKEN_REFRESHED", true), true);
  assert.equal(shouldRefreshProfileForAuthEvent("USER_UPDATED", true), true);
  assert.equal(shouldRefreshProfileForAuthEvent("SIGNED_OUT", false), false);
});

test("세션의 Auth 사용자와 API 회원 프로필이 같은 계정인지 검증한다", () => {
  assert.equal(profileMatchesSession("auth-a", "auth-a"), true);
  assert.equal(profileMatchesSession("auth-a", "auth-b"), false);
  assert.equal(profileMatchesSession("auth-a", null), false);
});

test("학습 기록 소유자 ID는 교육생 ID를 우선하고 관리자는 충돌 없는 ID를 쓴다", () => {
  assert.equal(studyOwnerStudentId({ id: 18, student_id: 18 }), 18);
  assert.equal(studyOwnerStudentId({ id: 24, student_id: null }), 900_000_024);
});

test("특별 모의고사 권한 열이 아직 없는 DB 오류만 호환 대상으로 판별한다", () => {
  assert.equal(
    isMissingSpecialMockExamAccessColumn({
      code: "PGRST204",
      message: "Could not find the 'can_access_special_mock_exam' column",
    }),
    true,
  );
  assert.equal(
    isMissingSpecialMockExamAccessColumn({
      code: "42501",
      message: "permission denied",
    }),
    false,
  );
});

