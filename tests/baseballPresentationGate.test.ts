import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  applyAuthorizedBaseballCommand,
  authorizeBaseballCommand,
  canonicalizeBaseballCommandEnvelope,
  type BaseballCommandApplicationResult,
} from "../api/_lib/baseballCommandHandler.ts";
import type { BaseballMemberIdentity } from "../api/_lib/baseballAuth.ts";
import {
  buildOnlineBatterActionEnvelope,
  buildOnlinePresentationAckEnvelope,
  buildOnlineStartPitchEnvelope,
} from "../src/hooks/useBaseballOnlineController.ts";
import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import { normalizeBaseballRoom } from "../src/utils/games/baseball/normalizeRoom.ts";
import {
  createBaseballMatchCommittedNotice,
  decideBaseballMatchNotice,
  parseBaseballMatchCommandEnvelope,
  parseBaseballMatchCommittedNotice,
} from "../src/utils/games/baseball/onlineProtocol.ts";
import {
  BASEBALL_PRESENTATION_GATE_TIMEOUT_MS,
  isBaseballPresentationGateBlocking,
} from "../src/utils/games/baseball/presentationGate.ts";

const OPENED_AT = "2026-08-24T12:00:01.000Z";
const VISITOR: BaseballMemberIdentity = {
  memberId: 1,
  studentId: 101,
  authId: "00000000-0000-4000-8000-000000000101",
};
const HOME: BaseballMemberIdentity = {
  memberId: 2,
  studentId: 202,
  authId: "00000000-0000-4000-8000-000000000202",
};

function playingRoom(): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    id: "baseball-presentation-gate-room",
    title: "연출 게이트 테스트",
    description: "",
    hostStudentId: VISITOR.studentId,
    maxPlayers: 2,
    isPublic: false,
    status: "playing",
    players: [
      {
        seat: 0,
        studentId: VISITOR.studentId,
        authId: VISITOR.authId,
        name: "원정",
        username: "visitor",
        isHost: true,
        isReady: true,
        status: "playing",
        joinedAt: "2026-08-24T12:00:00.000Z",
      },
      {
        seat: 1,
        studentId: HOME.studentId,
        authId: HOME.authId,
        name: "홈",
        username: "home",
        isHost: false,
        isReady: true,
        status: "playing",
        joinedAt: "2026-08-24T12:00:00.000Z",
      },
    ],
    activityLogs: [],
    createdAt: "2026-08-24T12:00:00.000Z",
    startedAt: "2026-08-24T12:00:00.000Z",
    matchId: "baseball-presentation-gate-match",
    gameState: createGameState("원정", "홈", 91_827),
  };
}

function committed(result: BaseballCommandApplicationResult) {
  assert.equal(result.ok, true, result.ok ? undefined : result.code);
  if (!result.ok) throw new Error(result.code);
  return result.room;
}

function resolvedRoom() {
  const initial = playingRoom();
  const pitch = buildOnlineStartPitchEnvelope(initial, 1, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
    commandId: "presentation-pitch-command-1",
    playId: "presentation-play-1",
  });
  assert.ok(pitch?.kind === "START_PITCH");
  const pitched = committed(applyAuthorizedBaseballCommand(
    initial,
    pitch,
    "2026-08-24T12:00:00.250Z",
  ));
  const action = buildOnlineBatterActionEnvelope(pitched, 0, {
    kind: "TAKE",
    commandId: "presentation-action-command-1",
  });
  assert.ok(action?.kind === "BATTER_ACTION");
  const resolved = committed(applyAuthorizedBaseballCommand(pitched, action, OPENED_AT));
  return { resolved, pitched, playId: pitch.playId };
}

