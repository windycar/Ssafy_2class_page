import assert from "node:assert/strict";
import test from "node:test";

import { BASEBALL_ROOM_SCHEMA_VERSION } from "../src/types/baseballRoom.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import { normalizeBaseballRoom } from "../src/utils/games/baseball/normalizeRoom.ts";

const CREATED_AT = "2026-08-12T00:00:00.000Z";

function legacyPlayer(studentId: number, isHost: boolean, status = "waiting") {
  return {
    studentId,
    authId: `auth-${studentId}`,
    name: isHost ? "방장" : "초대 손님",
    username: isHost ? "host" : "guest",
    isHost,
    isReady: status !== "waiting",
    status,
    joinedAt: CREATED_AT,
  };
}

function legacyGameState() {
  return {
    inning: 1,
    half: "top",
    battingTeam: 0,
    count: { balls: 1, strikes: 2, outs: 1 },
    bases: { first: true, second: false, third: true },
    teams: [
      { name: "방장", runs: 0, hits: 1, inningRuns: [0] },
      { name: "초대 손님", runs: 0, hits: 0, inningRuns: [] },
    ],
    status: "playing",
    winner: null,
  };
}

function legacyRecruitingRoom() {
  return {
    id: "baseball-normalize-room",
    title: "정규화 테스트 방",
    description: "",
    hostStudentId: 1,
    maxPlayers: 2,
    isPublic: false,
    status: "recruiting",
    players: [legacyPlayer(1, true)],
    activityLogs: [{
      id: "baseball-log-1",
      roomId: "",
      type: "create",
      message: "방을 만들었습니다.",
      createdAt: CREATED_AT,
    }],
    createdAt: CREATED_AT,
  };
}

function currentRecruitingRoom() {
  return {
    ...legacyRecruitingRoom(),
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    players: [{ ...legacyPlayer(1, true), seat: 0 }],
    activityLogs: [{
      id: "baseball-log-1",
      roomId: "baseball-normalize-room",
      type: "create",
      message: "방을 만들었습니다.",
      createdAt: CREATED_AT,
    }],
  };
}

test("legacy room migrates deterministically without mutating its source", () => {
  const raw = legacyRecruitingRoom();
  const before = structuredClone(raw);
  const first = normalizeBaseballRoom(raw, raw.id);
  const second = normalizeBaseballRoom(raw, raw.id);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.deepEqual(raw, before);
  assert.deepEqual(first, second);
  if (!first.ok) return;

  assert.equal(first.sourceVersion, 1);
  assert.equal(first.migrated, true);
  assert.equal(first.needsPersistence, true);
  assert.equal(first.value.schemaVersion, 2);
  assert.equal(first.value.revision, 0);
  assert.equal(first.value.players[0].seat, 0);
  assert.equal(first.value.players[0].isHost, true);
  assert.equal(first.value.activityLogs[0].roomId, raw.id);
  assert.ok(first.repairs.includes("activityLogRoomId"));
});
test("legacy host flag is repaired from hostStudentId while current V2 is strict", () => {
  const legacy = legacyRecruitingRoom();
  legacy.players[0].isHost = false;
  const migrated = normalizeBaseballRoom(legacy);
  assert.equal(migrated.ok, true);
  if (migrated.ok) assert.equal(migrated.value.players[0].isHost, true);

  const current = currentRecruitingRoom();
  current.players[0].isHost = false;
  assert.deepEqual(normalizeBaseballRoom(current), {
    ok: false,
    code: "INVALID_INVARIANT",
    path: "$.players[0].isHost",
    recoverable: true,
  });
});

test("current V2 room stays canonical and keeps its revision", () => {
  const raw = currentRecruitingRoom();
  const normalized = normalizeBaseballRoom(raw, raw.id);
  assert.equal(normalized.ok, true);
  if (!normalized.ok) return;

  assert.equal(normalized.sourceVersion, 2);
  assert.equal(normalized.migrated, false);
  assert.equal(normalized.needsPersistence, false);
  assert.equal(normalized.value.revision, 7);
  assert.deepEqual(normalizeBaseballRoom(normalized.value), normalized);
});

test("future schema and mismatched storage row id are rejected without migration", () => {
  assert.deepEqual(normalizeBaseballRoom({ ...currentRecruitingRoom(), schemaVersion: 3 }), {
    ok: false,
    code: "UNSUPPORTED_VERSION",
    path: "$.schemaVersion",
    recoverable: false,
  });
  assert.deepEqual(normalizeBaseballRoom(currentRecruitingRoom(), "baseball-other-room"), {
    ok: false,
    code: "ROW_ID_MISMATCH",
    path: "$.id",
    recoverable: false,
  });
});

