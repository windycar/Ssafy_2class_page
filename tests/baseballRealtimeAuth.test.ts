import assert from "node:assert/strict";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";

import { authenticateBaseballRealtime } from "../src/hooks/baseballRealtimeAuth.ts";

const AUTH_ID = "00000000-0000-4000-8000-000000000101";

function clientWith(overrides: {
  sessionAuthId?: string | null;
  verifiedAuthId?: string | null;
  verificationError?: boolean;
  realtimeError?: boolean;
} = {}) {
  const calls: string[] = [];
  const sessionAuthId = overrides.sessionAuthId === undefined ? AUTH_ID : overrides.sessionAuthId;
  const verifiedAuthId = overrides.verifiedAuthId === undefined ? AUTH_ID : overrides.verifiedAuthId;
  const client = {
    auth: {
      getSession: async () => {
        calls.push("getSession");
        return {
          data: {
            session: sessionAuthId
              ? { access_token: `signed-session-for-${sessionAuthId}` }
              : null,
          },
          error: null,
        };
      },
      getUser: async (token: string) => {
        calls.push(`getUser:${token}`);
        return {
          data: { user: verifiedAuthId ? { id: verifiedAuthId } : null },
          error: overrides.verificationError ? new Error("invalid jwt") : null,
        };
      },
    },
    realtime: {
      setAuth: async () => {
        calls.push("setAuth");
        if (overrides.realtimeError) throw new Error("realtime auth failed");
      },
    },
  } as unknown as Pick<SupabaseClient, "auth" | "realtime">;
  return { calls, client };
}

test("서버 검증된 현재 세션으로 Realtime 인증을 구독 전에 준비한다", async () => {
  const { calls, client } = clientWith();
  const result = await authenticateBaseballRealtime(client, AUTH_ID);

  assert.deepEqual(result, { ok: true, authId: AUTH_ID });
  assert.deepEqual(calls, [
    "getSession",
    `getUser:signed-session-for-${AUTH_ID}`,
    "setAuth",
  ]);
});

test("세션 부재·JWT 검증 실패·기대 사용자 불일치면 Realtime을 열지 않는다", async () => {
  for (const options of [
    { sessionAuthId: null },
    { verificationError: true },
    { verifiedAuthId: "00000000-0000-4000-8000-000000000999" },
  ]) {
    const { calls, client } = clientWith(options);
    assert.deepEqual(
      await authenticateBaseballRealtime(client, AUTH_ID),
      { ok: false, reason: "AUTH_ERROR" },
    );
    assert.equal(calls.includes("setAuth"), false);
  }
});

test("Realtime 인증 갱신 실패를 일반 로그인 실패와 구분한다", async () => {
  const { client } = clientWith({ realtimeError: true });
  assert.deepEqual(
    await authenticateBaseballRealtime(client, AUTH_ID),
    { ok: false, reason: "REALTIME_ERROR" },
  );
});
