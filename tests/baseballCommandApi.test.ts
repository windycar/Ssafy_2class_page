import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  authenticateBaseballMember,
  getBaseballBearerToken,
  resolveBaseballMemberIdentity,
  type BaseballMemberIdentity,
} from "../api/_lib/baseballAuth.ts";
import {
  applyAuthorizedBaseballCommand,
  authorizeBaseballCommand,
  buildBaseballCommandRpcArguments,
  canonicalizeBaseballCommandEnvelope,
  parseBaseballCommandRequestBody,
} from "../api/_lib/baseballCommandHandler.ts";
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
  getCurrentBatter,
  getCurrentPitcher,
} from "../src/utils/games/baseball/gameState.ts";

const NOW = "2026-08-23T12:00:00.000Z";
const ROOM_ID = "baseball-authority-room";
const MATCH_ID = "baseball-authority-match";
const SEED = 91_827;

const visitorIdentity: BaseballMemberIdentity = {
  memberId: 11,
  studentId: 101,
  authId: "00000000-0000-4000-8000-000000000101",
};
const homeIdentity: BaseballMemberIdentity = {
  memberId: 22,
  studentId: 202,
  authId: "00000000-0000-4000-8000-000000000202",
};

function playingRoom(): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    id: ROOM_ID,
    title: "서버 권위 테스트",
    description: "",
    hostStudentId: visitorIdentity.studentId,
    maxPlayers: 2,
    isPublic: false,
    status: "playing",
    players: [
      {
        seat: 0,
        studentId: visitorIdentity.studentId,
        authId: visitorIdentity.authId,
        name: "원정",
        username: "visitor",
        isHost: true,
        isReady: true,
        status: "playing",
        joinedAt: NOW,
      },
      {
        seat: 1,
        studentId: homeIdentity.studentId,
        authId: homeIdentity.authId,
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
    matchId: MATCH_ID,
    gameState: createGameState("원정", "홈", SEED),
  };
}

function startEnvelope(room = playingRoom()): BaseballMatchCommandEnvelope {
  const game = room.gameState!;
  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: room.id,
    matchId: room.matchId!,
    commandId: "server-command-1",
    commandSequence: 1,
    baseRoomRevision: room.revision,
    baseGameRevision: game.revision,
    actorSeat: 1,
    seed: game.seed,
    playId: "server-play-1",
    kind: "START_PITCH",
    command: {
      commandId: "server-command-1",
      expectedRevision: game.revision,
      playId: "server-play-1",
      sequence: 1,
      pitcherId: getCurrentPitcher(game).id,
      pitchType: "fourSeam",
      target: { x: 0.5, y: 0.5 },
      timingQuality: "GOOD",
    },
  };
}

test("Bearer 토큰과 members 행에서만 서버 사용자 신원을 결정한다", async () => {
  assert.equal(getBaseballBearerToken(new Request("http://local")), "");
  assert.equal(getBaseballBearerToken(new Request("http://local", {
    headers: { authorization: "Basic abc" },
  })), "");
  assert.equal(getBaseballBearerToken(new Request("http://local", {
    headers: { authorization: "bearer verified-token" },
  })), "verified-token");

  assert.deepEqual(resolveBaseballMemberIdentity({
    id: "45",
    student_id: null,
    auth_user_id: homeIdentity.authId,
    is_active: true,
  }, homeIdentity.authId), {
    memberId: 45,
    studentId: 900_000_045,
    authId: homeIdentity.authId,
  });
  assert.equal(resolveBaseballMemberIdentity({
    id: 45,
    student_id: 202,
    auth_user_id: homeIdentity.authId,
    is_active: false,
  }, homeIdentity.authId), null);
  assert.equal(resolveBaseballMemberIdentity({
    id: 45,
    student_id: 202,
    auth_user_id: visitorIdentity.authId,
    is_active: true,
  }, homeIdentity.authId), null);

  let receivedToken = "";
  const query = {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() {
      return {
        data: {
          id: homeIdentity.memberId,
          student_id: homeIdentity.studentId,
          auth_user_id: homeIdentity.authId,
          is_active: true,
        },
        error: null,
      };
    },
  };
  const mockClient = {
    auth: {
      async getUser(token: string) {
        receivedToken = token;
        return { data: { user: { id: homeIdentity.authId } }, error: null };
      },
    },
    from(table: string) {
      assert.equal(table, "members");
      return query;
    },
  };
  const authenticated = await authenticateBaseballMember(
    mockClient as never,
    new Request("http://local", {
      headers: { authorization: "Bearer verified-token" },
    }),
  );
  assert.equal(receivedToken, "verified-token");
  assert.deepEqual(authenticated, { ok: true, identity: homeIdentity });

  const expired = await authenticateBaseballMember({
    auth: {
      async getUser() {
        return { data: { user: null }, error: new Error("expired") };
      },
    },
  } as never, new Request("http://local", {
    headers: { authorization: "Bearer expired-token" },
  }));
  assert.deepEqual(expired, { ok: false, status: 401, code: "AUTH_EXPIRED" });

  const inactiveQuery = {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() {
      return {
        data: {
          id: homeIdentity.memberId,
          student_id: homeIdentity.studentId,
          auth_user_id: homeIdentity.authId,
          is_active: false,
        },
        error: null,
      };
    },
  };
  const inactive = await authenticateBaseballMember({
    auth: {
      async getUser() {
        return { data: { user: { id: homeIdentity.authId } }, error: null };
      },
    },
    from() { return inactiveQuery; },
  } as never, new Request("http://local", {
    headers: { authorization: "Bearer inactive-token" },
  }));
  assert.deepEqual(inactive, { ok: false, status: 403, code: "MEMBER_FORBIDDEN" });
});

