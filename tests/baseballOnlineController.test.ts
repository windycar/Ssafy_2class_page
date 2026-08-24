import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  acceptCanonicalOnlineRoom,
  buildOnlineBatterActionEnvelope,
  buildOnlineStartPitchEnvelope,
  deriveBaseballOnlineRole,
  executeBaseballOnlineCommandCycle,
} from "../src/hooks/useBaseballOnlineController.ts";
import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import { canRenderBaseballOnlineRoom } from "../src/utils/games/baseball/onlineRoomAccess.ts";
import { startPitch } from "../src/utils/games/baseball/playEngine.ts";

const NOW = "2026-08-23T12:00:00.000Z";
const AUTH_0 = "00000000-0000-4000-8000-000000000101";
const AUTH_1 = "00000000-0000-4000-8000-000000000202";

function createPlayingRoom(): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
    id: "baseball-online-controller-room",
    title: "온라인 컨트롤러 테스트",
    description: "",
    hostStudentId: 101,
    maxPlayers: 2,
    isPublic: false,
    status: "playing",
    players: [
      {
        seat: 0,
        studentId: 101,
        authId: AUTH_0,
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
        authId: AUTH_1,
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
    matchId: "baseball-online-controller-match",
    gameState: createGameState("원정", "홈", 91_827),
  };
}

function resolveStartedPitch(room: BaseballRoom) {
  const envelope = buildOnlineStartPitchEnvelope(room, 1, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
    commandId: "online-command-pitch-1",
    playId: "online-play-1",
  });
  assert.ok(envelope?.kind === "START_PITCH");
  const result = startPitch(room.gameState!, envelope.command);
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error(result.code);
  return {
    envelope,
    room: {
      ...room,
      revision: room.revision + 1,
      gameState: result.state,
    } satisfies BaseballRoom,
  };
}

test("진행 중 경기는 인증된 두 참가자를 강제하고 취소 결과는 남은 참가자에게 표시한다", () => {
  const playing = createPlayingRoom();
  assert.equal(canRenderBaseballOnlineRoom(playing, AUTH_0), true);

  const missingOpponent = {
    ...playing,
    players: [playing.players[0]],
  } satisfies BaseballRoom;
  assert.equal(canRenderBaseballOnlineRoom(missingOpponent, AUTH_0), false);

  const cancelled = {
    ...missingOpponent,
    revision: playing.revision + 1,
    status: "cancelled" as const,
  } satisfies BaseballRoom;
  assert.equal(canRenderBaseballOnlineRoom(cancelled, AUTH_0), true);
  assert.equal(canRenderBaseballOnlineRoom(cancelled, AUTH_1), false);
  assert.equal(canRenderBaseballOnlineRoom({ ...cancelled, matchId: undefined }, AUTH_0), false);
});

test("수비 seat만 START_PITCH envelope를 만들고 revision·sequence를 서버 CAS 기준으로 고정한다", () => {
  const room = createPlayingRoom();
  let generated = 0;
  const envelope = buildOnlineStartPitchEnvelope(room, 1, {
    pitchType: "slider",
    target: { x: -1, y: 2 },
    timingQuality: "PERFECT",
  }, (prefix) => `${prefix}-${++generated}`);

  assert.ok(envelope?.kind === "START_PITCH");
  assert.equal(deriveBaseballOnlineRole(room, AUTH_1), "PITCHING");
  assert.equal(deriveBaseballOnlineRole(room, AUTH_0), "WAITING");
  assert.equal(envelope.actorSeat, 1);
  assert.equal(envelope.commandSequence, room.gameState!.revision + 1);
  assert.equal(envelope.baseRoomRevision, room.revision);
  assert.equal(envelope.baseGameRevision, room.gameState!.revision);
  assert.equal(envelope.command.sequence, 1);
  assert.deepEqual(envelope.command.target, { x: 0, y: 1 });
  assert.equal(envelope.command.commandId, envelope.commandId);
  assert.equal(envelope.command.playId, envelope.playId);
  assert.equal(buildOnlineStartPitchEnvelope(room, 0, {
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
  }), null);
});

test("투구 확정 뒤 공격 seat만 같은 playId의 스윙·TAKE를 만들 수 있다", () => {
  const started = resolveStartedPitch(createPlayingRoom());
  assert.equal(deriveBaseballOnlineRole(started.room, AUTH_0), "BATTING");
  assert.equal(deriveBaseballOnlineRole(started.room, AUTH_1), "WAITING");

  const swing = buildOnlineBatterActionEnvelope(started.room, 0, {
    kind: "SWING",
    swingType: "POWER",
    aim: { x: 2, y: -1 },
    progress: 9,
    commandId: "online-command-swing-1",
  });
  assert.ok(swing?.kind === "BATTER_ACTION");
  assert.equal(swing.playId, started.envelope.playId);
  assert.equal(swing.commandSequence, started.room.gameState!.revision + 1);
  assert.equal(swing.command.action.kind, "SWING");
  if (swing.command.action.kind !== "SWING") throw new Error("expected swing");
  assert.deepEqual(swing.command.action.swing.aim, { x: 1, y: 0 });
  assert.equal(swing.command.action.swing.progress, 1.25);

  const take = buildOnlineBatterActionEnvelope(started.room, 0, {
    kind: "TAKE",
    commandId: "online-command-take-1",
  });
  assert.ok(take?.kind === "BATTER_ACTION");
  assert.deepEqual(take.command.action, {
    kind: "TAKE",
    batterId: take.command.batterId,
  });
  assert.equal(buildOnlineBatterActionEnvelope(started.room, 1, { kind: "TAKE" }), null);
});

