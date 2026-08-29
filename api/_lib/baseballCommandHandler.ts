import type { BaseballRoom } from "../../src/types/baseballRoom.ts";
import {
  parseBaseballMatchCommandEnvelope,
  type BaseballMatchCommandEnvelope,
} from "../../src/utils/games/baseball/onlineProtocol.ts";
import { normalizeBaseballRoom } from "../../src/utils/games/baseball/normalizeRoom.ts";
import {
  executeBatterAction,
  startPitch,
  type EngineCommandErrorCode,
} from "../../src/utils/games/baseball/playEngine.ts";
import {
  acknowledgeBaseballPresentationGate,
  createBaseballPresentationGate,
  hasBaseballPresentationAcknowledgement,
  isBaseballPresentationGateBlocking,
} from "../../src/utils/games/baseball/presentationGate.ts";
import type { BaseballMemberIdentity } from "./baseballAuth.ts";

export type BaseballCommandAuthorizationCode =
  | "ROOM_CONTEXT_MISMATCH"
  | "ROOM_NOT_PLAYING"
  | "ROOM_MEMBER_FORBIDDEN"
  | "ACTOR_SEAT_FORBIDDEN"
  | "ACTOR_TURN_FORBIDDEN"
  | "PRESENTATION_PENDING"
  | "PRESENTATION_GATE_MISMATCH"
  | "PRESENTATION_ALREADY_ACKNOWLEDGED"
  | "STALE_REVISION";

export type BaseballCommandAuthorizationResult =
  | { ok: true }
  | {
      ok: false;
      status: 403 | 409;
      code: BaseballCommandAuthorizationCode;
    };

export type BaseballCommandApplicationResult =
  | { ok: true; room: BaseballRoom }
  | {
      ok: false;
      status: 400 | 403 | 409;
      code: EngineCommandErrorCode
        | "INVALID_RESULTING_ROOM"
        | "PRESENTATION_PENDING"
        | "PRESENTATION_GATE_MISMATCH"
        | "PRESENTATION_ALREADY_ACKNOWLEDGED";
    };

export interface BaseballCommandRpcArguments {
  p_room_id: string;
  p_match_id: string;
  p_command_id: string;
  p_command_sequence: number;
  p_base_room_revision: number;
  p_base_game_revision: number;
  p_seed: number;
  p_kind: "START_PITCH" | "BATTER_ACTION" | "ACK_PRESENTATION";
  p_payload: Record<string, unknown>;
  p_next_room: BaseballRoom;
  p_actor_auth_id: string;
  p_actor_student_id: number;
  p_actor_seat: 0 | 1;
}

function canonicalCommand(envelope: BaseballMatchCommandEnvelope) {
  if (envelope.kind === "START_PITCH") {
    return {
      commandId: envelope.command.commandId,
      expectedRevision: envelope.command.expectedRevision,
      playId: envelope.command.playId,
      sequence: envelope.command.sequence,
      pitcherId: envelope.command.pitcherId,
      pitchType: envelope.command.pitchType,
      target: {
        x: envelope.command.target.x,
        y: envelope.command.target.y,
      },
      timingQuality: envelope.command.timingQuality,
    };
  }

  if (envelope.kind === "ACK_PRESENTATION") {
    return {
      commandId: envelope.command.commandId,
      expectedRevision: envelope.command.expectedRevision,
      playId: envelope.command.playId,
    };
  }

  const action = envelope.command.action.kind === "TAKE"
    ? {
        kind: "TAKE" as const,
        batterId: envelope.command.action.batterId,
      }
    : {
        kind: "SWING" as const,
        swing: {
          batterId: envelope.command.action.swing.batterId,
          swingType: envelope.command.action.swing.swingType,
          aim: {
            x: envelope.command.action.swing.aim.x,
            y: envelope.command.action.swing.aim.y,
          },
          progress: envelope.command.action.swing.progress,
        },
      };
  return {
    commandId: envelope.command.commandId,
    expectedRevision: envelope.command.expectedRevision,
    playId: envelope.command.playId,
    batterId: envelope.command.batterId,
    action,
  };
}