test("명령 envelope를 엄격히 검증하고 클라이언트 신원 필드는 멱등 payload에서 제거한다", () => {
  const envelope = startEnvelope();
  const raw = {
    ...envelope,
    studentId: 999_999,
    sessionId: "forged-session",
    command: { ...envelope.command, sessionId: "also-forged" },
  };
  const parsed = parseBaseballCommandRequestBody(raw);
  assert.ok(parsed);
  const canonical = canonicalizeBaseballCommandEnvelope(parsed!);
  assert.equal(Object.hasOwn(canonical, "studentId"), false);
  assert.equal(Object.hasOwn(canonical, "sessionId"), false);
  assert.equal(Object.hasOwn(canonical.command as object, "sessionId"), false);
  assert.equal(parseBaseballCommandRequestBody({
    ...envelope,
    baseGameRevision: envelope.baseGameRevision + 1,
  }), null);
  assert.equal(parseBaseballCommandRequestBody({
    ...envelope,
    actorSeat: 3,
  }), null);
});

test("투구는 수비 seat, 타격은 공격 seat만 승인한다", () => {
  const room = playingRoom();
  const pitch = startEnvelope(room);
  assert.deepEqual(authorizeBaseballCommand(room, pitch, homeIdentity), { ok: true });

  assert.deepEqual(authorizeBaseballCommand(room, pitch, visitorIdentity), {
    ok: false,
    status: 403,
    code: "ACTOR_SEAT_FORBIDDEN",
  });
  assert.deepEqual(authorizeBaseballCommand(room, {
    ...pitch,
    actorSeat: 0,
  }, visitorIdentity), {
    ok: false,
    status: 403,
    code: "ACTOR_TURN_FORBIDDEN",
  });

  const batter = getCurrentBatter(room.gameState!);
  const batting: BaseballMatchCommandEnvelope = {
    ...pitch,
    commandId: "server-command-bat",
    actorSeat: 0,
    kind: "BATTER_ACTION",
    command: {
      commandId: "server-command-bat",
      expectedRevision: room.gameState!.revision,
      playId: pitch.playId,
      batterId: batter.id,
      action: { kind: "TAKE", batterId: batter.id },
    },
  };
  assert.deepEqual(authorizeBaseballCommand(room, batting, visitorIdentity), { ok: true });
  assert.deepEqual(authorizeBaseballCommand({ ...room, revision: room.revision + 1 }, pitch, homeIdentity), {
    ok: false,
    status: 409,
    code: "STALE_REVISION",
  });
  assert.deepEqual(authorizeBaseballCommand({
    ...room,
    revision: room.revision + 1,
    status: "finished",
    finishedAt: NOW,
    gameState: { ...room.gameState!, revision: 1, status: "finished", winner: 0 },
  }, pitch, homeIdentity), {
    ok: false,
    status: 409,
    code: "STALE_REVISION",
  });
  assert.deepEqual(authorizeBaseballCommand(room, { ...pitch, seed: pitch.seed + 1 }, homeIdentity), {
    ok: false,
    status: 409,
    code: "ROOM_CONTEXT_MISMATCH",
  });
});

