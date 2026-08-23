import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";
import * as presence from "../src/hooks/useBaseballRoomPresence.ts";

function createRoom(nowMs: number): BaseballRoom {
  const joinedAt = new Date(nowMs - 300_000).toISOString();
  const lastSeenAt = new Date(nowMs).toISOString();
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    id: "baseball-presence-room",
    title: "프레즌스 테스트 방",
    description: "",
    hostStudentId: 1,
    maxPlayers: 2,
    isPublic: false,
    status: "ready",
    players: [
      {
        seat: 0,
        studentId: 1,
        authId: "auth-1",
        name: "방장",
        username: "host",
        isHost: true,
        isReady: true,
        status: "ready",
        joinedAt,
        sessionId: "session-host",
        lastSeenAt,
      },
      {
        seat: 1,
        studentId: 2,
        authId: "auth-2",
        name: "손님",
        username: "guest",
        isHost: false,
        isReady: true,
        status: "ready",
        joinedAt,
        sessionId: "session-guest",
        lastSeenAt,
      },
    ],
    activityLogs: [],
    createdAt: joinedAt,
  };
}

test("heartbeat는 해당 세션만 갱신하고 원본 방을 변경하지 않는다", () => {
  const nowMs = Date.parse("2026-08-23T12:00:00.000Z");
  const room = createRoom(nowMs - 20_000);
  const before = structuredClone(room);
  const updated = presence.withBaseballPresenceHeartbeat(
    room,
    1,
    "session-reloaded",
    nowMs,
  );

  assert.ok(updated);
  assert.deepEqual(room, before);
  assert.equal(updated.revision, room.revision + 1);
  assert.equal(updated.players[0].sessionId, "session-reloaded");
  assert.equal(updated.players[0].lastSeenAt, "2026-08-23T12:00:00.000Z");
  assert.deepEqual(updated.players[1], room.players[1]);
  assert.equal(
    presence.withBaseballPresenceHeartbeat(room, 999, "missing", nowMs),
    null,
  );
  assert.equal(
    presence.withBaseballPresenceHeartbeat(room, 1, "invalid-time", Number.MAX_VALUE),
    null,
  );
});

test("세션과 유효한 heartbeat가 모두 있어야 stale로 판정한다", () => {
  const nowMs = Date.parse("2026-08-23T12:00:00.000Z");
  const staleAfterMs = 90_000;

  assert.equal(presence.isBaseballPresenceStale({}, nowMs, staleAfterMs), false);
  assert.equal(presence.isBaseballPresenceStale({
    sessionId: "s",
    lastSeenAt: new Date(nowMs - staleAfterMs).toISOString(),
  }, nowMs, Number.NaN), false);
  assert.equal(presence.isBaseballPresenceStale({ sessionId: "s" }, nowMs, staleAfterMs), false);
  assert.equal(presence.isBaseballPresenceStale({
    sessionId: "s",
    lastSeenAt: "invalid",
  }, nowMs, staleAfterMs), false);
  assert.equal(presence.isBaseballPresenceStale({
    sessionId: "s",
    lastSeenAt: new Date(nowMs + 1).toISOString(),
  }, nowMs, staleAfterMs), false);
  assert.equal(presence.isBaseballPresenceStale({
    sessionId: "s",
    lastSeenAt: new Date(nowMs - staleAfterMs + 1).toISOString(),
  }, nowMs, staleAfterMs), false);
  assert.equal(presence.isBaseballPresenceStale({
    sessionId: "s",
    lastSeenAt: new Date(nowMs - staleAfterMs).toISOString(),
  }, nowMs, staleAfterMs), true);
});

test("경기 시작은 두 좌석 모두 최근 heartbeat가 있는 경우에만 허용한다", () => {
  const nowMs = Date.parse("2026-08-23T12:00:00.000Z");
  const room = createRoom(nowMs);
  assert.equal(presence.isBaseballPresenceFreshForStart(room.players[0], nowMs), true);

  assert.equal(presence.isBaseballPresenceFreshForStart({
    sessionId: "session-host",
    lastSeenAt: new Date(
      nowMs - presence.BASEBALL_PRESENCE_START_MAX_AGE_MS - 1,
    ).toISOString(),
  }, nowMs), false);
  assert.equal(presence.isBaseballPresenceFreshForStart({
    sessionId: "session-host",
    lastSeenAt: new Date(
      nowMs - presence.BASEBALL_PRESENCE_START_MAX_AGE_MS,
    ).toISOString(),
  }, nowMs), true);
  assert.equal(presence.isBaseballPresenceFreshForStart({
    lastSeenAt: new Date(nowMs).toISOString(),
  }, nowMs), false);
  assert.equal(presence.isBaseballPresenceFreshForStart({
    sessionId: "future-session",
    lastSeenAt: new Date(
      nowMs + presence.BASEBALL_PRESENCE_HEARTBEAT_MS + 1,
    ).toISOString(),
  }, nowMs), false);
});

