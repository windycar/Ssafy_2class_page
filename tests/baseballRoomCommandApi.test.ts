import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  authenticateBaseballRoomMember,
  type BaseballRoomMemberIdentity,
} from "../api/_lib/baseballRoomAuth.ts";
import {
  applyBaseballRoomCommand,
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  BASEBALL_ROOM_STALE_REAP_AGE_MS,
  buildBaseballRoomCommandRpcArguments,
  canonicalizeBaseballRoomCommandEnvelope,
  parseBaseballRoomCommandRequestBody,
  type BaseballRoomCommandEnvelope,
  type BaseballRoomCommandServerContext,
} from "../api/_lib/baseballRoomCommandHandler.ts";
import { handleLegacyBaseballLeaveRequest } from "../api/baseball-leave.ts";
import { normalizeBaseballRoomCommandCommit } from "../api/baseball-room-command.ts";
import type { BaseballRoom } from "../src/types/baseballRoom.ts";

const HOST: BaseballRoomMemberIdentity = {
  memberId: 11,
  studentId: 101,
  authId: "00000000-0000-4000-8000-000000000101",
  name: "원정",
  username: "visitor",
};
const GUEST: BaseballRoomMemberIdentity = {
  memberId: 22,
  studentId: 202,
  authId: "00000000-0000-4000-8000-000000000202",
  name: "홈",
  username: "home",
};
const REPLACEMENT: BaseballRoomMemberIdentity = {
  memberId: 33,
  studentId: 303,
  authId: "00000000-0000-4000-8000-000000000303",
  name: "교체",
  username: "replacement",
};
const ROOM_ID = "baseball-server-room";
const BASE_TIME = Date.parse("2026-08-23T12:00:00.000Z");

function context(
  offsetMs = 0,
  overrides: Partial<BaseballRoomCommandServerContext> = {},
): BaseballRoomCommandServerContext {
  return {
    now: new Date(BASE_TIME + offsetMs).toISOString(),
    roomId: ROOM_ID,
    activityId: `baseball-log-${String(offsetMs).padStart(8, "0")}`,
    matchId: "baseball-match-server-generated",
    seed: 0xfedcba98,
    ...overrides,
  };
}

function createCommand(commandId = "baseball-room-create-0001"): BaseballRoomCommandEnvelope {
  return {
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId,
    kind: "CREATE",
    payload: {
      title: "서버 야구방",
      description: "초대 경기",
      isPublic: false,
      sessionId: "host-session-0001",
    },
  };
}

function applyOk(
  room: BaseballRoom | null,
  command: BaseballRoomCommandEnvelope,
  identity: BaseballRoomMemberIdentity,
  serverContext: BaseballRoomCommandServerContext,
) {
  const result = applyBaseballRoomCommand(room, command, identity, serverContext);
  assert.equal(result.ok, true, result.ok ? undefined : result.code);
  if (!result.ok) throw new Error(result.code);
  return result;
}

function createdRoom() {
  const result = applyOk(null, createCommand(), HOST, context());
  assert.ok(result.room);
  return result.room;
}

function joinedRoom() {
  const room = createdRoom();
  const result = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-room-join-00001",
    kind: "JOIN",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "guest-session-0001" },
  }, GUEST, context(1_000));
  assert.ok(result.room);
  return result.room;
}

function readyRoom() {
  let room = joinedRoom();
  let result = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-ready-host-0001",
    kind: "SET_READY",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "host-session-0001", isReady: true },
  }, HOST, context(2_000));
  assert.ok(result.room);
  room = result.room;
  result = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-ready-guest-0001",
    kind: "SET_READY",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "guest-session-0001", isReady: true },
  }, GUEST, context(3_000));
  assert.ok(result.room);
  return result.room;
}

