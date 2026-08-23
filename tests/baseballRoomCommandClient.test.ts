import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  parseBaseballRoomCommandEnvelope,
  resolveBaseballRoomSessionId,
  sendBaseballRoomCommand,
  type BaseballRoomCommandClientDependencies,
  type BaseballRoomCommandEnvelope,
} from "../src/services/baseballRoomCommandClient.ts";
import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";

const NOW = "2026-08-23T12:00:00.000Z";

function canonicalRoom(revision = 6): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision,
    id: "baseball-secure-client-room",
    title: "인증 명령 방",
    description: "",
    hostStudentId: 101,
    maxPlayers: 2,
    isPublic: false,
    status: "ready",
    players: [
      {
        seat: 0,
        studentId: 101,
        authId: "00000000-0000-4000-8000-000000000101",
        name: "방장",
        username: "host",
        isHost: true,
        isReady: true,
        status: "ready",
        joinedAt: NOW,
        sessionId: "session-host-123",
        lastSeenAt: NOW,
      },
      {
        seat: 1,
        studentId: 202,
        authId: "00000000-0000-4000-8000-000000000202",
        name: "손님",
        username: "guest",
        isHost: false,
        isReady: false,
        status: "waiting",
        joinedAt: NOW,
        sessionId: "session-guest-123",
        lastSeenAt: NOW,
      },
    ],
    activityLogs: [],
    createdAt: NOW,
  };
}

function dependencies(
  responses: Response | Response[],
  capture?: (input: RequestInfo | URL, init?: RequestInit) => void,
): BaseballRoomCommandClientDependencies {
  const queue = Array.isArray(responses) ? [...responses] : [responses];
  return {
    async getAccessToken() { return "current-room-session-token"; },
    async fetch(input, init) {
      capture?.(input, init);
      const response = queue.shift();
      if (!response) throw new Error("unexpected fetch");
      return response;
    },
  };
}

function joinEnvelope(expectedRevision = 5): BaseballRoomCommandEnvelope {
  return {
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-join-command-1",
    kind: "JOIN",
    roomId: "baseball-secure-client-room",
    expectedRevision,
    payload: { sessionId: "session-guest-123" },
  };
}

test("Bearer 인증과 allow-list 요청만 사용하고 클라이언트 신원·방 전체를 제거한다", async () => {
  const room = canonicalRoom();
  const raw = {
    ...joinEnvelope(),
    studentId: 999_999,
    authId: "forged-auth",
    players: [{ studentId: 999_999 }],
    room,
    payload: {
      sessionId: "session-guest-123",
      studentId: 999_999,
      authId: "forged-auth",
      players: [],
      room,
    },
  } as unknown as BaseballRoomCommandEnvelope;
  let capturedUrl: RequestInfo | URL | undefined;
  let capturedInit: RequestInit | undefined;
  const result = await sendBaseballRoomCommand(raw, dependencies(Response.json({
    ok: true,
    idempotent: false,
    commandId: raw.commandId,
    room,
  }), (url, init) => {
    capturedUrl = url;
    capturedInit = init;
  }));

  assert.equal(capturedUrl, "/api/baseball-room-command");
  assert.equal(capturedInit?.method, "POST");
  assert.equal(capturedInit?.keepalive, false);
  assert.equal(
    (capturedInit?.headers as Record<string, string>).authorization,
    "Bearer current-room-session-token",
  );
  assert.deepEqual(JSON.parse(String(capturedInit?.body)), joinEnvelope());
  assert.deepEqual(result, {
    ok: true,
    status: 200,
    idempotent: false,
    commandId: raw.commandId,
    room,
  });
});

test("CREATE와 여섯 revision 명령의 최소 payload 계약을 강제한다", () => {
  const create = parseBaseballRoomCommandEnvelope({
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-create-command-1",
    kind: "CREATE",
    payload: {
      title: "  새 야구방  ",
      description: " 설명 ",
      isPublic: true,
      sessionId: "session-host-123",
    },
  });
  assert.deepEqual(create, {
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-create-command-1",
    kind: "CREATE",
    payload: {
      title: "새 야구방",
      description: "설명",
      isPublic: true,
      sessionId: "session-host-123",
    },
  });

  for (const kind of ["JOIN", "HEARTBEAT", "START", "LEAVE", "CANCEL"] as const) {
    const parsed = parseBaseballRoomCommandEnvelope({
      schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
      commandId: `baseball-room-${kind.toLowerCase()}-command`,
      kind,
      roomId: "baseball-secure-client-room",
      expectedRevision: 5,
      payload: { sessionId: "session-host-123" },
    });
    assert.equal(parsed?.kind, kind);
    assert.deepEqual(parsed?.payload, { sessionId: "session-host-123" });
  }
  const ready = parseBaseballRoomCommandEnvelope({
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-ready-command",
    kind: "SET_READY",
    roomId: "baseball-secure-client-room",
    expectedRevision: 5,
    payload: { sessionId: "session-host-123", isReady: true },
  });
  assert.deepEqual(ready?.payload, { sessionId: "session-host-123", isReady: true });

  assert.equal(parseBaseballRoomCommandEnvelope({
    ...joinEnvelope(),
    expectedRevision: -1,
  }), null);
  assert.equal(parseBaseballRoomCommandEnvelope({
    ...joinEnvelope(),
    payload: { sessionId: "short" },
  }), null);
  assert.equal(parseBaseballRoomCommandEnvelope({
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-malformed-create",
    kind: "CREATE",
    payload: {
      title: 123,
      description: "",
      isPublic: true,
      sessionId: "session-host-123",
    },
  } as unknown as BaseballRoomCommandEnvelope), null);
  assert.equal(parseBaseballRoomCommandEnvelope({
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-create-with-revision",
    kind: "CREATE",
    roomId: "baseball-client-forged-room",
    expectedRevision: 0,
    payload: {
      title: "새 방",
      description: "",
      isPublic: true,
      sessionId: "session-host-123",
    },
  } as unknown as BaseballRoomCommandEnvelope), null);
});