test("canonical room은 같은 match·seed에서 room/game revision이 전진할 때만 교체한다", () => {
  const current = createPlayingRoom();
  const advanced = structuredClone(current);
  advanced.revision += 1;
  advanced.gameState!.revision += 1;
  assert.deepEqual(acceptCanonicalOnlineRoom(current, advanced), advanced);

  const staleRoom = structuredClone(advanced);
  staleRoom.revision = current.revision - 1;
  assert.equal(acceptCanonicalOnlineRoom(current, staleRoom), null);
  const staleGame = structuredClone(advanced);
  staleGame.gameState!.revision = current.gameState!.revision - 1;
  assert.equal(acceptCanonicalOnlineRoom(current, staleGame), null);
  const wrongMatch = { ...advanced, matchId: "baseball-other-match" };
  assert.equal(acceptCanonicalOnlineRoom(current, wrongMatch), null);
  const wrongSeed = structuredClone(advanced);
  wrongSeed.gameState!.seed += 1;
  assert.equal(acceptCanonicalOnlineRoom(current, wrongSeed), null);
});

test("커밋 성공은 canonical 적용 → 상태 없는 notice → 재조회 순서로 처리한다", async () => {
  const current = createPlayingRoom();
  const started = resolveStartedPitch(current);
  const events: string[] = [];
  const result = await executeBaseballOnlineCommandCycle({
    currentRoom: current,
    envelope: started.envelope,
    async sendCommand() {
      events.push("send");
      return {
        ok: true,
        status: 200,
        idempotent: false,
        commandId: started.envelope.commandId,
        commandSequence: started.envelope.commandSequence,
        room: started.room,
      };
    },
    async broadcastNotice(envelope, roomRevision, gameRevision) {
      events.push("broadcast");
      assert.equal(envelope.commandId, started.envelope.commandId);
      assert.equal(roomRevision, current.revision + 1);
      assert.equal(gameRevision, current.gameState!.revision + 1);
      return true;
    },
    async refetchRoom() {
      events.push("refetch");
      return structuredClone(started.room);
    },
    onCanonicalRoom() {
      events.push("apply");
    },
  });

  assert.deepEqual(events, ["send", "apply", "broadcast", "refetch", "apply"]);
  assert.equal(result.outcome, "COMMITTED");
  if (result.outcome !== "COMMITTED") throw new Error("expected committed");
  assert.equal(result.broadcasted, true);
  assert.equal(result.refetched, true);
});

test("409는 broadcast 없이 최신 room을 적용하고 다시 읽는다", async () => {
  const current = createPlayingRoom();
  const started = resolveStartedPitch(current);
  let broadcastCount = 0;
  let refetchCount = 0;
  const result = await executeBaseballOnlineCommandCycle({
    currentRoom: current,
    envelope: started.envelope,
    async sendCommand() {
      return {
        ok: false,
        status: 409,
        code: "STALE_REVISION",
        room: started.room,
      };
    },
    async broadcastNotice() {
      broadcastCount += 1;
      return true;
    },
    async refetchRoom() {
      refetchCount += 1;
      return started.room;
    },
  });

  assert.equal(result.outcome, "CONFLICT");
  assert.equal(result.room.revision, started.room.revision);
  assert.equal(broadcastCount, 0);
  assert.equal(refetchCount, 1);
});

test("온라인 플레이 코드는 room heartbeat/upsert를 사용하지 않고 Presence 복구 게이트를 둔다", async () => {
  const controllerSource = await readFile(
    new URL("../src/hooks/useBaseballOnlineController.ts", import.meta.url),
    "utf8",
  );
  const componentSource = await readFile(
    new URL("../src/components/games/baseball/v2/BaseballOnlineGameV2.tsx", import.meta.url),
    "utf8",
  );
  const viewSource = await readFile(
    new URL("../src/views/games/BaseballGameView.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(controllerSource, /\.updateRoom\s*\(/);
  assert.doesNotMatch(controllerSource, /\.createRoom\s*\(/);
  assert.doesNotMatch(controllerSource, /withBaseballPresenceHeartbeat/);
  assert.match(controllerSource, /OPPONENT_OFFLINE/);
  assert.match(controllerSource, /PRESENCE_RECONNECTED/);
  assert.doesNotMatch(componentSource, /useBaseballRoomPresence/);
  assert.match(componentSource, /allPlayersConnected/);
  assert.match(componentSource, /room\.status === "cancelled"/);
  assert.match(componentSource, /title="경기 취소"/);
  assert.match(viewSource, /BaseballSoloGameV2/);
  assert.match(viewSource, /BaseballOnlineGameV2/);
  assert.doesNotMatch(viewSource, /useBaseballMatchChannel|sendGameEvent|Math\.random/);
  assert.doesNotMatch(viewSource, /applyPlateOutcome|createGameState|judgeSwingContact/);
});