test("room command parser는 허용 필드만 재구성하고 잘못된 title을 안전하게 거부한다", () => {
  const raw = {
    ...createCommand(),
    studentId: 999999,
    authId: "forged-auth",
    room: { status: "playing" },
    seed: 1,
  };
  const parsed = parseBaseballRoomCommandRequestBody(raw);
  assert.ok(parsed);
  const canonical = canonicalizeBaseballRoomCommandEnvelope(parsed!);
  assert.equal(Object.hasOwn(canonical, "studentId"), false);
  assert.equal(Object.hasOwn(canonical, "authId"), false);
  assert.equal(Object.hasOwn(canonical, "room"), false);
  assert.equal(Object.hasOwn(canonical, "seed"), false);
  assert.equal(parseBaseballRoomCommandRequestBody({
    ...createCommand(),
    payload: { ...createCommand().payload, title: null },
  }), null);
  assert.equal(parseBaseballRoomCommandRequestBody({
    ...createCommand(),
    payload: { ...createCommand().payload, title: 17 },
  }), null);
  assert.equal(parseBaseballRoomCommandRequestBody({
    ...createCommand(),
    roomId: "baseball-forged-room",
  }), null);
});

test("CREATE/JOIN은 서버 신원과 서버 room id만 사용해 canonical V2 방을 만든다", () => {
  const room = createdRoom();
  assert.equal(room.id, ROOM_ID);
  assert.equal(room.revision, 0);
  assert.equal(room.players[0].studentId, HOST.studentId);
  assert.equal(room.players[0].authId, HOST.authId);
  assert.equal(room.players[0].name, HOST.name);
  assert.equal(room.players[0].sessionId, "host-session-0001");

  const joined = joinedRoom();
  assert.equal(joined.revision, 1);
  assert.equal(joined.status, "ready");
  assert.deepEqual(joined.players.map((player) => player.seat), [0, 1]);
  assert.deepEqual(joined.players.map((player) => player.authId), [HOST.authId, GUEST.authId]);

  const rpc = buildBaseballRoomCommandRpcArguments(
    createCommand(),
    HOST,
    context(),
    room,
    false,
  );
  assert.equal(rpc.p_room_id, ROOM_ID);
  assert.equal(rpc.p_expected_revision, null);
  assert.equal(rpc.p_actor_auth_id, HOST.authId);
  assert.equal(Object.hasOwn(rpc.p_payload, "roomId"), false);
});

test("CREATE exact retry는 새 후보 id가 생겨도 로그의 최초 canonical room을 복원한다", () => {
  const originalRoom = createdRoom();
  const retryCandidateRoomId = "baseball-new-random-candidate";
  assert.notEqual(originalRoom.id, retryCandidateRoomId);
  assert.equal(
    normalizeBaseballRoomCommandCommit(originalRoom)?.id,
    originalRoom.id,
  );
  assert.equal(
    normalizeBaseballRoomCommandCommit(originalRoom, retryCandidateRoomId),
    null,
  );

  const sql = readFileSync(
    path.join(process.cwd(), "supabase/migrations/20260823_baseball_command_authority.sql"),
    "utf8",
  );
  assert.ok(
    sql.indexOf("where logs.actor_auth_id = p_actor_auth_id")
      < sql.indexOf("'baseball-room:' || p_room_id"),
  );
});

test("START는 방장·두 명 준비·서버 heartbeat를 요구하고 서버 seed/match/game을 생성한다", () => {
  const room = readyRoom();
  const command: BaseballRoomCommandEnvelope = {
    schemaVersion: 1,
    commandId: "baseball-start-server-0001",
    kind: "START",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "host-session-0001" },
  };
  const started = applyOk(room, command, HOST, context(4_000));
  assert.ok(started.room);
  assert.equal(started.room.status, "playing");
  assert.equal(started.room.matchId, "baseball-match-server-generated");
  assert.equal(started.room.gameState?.seed, 0xfedcba98);
  assert.equal(started.room.gameState?.inning, 1);
  assert.equal(started.room.players.every((player) => player.status === "playing"), true);

  const guestAttempt = applyBaseballRoomCommand(room, {
    ...command,
    payload: { sessionId: "guest-session-0001" },
  }, GUEST, context(4_000));
  assert.deepEqual(guestAttempt, { ok: false, status: 403, code: "HOST_ONLY" });

  const staleRoom = {
    ...room,
    players: room.players.map((player) => ({
      ...player,
      lastSeenAt: new Date(BASE_TIME - 60_000).toISOString(),
    })),
  };
  const staleAttempt = applyBaseballRoomCommand(staleRoom, command, HOST, context(4_000));
  assert.deepEqual(staleAttempt, {
    ok: false,
    status: 409,
    code: "PLAYERS_NOT_CONNECTED",
  });
});