test("409는 canonical room을 반환하고 LEAVE 삭제 성공은 keepalive로 전송한다", async () => {
  const canonical = canonicalRoom(8);
  const conflict = await sendBaseballRoomCommand(joinEnvelope(7), dependencies(Response.json({
    ok: false,
    code: "STALE_REVISION",
    room: canonical,
  }, { status: 409 })));
  assert.deepEqual(conflict, {
    ok: false,
    status: 409,
    code: "STALE_REVISION",
    room: canonical,
  });

  let keepalive: boolean | undefined;
  const leave = await sendBaseballRoomCommand({
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: "baseball-room-leave-command-1",
    kind: "LEAVE",
    roomId: canonical.id,
    expectedRevision: canonical.revision,
    payload: { sessionId: "session-host-123" },
  }, dependencies(Response.json({
    ok: true,
    idempotent: false,
    commandId: "baseball-room-leave-command-1",
    deleted: true,
  }), (_url, init) => {
    keepalive = init?.keepalive;
  }));
  assert.equal(keepalive, true);
  assert.deepEqual(leave, {
    ok: true,
    status: 200,
    idempotent: false,
    commandId: "baseball-room-leave-command-1",
    deleted: true,
  });
});

test("탭 session id는 sessionStorage에서 복구하고 저장 실패 시 안전하게 폴백한다", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
  };
  const first = resolveBaseballRoomSessionId(storage, () => "session-created-123");
  const restored = resolveBaseballRoomSessionId(storage, () => "must-not-run");
  assert.equal(first, "session-created-123");
  assert.equal(restored, first);

  const fallback = resolveBaseballRoomSessionId({
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  }, () => "session-memory-fallback");
  assert.equal(fallback, "session-memory-fallback");
});

test("인증·네트워크·canonical 응답 오류를 typed failure로 닫는다", async () => {
  const command = joinEnvelope();
  assert.deepEqual(await sendBaseballRoomCommand(command, {
    async getAccessToken() { return null; },
    async fetch() { throw new Error("must not fetch"); },
  }), { ok: false, status: 401, code: "AUTH_REQUIRED" });
  assert.deepEqual(await sendBaseballRoomCommand(command, {
    async getAccessToken() { throw new Error("expired"); },
    async fetch() { throw new Error("must not fetch"); },
  }), { ok: false, status: 401, code: "AUTH_SESSION_FAILED" });
  assert.deepEqual(await sendBaseballRoomCommand(command, {
    async getAccessToken() { return "token"; },
    async fetch() { throw new Error("offline"); },
  }), { ok: false, status: 0, code: "NETWORK_ERROR" });
  assert.deepEqual(await sendBaseballRoomCommand(command, dependencies(Response.json({
    ok: false,
    code: "STALE_REVISION",
  }, { status: 409 }))), {
    ok: false,
    status: 502,
    code: "INVALID_CANONICAL_ROOM",
  });

  const staleSuccess = canonicalRoom(command.expectedRevision);
  assert.deepEqual(await sendBaseballRoomCommand(command, dependencies(Response.json({
    ok: true,
    idempotent: false,
    commandId: command.commandId,
    room: staleSuccess,
  }))), {
    ok: false,
    status: 502,
    code: "COMMAND_RESPONSE_MISMATCH",
  });
});

test("야구 대기실 클라이언트에는 whole-room 원격 쓰기 경로가 남지 않는다", async () => {
  const sources = await Promise.all([
    "../src/services/storage/baseballRoomStorage.ts",
    "../src/hooks/useBaseballRooms.ts",
    "../src/hooks/useBaseballRoomPresence.ts",
    "../src/views/games/BaseballRoomsView.tsx",
    "../src/views/games/BaseballRoomView.tsx",
    "../src/views/games/BaseballGameView.tsx",
  ].map((relativePath) => readFile(new URL(relativePath, import.meta.url), "utf8")));
  const source = sources.join("\n");
  assert.doesNotMatch(
    source,
    /baseballRoomStorage\.(?:createRoom|updateRoom|leaveRoom|deleteRoom)/,
  );
  assert.doesNotMatch(sources[0], /\.upsert\s*\(|\.delete\s*\(\)/);
  assert.match(sources[3], /await createRoom\(data\)/);
  assert.match(sources[4], /let result = await sendJoin\(0\)/);
  assert.match(sources[4], /result = await sendJoin\(result\.room\.revision\)/);
  assert.match(sources[4], /kind:\s*"START"|executeCommand\("START"\)/);
  assert.doesNotMatch(sources[4], /createGameState|matchId:\s*createId|players:\s*room\.players/);
  assert.match(sources[2], /result\.status === 409/);
  assert.match(sources[2], /result = await sendAtRevision\(result\.room\.revision\)/);
});