test("resolved play는 결과 전 HUD 상태가 포함된 20초 canonical gate를 만들고 직렬화 후에도 보존한다", () => {
  const { resolved, pitched, playId } = resolvedRoom();
  assert.equal(resolved.presentationGate?.playId, playId);
  assert.equal(resolved.presentationGate?.openedAt, OPENED_AT);
  assert.equal(resolved.presentationGate?.expiresAt, new Date(
    Date.parse(OPENED_AT) + BASEBALL_PRESENTATION_GATE_TIMEOUT_MS,
  ).toISOString());
  assert.deepEqual(resolved.presentationGate?.acknowledgedSeats, []);
  assert.deepEqual(resolved.presentationGate?.displayBeforeResult, pitched.gameState);
  assert.notDeepEqual(resolved.presentationGate?.displayBeforeResult, resolved.gameState);
  assert.equal(isBaseballPresentationGateBlocking(resolved, Date.parse(OPENED_AT)), true);

  const serialized = JSON.parse(JSON.stringify(resolved)) as BaseballRoom;
  const restored = normalizeBaseballRoom(serialized, resolved.id);
  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  assert.deepEqual(restored.value.presentationGate, serialized.presentationGate);

  const legacySerialized = JSON.parse(JSON.stringify(resolved)) as BaseballRoom;
  delete legacySerialized.presentationGate?.displayBeforeResult;
  const restoredLegacy = normalizeBaseballRoom(legacySerialized, resolved.id);
  assert.equal(restoredLegacy.ok, true);
  if (restoredLegacy.ok) {
    assert.equal(restoredLegacy.value.presentationGate?.displayBeforeResult, undefined);
  }
});

test("두 좌석 ACK 전 START_PITCH를 서버와 클라이언트 양쪽에서 차단한다", () => {
  const { resolved } = resolvedRoom();
  const expiresAtMs = Date.parse(resolved.presentationGate!.expiresAt);
  assert.equal(buildOnlineStartPitchEnvelope(resolved, 1, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    nowMs: Date.parse(OPENED_AT) + 1,
  }), null);

  const afterDeadlineEnvelope = buildOnlineStartPitchEnvelope(resolved, 1, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    commandId: "presentation-next-pitch-1",
    playId: "presentation-play-2",
    nowMs: expiresAtMs,
  });
  assert.ok(afterDeadlineEnvelope?.kind === "START_PITCH");
  assert.deepEqual(authorizeBaseballCommand(
    resolved,
    afterDeadlineEnvelope,
    HOME,
    new Date(expiresAtMs - 1).toISOString(),
  ), { ok: false, status: 409, code: "PRESENTATION_PENDING" });
  const blocked = applyAuthorizedBaseballCommand(
    resolved,
    afterDeadlineEnvelope,
    new Date(expiresAtMs - 1).toISOString(),
  );
  assert.deepEqual(blocked, {
    ok: false,
    status: 409,
    code: "PRESENTATION_PENDING",
  });
});

test("ACK는 좌석별로 CAS revision을 올리고 양쪽 완료 뒤 다음 투구가 gate를 소비한다", () => {
  const { resolved, playId } = resolvedRoom();
  const ack0 = buildOnlinePresentationAckEnvelope(resolved, 0, {
    playId,
    commandId: "presentation-ack-command-0",
  });
  assert.ok(ack0?.kind === "ACK_PRESENTATION");
  assert.deepEqual(parseBaseballMatchCommandEnvelope(ack0), ack0);
  assert.deepEqual(canonicalizeBaseballCommandEnvelope(ack0).command, ack0.command);
  const ackNotice = createBaseballMatchCommittedNotice(
    ack0,
    ack0.baseRoomRevision + 1,
    ack0.baseGameRevision + 1,
  );
  assert.deepEqual(parseBaseballMatchCommittedNotice(ackNotice), ackNotice);
  assert.equal(decideBaseballMatchNotice({
    roomId: ack0.roomId,
    matchId: ack0.matchId,
    seed: ack0.seed,
    lastCommandSequence: ack0.commandSequence - 1,
    lastRoomRevision: ack0.baseRoomRevision,
    seenCommandIds: new Set(),
  }, ackNotice), "APPLY");
  assert.deepEqual(authorizeBaseballCommand(resolved, ack0, VISITOR, OPENED_AT), { ok: true });

  const afterAck0 = committed(applyAuthorizedBaseballCommand(resolved, ack0, OPENED_AT));
  assert.deepEqual(afterAck0.presentationGate?.acknowledgedSeats, [0]);
  assert.equal(afterAck0.revision, resolved.revision + 1);
  assert.equal(afterAck0.gameState!.revision, resolved.gameState!.revision + 1);
  assert.equal(buildOnlinePresentationAckEnvelope(afterAck0, 0, { playId }), null);
  assert.deepEqual(authorizeBaseballCommand(afterAck0, {
    ...ack0,
    baseRoomRevision: afterAck0.revision,
    baseGameRevision: afterAck0.gameState!.revision,
    commandSequence: afterAck0.gameState!.revision + 1,
    command: {
      ...ack0.command,
      expectedRevision: afterAck0.gameState!.revision,
    },
  }, VISITOR, OPENED_AT), {
    ok: false,
    status: 409,
    code: "PRESENTATION_ALREADY_ACKNOWLEDGED",
  });

  const ack1 = buildOnlinePresentationAckEnvelope(afterAck0, 1, {
    playId,
    commandId: "presentation-ack-command-1",
  });
  assert.ok(ack1?.kind === "ACK_PRESENTATION");
  const afterAck1 = committed(applyAuthorizedBaseballCommand(afterAck0, ack1, OPENED_AT));
  assert.deepEqual(afterAck1.presentationGate?.acknowledgedSeats, [0, 1]);
  assert.equal(isBaseballPresentationGateBlocking(afterAck1, Date.parse(OPENED_AT)), false);

  const nextPitch = buildOnlineStartPitchEnvelope(afterAck1, 1, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    commandId: "presentation-next-pitch-2",
    playId: "presentation-play-2",
    nowMs: Date.parse(OPENED_AT),
  });
  assert.ok(nextPitch?.kind === "START_PITCH");
  assert.deepEqual(authorizeBaseballCommand(afterAck1, nextPitch, HOME, OPENED_AT), { ok: true });
  const started = committed(applyAuthorizedBaseballCommand(afterAck1, nextPitch, OPENED_AT));
  assert.equal(started.presentationGate, undefined);
  assert.equal(started.gameState?.activePlay?.playId, "presentation-play-2");
});