test("HEARTBEAT는 120초 넘게 끊긴 대기 상대만 정리하고 방장을 안전하게 이전한다", () => {
  const room = joinedRoom();
  const reapAt = BASEBALL_ROOM_STALE_REAP_AGE_MS + 1_001;
  const result = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-heartbeat-reap-001",
    kind: "HEARTBEAT",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "guest-session-0001" },
  }, GUEST, context(reapAt));
  assert.ok(result.room);
  assert.equal(result.room.status, "recruiting");
  assert.equal(result.room.players.length, 1);
  assert.equal(result.room.players[0].authId, GUEST.authId);
  assert.equal(result.room.players[0].isHost, true);
  assert.equal(result.room.players[0].isReady, false);
  assert.equal(result.room.hostStudentId, GUEST.studentId);
  assert.match(result.room.activityLogs[0].message, /연결이 장시간 끊겨/);

  const activeRoom = joinedRoom();
  const notYetStale = applyOk(activeRoom, {
    schemaVersion: 1,
    commandId: "baseball-heartbeat-keep-001",
    kind: "HEARTBEAT",
    roomId: activeRoom.id,
    expectedRevision: activeRoom.revision,
    payload: { sessionId: "guest-session-0001" },
  }, GUEST, context(BASEBALL_ROOM_STALE_REAP_AGE_MS - 1));
  assert.equal(notYetStale.room?.players.length, 2);
});

test("JOIN은 두 사용자 모두 닫은 만석 방도 120초 뒤 원자적으로 회수한다", () => {
  const abandonedRoom = joinedRoom();
  const joined = applyOk(abandonedRoom, {
    schemaVersion: 1,
    commandId: "baseball-join-reclaim-0001",
    kind: "JOIN",
    roomId: abandonedRoom.id,
    expectedRevision: abandonedRoom.revision,
    payload: { sessionId: "replacement-session-0001" },
  }, REPLACEMENT, context(BASEBALL_ROOM_STALE_REAP_AGE_MS + 1_001));
  assert.ok(joined.room);
  assert.equal(joined.room.status, "recruiting");
  assert.equal(joined.room.players.length, 1);
  assert.equal(joined.room.players[0].authId, REPLACEMENT.authId);
  assert.equal(joined.room.players[0].isHost, true);
  assert.equal(joined.room.hostStudentId, REPLACEMENT.studentId);

  const activeRoom = joinedRoom();
  const blocked = applyBaseballRoomCommand(activeRoom, {
    schemaVersion: 1,
    commandId: "baseball-join-full-000001",
    kind: "JOIN",
    roomId: activeRoom.id,
    expectedRevision: activeRoom.revision,
    payload: { sessionId: "replacement-session-0001" },
  }, REPLACEMENT, context(2_000));
  assert.deepEqual(blocked, { ok: false, status: 409, code: "ROOM_FULL" });
});

test("playing room revision은 lobby HEARTBEAT로 전진할 수 없다", () => {
  const room = readyRoom();
  const started = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-start-for-heartbeat",
    kind: "START",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "host-session-0001" },
  }, HOST, context(4_000));
  assert.ok(started.room);
  const heartbeat = applyBaseballRoomCommand(started.room, {
    schemaVersion: 1,
    commandId: "baseball-playing-heartbeat",
    kind: "HEARTBEAT",
    roomId: started.room.id,
    expectedRevision: started.room.revision,
    payload: { sessionId: "host-session-0001" },
  }, HOST, context(5_000));
  assert.deepEqual(heartbeat, {
    ok: false,
    status: 409,
    code: "ROOM_STATE_CONFLICT",
  });
});

