import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createBaseballClientId,
  sendBaseballCommand,
  type BaseballCommandClientDependencies,
} from "../src/services/baseballCommandClient.ts";
import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";
import {
  BASEBALL_ONLINE_PROTOCOL_VERSION,
  type BaseballMatchCommandEnvelope,
} from "../src/utils/games/baseball/onlineProtocol.ts";
import {
  createGameState,
  getCurrentPitcher,
} from "../src/utils/games/baseball/gameState.ts";

const NOW = "2026-08-23T12:00:00.000Z";
const AUTH_ID_0 = "00000000-0000-4000-8000-000000000101";
const AUTH_ID_1 = "00000000-0000-4000-8000-000000000202";

function room(): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    id: "baseball-client-room",
    title: "명령 클라이언트 테스트",
    description: "",
    hostStudentId: 101,
    maxPlayers: 2,
    isPublic: false,
    status: "playing",
    players: [
      {
        seat: 0,
        studentId: 101,
        authId: AUTH_ID_0,
        name: "원정",
        username: "visitor",
        isHost: true,
        isReady: true,
        status: "playing",
        joinedAt: NOW,
      },
      {
        seat: 1,
        studentId: 202,
        authId: AUTH_ID_1,
        name: "홈",
        username: "home",
        isHost: false,
        isReady: true,
        status: "playing",
        joinedAt: NOW,
      },
    ],
    activityLogs: [],
    createdAt: NOW,
    startedAt: NOW,
    matchId: "baseball-client-match",
    gameState: createGameState("원정", "홈", 8123),
  };
}

function envelope(currentRoom = room()): BaseballMatchCommandEnvelope {
  const game = currentRoom.gameState!;
  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: currentRoom.id,
    matchId: currentRoom.matchId!,
    commandId: "client-command-1",
    commandSequence: 1,
    baseRoomRevision: currentRoom.revision,
    baseGameRevision: game.revision,
    actorSeat: 1,
    seed: game.seed,
    playId: "client-play-1",
    kind: "START_PITCH",
    command: {
      commandId: "client-command-1",
      expectedRevision: game.revision,
      playId: "client-play-1",
      sequence: 1,
      pitcherId: getCurrentPitcher(game).id,
      pitchType: "fourSeam",
      target: { x: 0.5, y: 0.5 },
      timingQuality: "GOOD",
    },
  };
}

function dependencies(
  response: Response,
  capture?: (input: RequestInfo | URL, init?: RequestInit) => void,
): BaseballCommandClientDependencies {
  return {
    async getAccessToken() { return "current-session-token"; },
    async fetch(input, init) {
      capture?.(input, init);
      return response;
    },
  };
}

test("현재 Supabase Bearer로 envelope만 POST하고 canonical room을 반환한다", async () => {
  const currentRoom = room();
  const command = envelope(currentRoom);
  currentRoom.revision = command.baseRoomRevision + 1;
  currentRoom.gameState!.revision = command.baseGameRevision + 1;
  const rawCommand = {
    ...command,
    studentId: 999_999,
    sessionId: "forged-session",
    command: { ...command.command, studentId: 999_999 },
  } as BaseballMatchCommandEnvelope;
  let capturedUrl: RequestInfo | URL | undefined;
  let capturedInit: RequestInit | undefined;
  const result = await sendBaseballCommand(rawCommand, dependencies(Response.json({
    ok: true,
    idempotent: false,
    commandId: command.commandId,
    commandSequence: command.commandSequence,
    room: currentRoom,
  }), (url, init) => {
    capturedUrl = url;
    capturedInit = init;
  }));

  assert.equal(capturedUrl, "/api/baseball-command");
  assert.equal(capturedInit?.method, "POST");
  assert.equal((capturedInit?.headers as Record<string, string>).authorization, "Bearer current-session-token");
  const posted = JSON.parse(String(capturedInit?.body)) as Record<string, unknown>;
  assert.equal(posted.commandId, command.commandId);
  assert.equal(Object.hasOwn(posted, "studentId"), false);
  assert.equal(Object.hasOwn(posted, "sessionId"), false);
  assert.equal(Object.hasOwn(posted.command as object, "studentId"), false);
  assert.deepEqual(result, {
    ok: true,
    status: 200,
    idempotent: false,
    commandId: command.commandId,
    commandSequence: command.commandSequence,
    room: currentRoom,
  });
});

test("401·403을 typed error로, 409를 정규화된 canonical room과 함께 반환한다", async () => {
  const command = envelope();
  assert.deepEqual(await sendBaseballCommand(command, dependencies(Response.json({
    ok: false,
    code: "AUTH_EXPIRED",
  }, { status: 401 }))), {
    ok: false,
    status: 401,
    code: "AUTH_EXPIRED",
  });
  assert.deepEqual(await sendBaseballCommand(command, dependencies(Response.json({
    ok: false,
    code: "ACTOR_TURN_FORBIDDEN",
  }, { status: 403 }))), {
    ok: false,
    status: 403,
    code: "ACTOR_TURN_FORBIDDEN",
  });

  const canonical = room();
  canonical.revision = 8;
  const conflict = await sendBaseballCommand(command, dependencies(Response.json({
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
});

test("세션·네트워크·응답 문맥 오류를 안전한 typed error로 변환한다", async () => {
  const command = envelope();
  let fetchCalled = false;
  assert.deepEqual(await sendBaseballCommand(command, {
    async getAccessToken() { return null; },
    async fetch() {
      fetchCalled = true;
      throw new Error("must not run");
    },
  }), { ok: false, status: 401, code: "AUTH_REQUIRED" });
  assert.equal(fetchCalled, false);

  assert.deepEqual(await sendBaseballCommand(command, {
    async getAccessToken() { throw new Error("session failed"); },
    async fetch() { throw new Error("must not run"); },
  }), { ok: false, status: 401, code: "AUTH_SESSION_FAILED" });

  assert.deepEqual(await sendBaseballCommand(command, {
    async getAccessToken() { return "token"; },
    async fetch() { throw new Error("offline"); },
  }), { ok: false, status: 0, code: "NETWORK_ERROR" });

  const wrongMatch = { ...room(), matchId: "another-match" };
  assert.deepEqual(await sendBaseballCommand(command, dependencies(Response.json({
    ok: true,
    idempotent: false,
    commandId: command.commandId,
    commandSequence: command.commandSequence,
    room: wrongMatch,
  }))), { ok: false, status: 502, code: "INVALID_CANONICAL_ROOM" });

  assert.deepEqual(await sendBaseballCommand({
    ...command,
    command: { ...command.command, expectedRevision: 99 },
  }, dependencies(Response.json({}))), {
    ok: false,
    status: 400,
    code: "INVALID_COMMAND_ENVELOPE",
  });
});

test("randomUUID가 없을 때 getRandomValues를 사용하고 Math.random은 사용하지 않는다", () => {
  assert.equal(createBaseballClientId("test", {
    randomUUID: () => "11111111-2222-4333-8444-555555555555",
  }), "test-11111111-2222-4333-8444-555555555555");

  const fallback = createBaseballClientId("fallback", {
    getRandomValues(array) {
      const bytes = array as Uint8Array;
      for (let index = 0; index < bytes.length; index += 1) bytes[index] = index;
      return array;
    },
  });
  assert.match(fallback, /^fallback-00010203-0405-4607-8809-0a0b0c0d0e0f$/);

  const source = readFileSync(
    path.join(process.cwd(), "src/services/baseballCommandClient.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random/);
});