test("승인된 투구와 타격은 동일 엔진으로 실행하고 방/game revision을 각각 1 올린다", () => {
  const room = playingRoom();
  const roomSnapshot = structuredClone(room);
  const pitchEnvelope = startEnvelope(room);
  const pitched = applyAuthorizedBaseballCommand(room, pitchEnvelope, NOW);
  assert.equal(pitched.ok, true, pitched.ok ? undefined : pitched.code);
  if (!pitched.ok) return;
  assert.deepEqual(room, roomSnapshot);
  assert.equal(pitched.room.revision, 8);
  assert.equal(pitched.room.gameState!.revision, 1);
  assert.equal(pitched.room.gameState!.activePlay?.playId, pitchEnvelope.playId);

  const batter = getCurrentBatter(pitched.room.gameState!);
  const battingEnvelope: BaseballMatchCommandEnvelope = {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: pitched.room.id,
    matchId: pitched.room.matchId!,
    commandId: "server-command-2",
    commandSequence: 2,
    baseRoomRevision: pitched.room.revision,
    baseGameRevision: pitched.room.gameState!.revision,
    actorSeat: 0,
    seed: pitched.room.gameState!.seed,
    playId: pitchEnvelope.playId,
    kind: "BATTER_ACTION",
    command: {
      commandId: "server-command-2",
      expectedRevision: pitched.room.gameState!.revision,
      playId: pitchEnvelope.playId,
      batterId: batter.id,
      action: { kind: "TAKE", batterId: batter.id },
    },
  };
  assert.deepEqual(
    authorizeBaseballCommand(pitched.room, battingEnvelope, visitorIdentity),
    { ok: true },
  );
  const resolved = applyAuthorizedBaseballCommand(
    pitched.room,
    battingEnvelope,
    "2026-08-23T12:00:01.234Z",
  );
  assert.equal(resolved.ok, true, resolved.ok ? undefined : resolved.code);
  if (!resolved.ok) return;
  assert.equal(resolved.room.revision, 9);
  assert.equal(resolved.room.gameState!.revision, 2);
  assert.equal(
    resolved.room.gameState!.playByPlay.at(-1)?.createdAt,
    "2026-08-23T12:00:01.234Z",
  );

  const rpc = buildBaseballCommandRpcArguments(
    battingEnvelope,
    visitorIdentity,
    resolved.room,
  );
  assert.equal(rpc.p_actor_student_id, visitorIdentity.studentId);
  assert.equal(rpc.p_actor_auth_id, visitorIdentity.authId);
  assert.equal(rpc.p_next_room.revision, battingEnvelope.baseRoomRevision + 1);
});

test("SQL RPC는 행 잠금·CAS·멱등성·sequence 고유성·service_role 전용 권한을 고정한다", () => {
  const sql = readFileSync(
    path.join(process.cwd(), "supabase/migrations/20260823_baseball_command_authority.sql"),
    "utf8",
  );
  assert.match(sql, /primary key\s*\(room_id, command_id\)/i);
  assert.match(sql, /unique\s*\(room_id, match_id, command_sequence\)/i);
  assert.match(sql, /for update/i);
  assert.match(sql, /v_existing\.payload\s*=\s*p_payload/i);
  assert.ok(sql.indexOf("v_existing.payload = p_payload") < sql.indexOf("v_current_room_revision <> p_base_room_revision"));
  assert.match(sql, /p_base_room_revision \+ 1/i);
  assert.match(sql, /p_base_game_revision \+ 1/i);
  assert.match(sql, /alter table public\.baseball_command_log enable row level security/i);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /revoke execute on function public\.commit_baseball_command[\s\S]*from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.commit_baseball_command[\s\S]*to service_role/i);
  assert.match(sql, /drop policy if exists "Public bang rooms" on public\.bang_rooms/i);
  assert.match(sql, /\(v_room ->> 'status'\) is distinct from 'playing'/i);
  assert.match(sql, /\(p_next_room -> 'players'\) is distinct from \(v_room -> 'players'\)/i);
  assert.match(sql, /lineupPlayerIds/i);
});

test("기존 BANG 퇴장 API는 baseball 방 식별자를 service role로 수정하지 못한다", () => {
  const source = readFileSync(
    path.join(process.cwd(), "api/bang-leave.ts"),
    "utf8",
  );
  assert.match(source, /body\.roomId\.startsWith\("bang-"\)/);
  assert.doesNotMatch(source, /body\.roomId\.startsWith\("baseball-"\)/);
});