test("한쪽 ACK가 없어도 서버 deadline 뒤에는 재접속한 참가자가 경기를 계속할 수 있다", () => {
  const { resolved, playId } = resolvedRoom();
  const ack0 = buildOnlinePresentationAckEnvelope(resolved, 0, {
    playId,
    commandId: "presentation-timeout-ack-0",
  });
  assert.ok(ack0?.kind === "ACK_PRESENTATION");
  const partial = committed(applyAuthorizedBaseballCommand(resolved, ack0, OPENED_AT));
  const deadline = Date.parse(partial.presentationGate!.expiresAt);
  assert.equal(isBaseballPresentationGateBlocking(partial, deadline - 1), true);
  assert.equal(isBaseballPresentationGateBlocking(partial, deadline), false);

  const nextPitch = buildOnlineStartPitchEnvelope(partial, 1, {
    pitchType: "slider",
    target: { x: 0.45, y: 0.4 },
    commandId: "presentation-timeout-pitch",
    playId: "presentation-timeout-play-2",
    nowMs: deadline,
  });
  assert.ok(nextPitch?.kind === "START_PITCH");
  assert.deepEqual(authorizeBaseballCommand(
    partial,
    nextPitch,
    HOME,
    new Date(deadline).toISOString(),
  ), { ok: true });
});

test("migration은 ACK 멱등 로그·행 잠금·서버 deadline·START 소비를 DB에서 강제한다", () => {
  const sql = readFileSync(path.join(
    process.cwd(),
    "supabase/migrations/20260824_baseball_presentation_gate.sql",
  ), "utf8");
  assert.match(sql, /ACK_PRESENTATION/);
  assert.match(sql, /for update/i);
  assert.match(sql, /primary|baseball_command_log/i);
  assert.match(sql, /v_existing\.payload\s*=\s*p_payload/i);
  assert.ok(sql.indexOf("v_existing.payload = p_payload") < sql.indexOf("v_current_room_revision <> p_base_room_revision"));
  assert.match(sql, /PRESENTATION_PENDING/);
  assert.match(sql, /statement_timestamp\(\)/);
  assert.match(sql, /interval '20 seconds'/);
  assert.match(sql, /presentationGate,displayBeforeResult[\s\S]*v_room\s*->\s*'gameState'/i);
  assert.match(sql, /start pitch must consume the presentation gate/);
  assert.match(sql, /jsonb_build_array\(p_actor_seat\)/);
  assert.match(sql, /revoke execute on function public\.commit_baseball_command[\s\S]*from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.commit_baseball_command[\s\S]*to service_role/i);
});