/** Removes ignored request fields before the JSONB value is used as an idempotency key. */
export function canonicalizeBaseballCommandEnvelope(
  envelope: BaseballMatchCommandEnvelope,
): Record<string, unknown> {
  return {
    schemaVersion: envelope.schemaVersion,
    roomId: envelope.roomId,
    matchId: envelope.matchId,
    commandId: envelope.commandId,
    commandSequence: envelope.commandSequence,
    baseRoomRevision: envelope.baseRoomRevision,
    baseGameRevision: envelope.baseGameRevision,
    actorSeat: envelope.actorSeat,
    seed: envelope.seed,
    playId: envelope.playId,
    kind: envelope.kind,
    command: canonicalCommand(envelope),
  };
}

export function parseBaseballCommandRequestBody(
  value: unknown,
): BaseballMatchCommandEnvelope | null {
  return parseBaseballMatchCommandEnvelope(value);
}

export function authorizeBaseballCommand(
  room: BaseballRoom,
  envelope: BaseballMatchCommandEnvelope,
  identity: BaseballMemberIdentity,
  occurredAt = new Date().toISOString(),
): BaseballCommandAuthorizationResult {
  const game = room.gameState;
  if (
    room.id !== envelope.roomId
    || room.matchId !== envelope.matchId
    || !game
    || game.seed !== envelope.seed
  ) {
    return { ok: false, status: 409, code: "ROOM_CONTEXT_MISMATCH" };
  }

  const player = room.players.find(
    (candidate) => candidate.authId === identity.authId
      && candidate.studentId === identity.studentId,
  );
  if (!player) {
    return { ok: false, status: 403, code: "ROOM_MEMBER_FORBIDDEN" };
  }
  if (player.seat !== envelope.actorSeat) {
    return { ok: false, status: 403, code: "ACTOR_SEAT_FORBIDDEN" };
  }

  // A stale exact retry still reaches the RPC so the command log can return
  // an idempotent success, including the command that ended the game.
  // Current status/turn authorization is intentionally later.
  if (
    room.revision !== envelope.baseRoomRevision
    || game.revision !== envelope.baseGameRevision
  ) {
    return { ok: false, status: 409, code: "STALE_REVISION" };
  }
  if (room.status !== "playing" || game.status !== "playing") {
    return { ok: false, status: 409, code: "ROOM_NOT_PLAYING" };
  }


  if (envelope.kind === "ACK_PRESENTATION") {
    if (
      !room.presentationGate
      || room.presentationGate.playId !== envelope.playId
      || game.activePlay?.phase !== "RESOLVED"
      || game.activePlay.playId !== envelope.playId
    ) {
      return { ok: false, status: 409, code: "PRESENTATION_GATE_MISMATCH" };
    }
    if (hasBaseballPresentationAcknowledgement(room.presentationGate, envelope.actorSeat)) {
      return { ok: false, status: 409, code: "PRESENTATION_ALREADY_ACKNOWLEDGED" };
    }
    return { ok: true };
  }

  if (envelope.kind === "START_PITCH" && isBaseballPresentationGateBlocking(
    room,
    Date.parse(occurredAt),
  )) {
    return { ok: false, status: 409, code: "PRESENTATION_PENDING" };
  }

  const requiredSeat = envelope.kind === "START_PITCH"
    ? (game.battingTeam === 0 ? 1 : 0)
    : game.battingTeam;
  if (envelope.actorSeat !== requiredSeat) {
    return { ok: false, status: 403, code: "ACTOR_TURN_FORBIDDEN" };
  }
  return { ok: true };
}

function engineFailureStatus(code: EngineCommandErrorCode): 400 | 403 | 409 {
  if (code === "INVALID_ACTOR") return 403;
  if (
    code === "STALE_REVISION"
    || code === "DUPLICATE_COMMAND"
    || code === "PLAY_IN_PROGRESS"
    || code === "NO_ACTIVE_PITCH"
    || code === "PLAY_ID_MISMATCH"
    || code === "GAME_FINISHED"
  ) return 409;
  return 400;
}

