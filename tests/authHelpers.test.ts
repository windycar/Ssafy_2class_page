import test from "node:test";
import assert from "node:assert/strict";
import { normalizeLoginId, providerPassword } from "../api/auth.ts";

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