test("current V2 requires a non-negative safe room revision", () => {
  const raw = currentRecruitingRoom() as Record<string, unknown>;
  delete raw.revision;
  assert.deepEqual(normalizeBaseballRoom(raw), {
    ok: false,
    code: "INVALID_REVISION",
    path: "$.revision",
    recoverable: true,
  });

  for (const revision of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, "4"]) {
    const result = normalizeBaseballRoom({ ...currentRecruitingRoom(), revision });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "INVALID_REVISION");
  }
});

test("players require unique identities, canonical seats, and an existing host", () => {
  const room = currentRecruitingRoom();
  const second = { ...legacyPlayer(2, false, "ready"), seat: 1 };
  const base = {
    ...room,
    status: "ready",
    players: [{ ...room.players[0], isReady: true, status: "ready" }, second],
  };

  const duplicateStudent = structuredClone(base);
  duplicateStudent.players[1].studentId = 1;
  assert.equal(normalizeBaseballRoom(duplicateStudent).ok, false);

  const duplicateAuth = structuredClone(base);
  duplicateAuth.players[1].authId = duplicateAuth.players[0].authId;
  assert.equal(normalizeBaseballRoom(duplicateAuth).ok, false);

  const duplicateSeat = structuredClone(base);
  duplicateSeat.players[1].seat = 0;
  const seatResult = normalizeBaseballRoom(duplicateSeat);
  assert.equal(seatResult.ok, false);
  if (!seatResult.ok) assert.equal(seatResult.path, "$.players[].seat");

  const missingHost = { ...base, hostStudentId: 999 };
  const hostResult = normalizeBaseballRoom(missingHost);
  assert.equal(hostResult.ok, false);
  if (!hostResult.ok) assert.equal(hostResult.path, "$.players[0].isHost");
});

test("room status enforces player count and playing player state", () => {
  const recruitingWithTwo = {
    ...currentRecruitingRoom(),
    players: [
      currentRecruitingRoom().players[0],
      { ...legacyPlayer(2, false), seat: 1 },
    ],
  };
  assert.equal(normalizeBaseballRoom(recruitingWithTwo).ok, false);

  const readyWithOne = { ...currentRecruitingRoom(), status: "ready" };
  assert.equal(normalizeBaseballRoom(readyWithOne).ok, false);
});

test("legacy playing room migrates its nested game state", () => {
  const raw = {
    ...legacyRecruitingRoom(),
    status: "playing",
    players: [legacyPlayer(1, true, "playing"), legacyPlayer(2, false, "playing")],
    startedAt: CREATED_AT,
    matchId: "baseball-match-1",
    gameState: legacyGameState(),
  };
  const result = normalizeBaseballRoom(raw);
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.gameState?.version, 2);
  assert.equal(result.value.gameState?.revision, 0);
  assert.equal(result.value.gameState?.bases.first?.currentBase, 1);
  assert.equal(result.value.gameState?.bases.third?.currentBase, 3);
  assert.ok(result.repairs.includes("gameState"));
});

test("current V2 refuses a legacy nested game state or incomplete active match", () => {
  const players = [
    { ...legacyPlayer(1, true, "playing"), seat: 0 },
    { ...legacyPlayer(2, false, "playing"), seat: 1 },
  ];
  const base = {
    ...currentRecruitingRoom(),
    status: "playing",
    players,
    startedAt: CREATED_AT,
    matchId: "baseball-match-1",
    gameState: legacyGameState(),
  };
  const legacyNested = normalizeBaseballRoom(base);
  assert.equal(legacyNested.ok, false);
  if (!legacyNested.ok) assert.equal(legacyNested.code, "INVALID_ACTIVE_MATCH");

  const missingState = structuredClone(base) as Record<string, unknown>;
  delete missingState.gameState;
  assert.equal(normalizeBaseballRoom(missingState).ok, false);

  const currentState = createGameState("방장", "초대 손님", 42);
  const valid = normalizeBaseballRoom({ ...base, gameState: currentState });
  assert.equal(valid.ok, true);
});

test("only legacy activity logs may repair an empty room id", () => {
  const legacy = normalizeBaseballRoom(legacyRecruitingRoom());
  assert.equal(legacy.ok, true);

  const current = currentRecruitingRoom();
  current.activityLogs[0].roomId = "";
  const result = normalizeBaseballRoom(current);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "INVALID_INVARIANT");
    assert.equal(result.path, "$.activityLogs[0].roomId");
  }
});