test("ready/leave는 현재 서버 session 소유권을 요구하고 마지막 퇴장은 삭제 결과다", () => {
  const room = createdRoom();
  const forgedSession = applyBaseballRoomCommand(room, {
    schemaVersion: 1,
    commandId: "baseball-ready-forged-001",
    kind: "SET_READY",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "other-session-0001", isReady: true },
  }, HOST, context(1_000));
  assert.deepEqual(forgedSession, {
    ok: false,
    status: 409,
    code: "SESSION_CONFLICT",
  });

  const left = applyOk(room, {
    schemaVersion: 1,
    commandId: "baseball-leave-last-0001",
    kind: "LEAVE",
    roomId: room.id,
    expectedRevision: room.revision,
    payload: { sessionId: "host-session-0001" },
  }, HOST, context(2_000));
  assert.equal(left.room, null);
  assert.equal(left.deleted, true);
});

test("room auth는 Bearer 사용자와 active members 프로필을 함께 검증한다", async () => {
  let selected = "";
  const query = {
    select(value: string) { selected = value; return this; },
    eq() { return this; },
    async maybeSingle() {
      return {
        data: {
          id: HOST.memberId,
          student_id: HOST.studentId,
          auth_user_id: HOST.authId,
          is_active: true,
          name: HOST.name,
          username: HOST.username,
        },
        error: null,
      };
    },
  };
  const authenticated = await authenticateBaseballRoomMember({
    auth: {
      async getUser() {
        return { data: { user: { id: HOST.authId } }, error: null };
      },
    },
    from(table: string) {
      assert.equal(table, "members");
      return query;
    },
  } as never, new Request("http://local", {
    headers: { authorization: "Bearer verified-token" },
  }));
  assert.deepEqual(authenticated, { ok: true, identity: HOST });
  assert.match(selected, /name, username/);
});

test("legacy baseball-leave endpoint는 신원 위조 경로를 410으로 차단한다", async () => {
  const response = await handleLegacyBaseballLeaveRequest(new Request("http://local", {
    method: "POST",
    body: JSON.stringify({ roomId: ROOM_ID, studentId: 999, sessionId: "forged" }),
  }));
  assert.equal(response.status, 410);
  assert.deepEqual(await response.json(), {
    ok: false,
    code: "LEGACY_ENDPOINT_DISABLED",
  });
});

test("SQL은 로비 CAS/글로벌 멱등/active 2인/행 잠금과 baseball 직접쓰기 차단을 고정한다", () => {
  const sql = readFileSync(
    path.join(process.cwd(), "supabase/migrations/20260823_baseball_command_authority.sql"),
    "utf8",
  );
  assert.match(sql, /drop policy if exists "Public bang rooms"/i);
  assert.match(sql, /primary key \(actor_auth_id, command_id\)/i);
  assert.match(sql, /pg_advisory_xact_lock/i);
  assert.ok(
    sql.indexOf("where logs.actor_auth_id = p_actor_auth_id")
      < sql.indexOf("'baseball-room:' || p_room_id"),
  );
  assert.match(sql, /from public\.bang_rooms as rooms[\s\S]*for update/i);
  assert.match(sql, /v_current_revision <> p_expected_revision/i);
  assert.match(sql, /member\.is_active = true/i);
  assert.match(sql, /v_matched_active_players <> 2/i);
  assert.match(sql, /interval '45 seconds'/i);
  assert.match(sql, /interval '120 seconds'/i);
  assert.match(sql, /id like 'bang-%'/i);
  assert.match(sql, /revoke truncate, references, trigger/i);
  assert.match(sql, /for insert[\s\S]*id like 'bang-%'/i);
  assert.doesNotMatch(sql, /for insert[\s\S]{0,250}id like 'baseball-%'/i);
  assert.match(sql, /Active members can read visible baseball rooms/i);
  assert.match(sql, /Baseball private topics can receive/i);
  assert.match(sql, /Baseball private topics can send/i);
  assert.match(sql, /baseball-game-presence:/i);
  assert.match(sql, /baseball-command-notice:/i);
});
