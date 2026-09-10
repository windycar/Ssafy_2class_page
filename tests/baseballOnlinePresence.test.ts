import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  connectedBaseballOnlineAuthIds,
  hasAllBaseballOnlineParticipants,
  parseBaseballOnlinePresenceMeta,
  type BaseballOnlinePresenceContext,
} from "../src/hooks/useBaseballOnlinePresence.ts";

const AUTH_0 = "00000000-0000-4000-8000-000000000101";
const AUTH_1 = "00000000-0000-4000-8000-000000000202";
const context: BaseballOnlinePresenceContext = {
  roomId: "baseball-online-presence-room",
  matchId: "baseball-online-presence-match",
  participants: [
    { authId: AUTH_0, seat: 0 },
    { authId: AUTH_1, seat: 1 },
  ],
};

function meta(authId: string, seat: 0 | 1, connectionId: string) {
  return {
    schemaVersion: 1,
    roomId: context.roomId,
    matchId: context.matchId,
    authId,
    seat,
    connectionId,
    presence_ref: `ref-${connectionId}`,
  };
}

test("Realtime Presence state에서 현재 match의 두 room member만 접속자로 인정한다", () => {
  const state = {
    [AUTH_0]: [
      meta(AUTH_0, 0, "presence-visitor-tab-1"),
      meta(AUTH_0, 0, "presence-visitor-tab-2"),
    ],
    [AUTH_1]: [meta(AUTH_1, 1, "presence-home-tab-1")],
    "forged-key": [meta(AUTH_1, 1, "presence-forged")],
  };
  const connected = connectedBaseballOnlineAuthIds(state, context);

  assert.deepEqual([...connected].sort(), [AUTH_0, AUTH_1].sort());
  assert.equal(hasAllBaseballOnlineParticipants(connected, context.participants), true);
});

test("다른 match·잘못된 seat·state 동봉·presence key 위조를 거부한다", () => {
  assert.equal(parseBaseballOnlinePresenceMeta({
    ...meta(AUTH_0, 0, "presence-wrong-match"),
    matchId: "baseball-other-match",
  }, context), null);
  assert.equal(parseBaseballOnlinePresenceMeta(
    meta(AUTH_0, 1, "presence-wrong-seat"),
    context,
  ), null);
  assert.equal(parseBaseballOnlinePresenceMeta({
    ...meta(AUTH_0, 0, "presence-state-smuggle"),
    gameState: { revision: 999 },
  }, context), null);
  assert.equal(parseBaseballOnlinePresenceMeta({
    ...meta(AUTH_0, 0, "presence-unknown-field"),
    arbitrary: true,
  }, context), null);

  const forgedKey = connectedBaseballOnlineAuthIds({
    [AUTH_0]: [meta(AUTH_1, 1, "presence-forged-key")],
  }, context);
  assert.deepEqual([...forgedKey], []);
  assert.equal(hasAllBaseballOnlineParticipants(new Set([AUTH_0]), context.participants), false);
});

test("Presence hook은 검증된 비공개 채널과 track/untrack만 쓰며 room JSON을 쓰지 않는다", async () => {
  const source = await readFile(
    new URL("../src/hooks/useBaseballOnlinePresence.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /authenticateBaseballRealtime\(supabase, currentAuthId\)/);
  assert.match(source, /private:\s*true/);
  assert.ok(
    source.indexOf("const realtimeAuth = await authenticateBaseballRealtime")
      < source.indexOf("const channel = supabase.channel"),
  );
  assert.match(source, /presenceState\s*\(/);
  assert.match(source, /\.track\s*\(/);
  assert.match(source, /\.untrack\s*\(/);
  assert.doesNotMatch(source, /baseballRoomStorage/);
  assert.doesNotMatch(source, /\.updateRoom\s*\(/);
  assert.doesNotMatch(source, /\.upsert\s*\(/);
  assert.doesNotMatch(source, /Math\.random/);
});

test("Presence 접속자 집계는 서버 권한이 아닌 advisory 신호임을 고정한다", async () => {
  const source = await readFile(
    new URL("../src/hooks/useBaseballOnlinePresence.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /advisory liveness signal only/);
  assert.match(source, /must never authorize a gameplay command or seat/);
});