export function applyAuthorizedBaseballCommand(
  room: BaseballRoom,
  envelope: BaseballMatchCommandEnvelope,
  occurredAt: string,
): BaseballCommandApplicationResult {
  if (!room.gameState) {
    return { ok: false, status: 409, code: "INVALID_RESULTING_ROOM" };
  }


  if (envelope.kind === "ACK_PRESENTATION") {
    const gate = room.presentationGate;
    if (
      !gate
      || gate.playId !== envelope.playId
      || room.gameState.activePlay?.phase !== "RESOLVED"
      || room.gameState.activePlay.playId !== envelope.playId
    ) {
      return { ok: false, status: 409, code: "PRESENTATION_GATE_MISMATCH" };
    }
    if (hasBaseballPresentationAcknowledgement(gate, envelope.actorSeat)) {
      return { ok: false, status: 409, code: "PRESENTATION_ALREADY_ACKNOWLEDGED" };
    }
    const nextRoom: BaseballRoom = {
      ...room,
      revision: room.revision + 1,
      gameState: {
        ...room.gameState,
        revision: room.gameState.revision + 1,
      },
      presentationGate: acknowledgeBaseballPresentationGate(gate, envelope.actorSeat),
    };
    const normalized = normalizeBaseballRoom(nextRoom, room.id);
    if (!normalized.ok || normalized.sourceVersion !== 2) {
      return { ok: false, status: 400, code: "INVALID_RESULTING_ROOM" };
    }
    return { ok: true, room: normalized.value };
  }

  if (envelope.kind === "START_PITCH" && isBaseballPresentationGateBlocking(
    room,
    Date.parse(occurredAt),
  )) {
    return { ok: false, status: 409, code: "PRESENTATION_PENDING" };
  }

  const engineResult = envelope.kind === "START_PITCH"
    ? startPitch(room.gameState, envelope.command)
    : executeBatterAction(room.gameState, {
        ...envelope.command,
        occurredAt,
      });
  if (!engineResult.ok) {
    return {
      ok: false,
      status: engineFailureStatus(engineResult.code),
      code: engineResult.code,
    };
  }

  const finished = engineResult.state.status === "finished";
  const { presentationGate: _previousPresentationGate, ...roomWithoutPresentationGate } = room;
  const nextRoom: BaseballRoom = {
    ...roomWithoutPresentationGate,
    revision: room.revision + 1,
    status: finished ? "finished" : "playing",
    gameState: engineResult.state,
    ...(finished ? { finishedAt: occurredAt } : {}),
    ...(envelope.kind === "BATTER_ACTION" && !finished
      ? {
          presentationGate: createBaseballPresentationGate(
            envelope.playId,
            occurredAt,
            room.gameState,
          ),
        }
      : {}),
  };
  const normalized = normalizeBaseballRoom(nextRoom, room.id);
  if (!normalized.ok || normalized.sourceVersion !== 2) {
    return { ok: false, status: 400, code: "INVALID_RESULTING_ROOM" };
  }
  return { ok: true, room: normalized.value };
}

export function buildBaseballCommandRpcArguments(
  envelope: BaseballMatchCommandEnvelope,
  identity: BaseballMemberIdentity,
  nextRoom: BaseballRoom,
): BaseballCommandRpcArguments {
  return {
    p_room_id: envelope.roomId,
    p_match_id: envelope.matchId,
    p_command_id: envelope.commandId,
    p_command_sequence: envelope.commandSequence,
    p_base_room_revision: envelope.baseRoomRevision,
    p_base_game_revision: envelope.baseGameRevision,
    p_seed: envelope.seed,
    p_kind: envelope.kind,
    p_payload: canonicalizeBaseballCommandEnvelope(envelope),
    p_next_room: nextRoom,
    p_actor_auth_id: identity.authId,
    p_actor_student_id: identity.studentId,
    p_actor_seat: envelope.actorSeat,
  };
}