test("stale 세션은 두 번의 연속 관찰과 확인 유예가 지나야 확정한다", () => {
  const nowMs = Date.parse("2026-08-23T12:00:00.000Z");
  const room = createRoom(nowMs);
  room.players[1].lastSeenAt = new Date(nowMs - 100_000).toISOString();

  const first = presence.reconcileBaseballStaleCandidates(
    room,
    1,
    nowMs,
    {},
    90_000,
    30_000,
  );
  assert.deepEqual(first.confirmedStudentIds, []);
  assert.deepEqual(first.candidates["2"], {
    sessionId: "session-guest",
    firstObservedAt: nowMs,
  });

  const beforeGrace = presence.reconcileBaseballStaleCandidates(
    room,
    1,
    nowMs + 29_999,
    first.candidates,
    90_000,
    30_000,
  );
  assert.deepEqual(beforeGrace.confirmedStudentIds, []);

  const confirmed = presence.reconcileBaseballStaleCandidates(
    room,
    1,
    nowMs + 30_000,
    beforeGrace.candidates,
    90_000,
    30_000,
  );
  assert.deepEqual(confirmed.confirmedStudentIds, [2]);
});

test("heartbeat 회복이나 새 세션 재접속은 기존 stale 후보를 즉시 무효화한다", () => {
  const nowMs = Date.parse("2026-08-23T12:00:00.000Z");
  const room = createRoom(nowMs);
  room.players[1].lastSeenAt = new Date(nowMs - 100_000).toISOString();
  const first = presence.reconcileBaseballStaleCandidates(
    room,
    1,
    nowMs,
    {},
    90_000,
    30_000,
  );

  const recovered = structuredClone(room);
  recovered.players[1].lastSeenAt = new Date(nowMs + 10_000).toISOString();
  const afterHeartbeat = presence.reconcileBaseballStaleCandidates(
    recovered,
    1,
    nowMs + 10_000,
    first.candidates,
    90_000,
    30_000,
  );
  assert.deepEqual(afterHeartbeat, { candidates: {}, confirmedStudentIds: [] });

  const reconnected = structuredClone(room);
  reconnected.players[1].sessionId = "session-guest-reconnected";
  const afterReconnect = presence.reconcileBaseballStaleCandidates(
    reconnected,
    1,
    nowMs + 30_000,
    first.candidates,
    90_000,
    30_000,
  );
  assert.deepEqual(afterReconnect.confirmedStudentIds, []);
  assert.deepEqual(afterReconnect.candidates["2"], {
    sessionId: "session-guest-reconnected",
    firstObservedAt: nowMs + 30_000,
  });
});

test("현재 방 내부 경로와 이름이 비슷한 외부 경로를 정확히 구분한다", () => {
  const roomId = "baseball-presence-room";
  assert.equal(
    presence.isBaseballRoomPath(roomId, `/games/baseball/rooms/${roomId}`),
    true,
  );
  assert.equal(
    presence.isBaseballRoomPath(roomId, `/games/baseball/rooms/${roomId}/play`),
    true,
  );
  assert.equal(
    presence.isBaseballRoomPath(roomId, `/games/baseball/rooms/${roomId}-other`),
    false,
  );
  assert.equal(presence.isBaseballRoomPath(roomId, "/games/baseball/rooms"), false);
});

test("pagehide와 sendBeacon 기반 즉시 퇴장을 다시 도입하지 않는다", async () => {
  const source = await readFile(
    new URL("../src/hooks/useBaseballRoomPresence.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /addEventListener\(["']pagehide["']/);
  assert.doesNotMatch(source, /sendBeacon\s*\(/);
  assert.doesNotMatch(source, /\/api\/baseball-leave/);
  assert.ok(
    presence.BASEBALL_PRESENCE_STALE_AFTER_MS
      > presence.BASEBALL_PRESENCE_HEARTBEAT_MS,
  );
  assert.ok(presence.BASEBALL_PRESENCE_STALE_CONFIRM_MS > 0);
});
