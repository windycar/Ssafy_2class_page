import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
  type BaseballRoomActivity,
  type BaseballRoomPlayer,
} from "../../src/types/baseballRoom.ts";
import { normalizeBaseballRoom } from "../../src/utils/games/baseball/normalizeRoom.ts";
import { createGameState } from "../../src/utils/games/baseball/gameState.ts";
import type { BaseballRoomMemberIdentity } from "./baseballRoomAuth.ts";

export const BASEBALL_ROOM_COMMAND_SCHEMA_VERSION = 1 as const;
export const BASEBALL_ROOM_START_HEARTBEAT_MAX_AGE_MS = 45_000;
export const BASEBALL_ROOM_STALE_REAP_AGE_MS = 120_000;

export type BaseballRoomCommandKind =
  | "CREATE"
  | "JOIN"
  | "SET_READY"
  | "HEARTBEAT"
  | "START"
  | "LEAVE"
  | "CANCEL";

interface BaseballRoomCommandBase {
  schemaVersion: typeof BASEBALL_ROOM_COMMAND_SCHEMA_VERSION;
  commandId: string;
  kind: BaseballRoomCommandKind;
}

export interface BaseballRoomCreateCommand extends BaseballRoomCommandBase {
  kind: "CREATE";
  payload: {
    title: string;
    description: string;
    isPublic: boolean;
    sessionId: string;
  };
}

interface BaseballRoomRevisionCommandBase extends BaseballRoomCommandBase {
  roomId: string;
  expectedRevision: number;
}

export interface BaseballRoomJoinCommand extends BaseballRoomRevisionCommandBase {
  kind: "JOIN";
  payload: { sessionId: string };
}

export interface BaseballRoomSetReadyCommand extends BaseballRoomRevisionCommandBase {
  kind: "SET_READY";
  payload: { sessionId: string; isReady: boolean };
}

export interface BaseballRoomHeartbeatCommand extends BaseballRoomRevisionCommandBase {
  kind: "HEARTBEAT";
  payload: { sessionId: string };
}

export interface BaseballRoomStartCommand extends BaseballRoomRevisionCommandBase {
  kind: "START";
  payload: { sessionId: string };
}

export interface BaseballRoomLeaveCommand extends BaseballRoomRevisionCommandBase {
  kind: "LEAVE";
  payload: { sessionId: string };
}

export interface BaseballRoomCancelCommand extends BaseballRoomRevisionCommandBase {
  kind: "CANCEL";
  payload: { sessionId: string };
}

export type BaseballRoomCommandEnvelope =
  | BaseballRoomCreateCommand
  | BaseballRoomJoinCommand
  | BaseballRoomSetReadyCommand
  | BaseballRoomHeartbeatCommand
  | BaseballRoomStartCommand
  | BaseballRoomLeaveCommand
  | BaseballRoomCancelCommand;

export type BaseballRoomCommandErrorCode =
  | "STALE_REVISION"
  | "ROOM_SCHEMA_UPGRADE_REQUIRED"
  | "ROOM_CONTEXT_MISMATCH"
  | "ROOM_MEMBER_FORBIDDEN"
  | "ROOM_STATE_CONFLICT"
  | "ROOM_FULL"
  | "ALREADY_JOINED"
  | "HOST_ONLY"
  | "SESSION_CONFLICT"
  | "PLAYERS_NOT_READY"
  | "PLAYERS_NOT_CONNECTED"
  | "INVALID_RESULTING_ROOM";

export type BaseballRoomCommandApplicationResult =
  | { ok: true; room: BaseballRoom | null; deleted: boolean }
  | {
      ok: false;
      status: 403 | 409 | 426;
      code: BaseballRoomCommandErrorCode;
    };

export interface BaseballRoomCommandServerContext {
  now: string;
  roomId: string;
  activityId: string;
  matchId: string;
  seed: number;
}

export interface BaseballRoomCommandRpcArguments {
  p_command_id: string;
  p_kind: BaseballRoomCommandKind;
  p_room_id: string;
  p_expected_revision: number | null;
  p_payload: Record<string, unknown>;
  p_next_room: BaseballRoom | null;
  p_delete_room: boolean;
  p_actor_auth_id: string;
  p_actor_student_id: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validString(value: unknown, minimumLength = 1, maximumLength = 128) {
  return typeof value === "string"
    && value.length >= minimumLength
    && value.length <= maximumLength;
}

function validRevision(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function canonicalSessionPayload(payload: unknown) {
  if (!isRecord(payload) || !validString(payload.sessionId, 8, 128)) return null;
  return { sessionId: payload.sessionId };
}

/** Rebuilds an allow-listed command and drops all untrusted identity/state fields. */
export function parseBaseballRoomCommandRequestBody(
  raw: unknown,
): BaseballRoomCommandEnvelope | null {
  if (
    !isRecord(raw)
    || raw.schemaVersion !== BASEBALL_ROOM_COMMAND_SCHEMA_VERSION
    || !validString(raw.commandId, 8, 128)
    || !validString(raw.kind)
  ) return null;

  const base = {
    schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
    commandId: raw.commandId,
  } as const;

  if (raw.kind === "CREATE") {
    if (
      Object.hasOwn(raw, "roomId")
      || Object.hasOwn(raw, "expectedRevision")
      || !isRecord(raw.payload)
      || typeof raw.payload.title !== "string"
      || !validString(raw.payload.title.trim(), 1, 120)
      || !validString(raw.payload.description, 0, 500)
      || typeof raw.payload.isPublic !== "boolean"
      || !validString(raw.payload.sessionId, 8, 128)
    ) return null;
    return {
      ...base,
      kind: "CREATE",
      payload: {
        title: (raw.payload.title as string).trim(),
        description: (raw.payload.description as string).trim(),
        isPublic: raw.payload.isPublic,
        sessionId: raw.payload.sessionId,
      },
    };
  }

  if (
    !validString(raw.roomId, 8, 128)
    || !raw.roomId.startsWith("baseball-")
    || !validRevision(raw.expectedRevision)
  ) return null;
  const sessionPayload = canonicalSessionPayload(raw.payload);
  if (!sessionPayload) return null;
  const revisionBase = {
    ...base,
    roomId: raw.roomId,
    expectedRevision: raw.expectedRevision,
  };

  if (raw.kind === "SET_READY") {
    if (!isRecord(raw.payload) || typeof raw.payload.isReady !== "boolean") return null;
    return {
      ...revisionBase,
      kind: "SET_READY",
      payload: { ...sessionPayload, isReady: raw.payload.isReady },
    };
  }
  if (raw.kind === "JOIN") return { ...revisionBase, kind: "JOIN", payload: sessionPayload };
  if (raw.kind === "HEARTBEAT") {
    return { ...revisionBase, kind: "HEARTBEAT", payload: sessionPayload };
  }
  if (raw.kind === "START") return { ...revisionBase, kind: "START", payload: sessionPayload };
  if (raw.kind === "LEAVE") return { ...revisionBase, kind: "LEAVE", payload: sessionPayload };
  if (raw.kind === "CANCEL") return { ...revisionBase, kind: "CANCEL", payload: sessionPayload };
  return null;
}

/** Canonical idempotency payload. It never includes a server-generated room/match/seed. */
export function canonicalizeBaseballRoomCommandEnvelope(
  envelope: BaseballRoomCommandEnvelope,
): Record<string, unknown> {
  return {
    schemaVersion: envelope.schemaVersion,
    commandId: envelope.commandId,
    kind: envelope.kind,
    ...(envelope.kind === "CREATE"
      ? {}
      : {
          roomId: envelope.roomId,
          expectedRevision: envelope.expectedRevision,
        }),
    payload: { ...envelope.payload },
  };
}

function actorPlayer(room: BaseballRoom, identity: BaseballRoomMemberIdentity) {
  return room.players.find((player) => (
    player.authId === identity.authId && player.studentId === identity.studentId
  ));
}

function activity(
  context: BaseballRoomCommandServerContext,
  type: string,
  message: string,
): BaseballRoomActivity {
  return {
    id: context.activityId,
    roomId: context.roomId,
    type,
    message,
    createdAt: context.now,
  };
}

function withActivity(room: BaseballRoom, item: BaseballRoomActivity) {
  return [item, ...room.activityLogs].slice(0, 100);
}

function playerFromIdentity(
  identity: BaseballRoomMemberIdentity,
  seat: 0 | 1,
  isHost: boolean,
  sessionId: string,
  now: string,
): BaseballRoomPlayer {
  return {
    seat,
    studentId: identity.studentId,
    authId: identity.authId,
    name: identity.name,
    username: identity.username,
    isHost,
    isReady: false,
    status: "waiting",
    joinedAt: now,
    sessionId,
    lastSeenAt: now,
  };
}

function normalizeResult(room: BaseballRoom): BaseballRoomCommandApplicationResult {
  const normalized = normalizeBaseballRoom(room, room.id);
  if (!normalized.ok || normalized.sourceVersion !== 2 || normalized.needsPersistence) {
    return { ok: false, status: 409, code: "INVALID_RESULTING_ROOM" };
  }
  return { ok: true, room: normalized.value, deleted: false };
}

function requiresMatchingSession(
  player: BaseballRoomPlayer,
  sessionId: string,
): BaseballRoomCommandApplicationResult | null {
  if (player.sessionId === sessionId) return null;
  return { ok: false, status: 409, code: "SESSION_CONFLICT" };
}

function isFreshServerHeartbeat(player: BaseballRoomPlayer, nowMs: number) {
  if (!player.sessionId || !player.lastSeenAt) return false;
  const lastSeenAt = Date.parse(player.lastSeenAt);
  const age = nowMs - lastSeenAt;
  return Number.isFinite(lastSeenAt)
    && age >= 0
    && age <= BASEBALL_ROOM_START_HEARTBEAT_MAX_AGE_MS;
}

function isSafelyReapableWaitingPlayer(player: BaseballRoomPlayer, nowMs: number) {
  const lastSeenAt = Date.parse(player.lastSeenAt ?? player.joinedAt);
  return Number.isFinite(lastSeenAt)
    && nowMs - lastSeenAt >= BASEBALL_ROOM_STALE_REAP_AGE_MS;
}

export function applyBaseballRoomCommand(
  room: BaseballRoom | null,
  envelope: BaseballRoomCommandEnvelope,
  identity: BaseballRoomMemberIdentity,
  context: BaseballRoomCommandServerContext,
): BaseballRoomCommandApplicationResult {
  if (envelope.kind === "CREATE") {
    if (room) return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    return normalizeResult({
      schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
      revision: 0,
      id: context.roomId,
      title: envelope.payload.title,
      description: envelope.payload.description,
      hostStudentId: identity.studentId,
      maxPlayers: 2,
      isPublic: envelope.payload.isPublic,
      status: "recruiting",
      players: [playerFromIdentity(
        identity,
        0,
        true,
        envelope.payload.sessionId,
        context.now,
      )],
      activityLogs: [activity(
        context,
        "create",
        `${identity.name} 님이 야구 게임방을 만들었습니다.`,
      )],
      createdAt: context.now,
    });
  }

  if (!room) return { ok: false, status: 409, code: "ROOM_CONTEXT_MISMATCH" };
  if (room.id !== envelope.roomId) {
    return { ok: false, status: 409, code: "ROOM_CONTEXT_MISMATCH" };
  }
  if (room.revision !== envelope.expectedRevision) {
    return { ok: false, status: 409, code: "STALE_REVISION" };
  }

  const me = actorPlayer(room, identity);
  if (envelope.kind === "JOIN") {
    if (me) return { ok: false, status: 409, code: "ALREADY_JOINED" };
    if (
      room.status !== "recruiting"
      && room.status !== "ready"
      && room.status !== "full"
    ) {
      return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    }
    const nowMs = Date.parse(context.now);
    const retainedPlayers = Number.isFinite(nowMs)
      ? room.players.filter((player) => !isSafelyReapableWaitingPlayer(player, nowMs))
      : room.players;
    if (retainedPlayers.length >= 2) {
      return { ok: false, status: 409, code: "ROOM_FULL" };
    }
    const retainedHost = retainedPlayers.find((player) => player.isHost)
      ?? [...retainedPlayers].sort((left, right) => (
        Date.parse(left.joinedAt) - Date.parse(right.joinedAt)
      ))[0];
    const occupiedSeat = retainedPlayers[0]?.seat;
    const joined = playerFromIdentity(
      identity,
      occupiedSeat === 0 ? 1 : 0,
      retainedPlayers.length === 0,
      envelope.payload.sessionId,
      context.now,
    );
    const players = [
      ...retainedPlayers.map((player) => ({
        ...player,
        isHost: player.studentId === retainedHost?.studentId,
        isReady: false,
        status: "waiting" as const,
      })),
      joined,
    ].sort((left, right) => left.seat - right.seat);
    return normalizeResult({
      ...room,
      revision: room.revision + 1,
      hostStudentId: retainedHost?.studentId ?? identity.studentId,
      status: players.length === 2 ? "ready" : "recruiting",
      players,
      activityLogs: withActivity(room, activity(
        context,
        "join",
        retainedPlayers.length < room.players.length
          ? `${identity.name} 님이 연결이 끊긴 좌석을 정리하고 참여했습니다.`
          : `${identity.name} 님이 참여했습니다.`,
      )),
    });
  }

  if (!me) return { ok: false, status: 403, code: "ROOM_MEMBER_FORBIDDEN" };

  if (envelope.kind === "HEARTBEAT") {
    if (
      room.status !== "recruiting"
      && room.status !== "ready"
      && room.status !== "full"
    ) {
      return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    }
    const nowMs = Date.parse(context.now);
    const mayReapWaitingPlayer = room.status === "recruiting"
      || room.status === "ready"
      || room.status === "full";
    const stalePlayers = mayReapWaitingPlayer && Number.isFinite(nowMs)
      ? room.players.filter((player) => (
          player.studentId !== identity.studentId
          && isSafelyReapableWaitingPlayer(player, nowMs)
        ))
      : [];
    const staleStudentIds = new Set(stalePlayers.map((player) => player.studentId));
    const retainedPlayers = room.players.filter(
      (player) => !staleStudentIds.has(player.studentId),
    );
    const actorBecomesHost = stalePlayers.some((player) => player.isHost);
    const players = retainedPlayers.map((player) => player.studentId === identity.studentId
      ? {
          ...player,
          isHost: actorBecomesHost ? true : player.isHost,
          isReady: stalePlayers.length > 0 ? false : player.isReady,
          status: stalePlayers.length > 0 ? "waiting" as const : player.status,
          sessionId: envelope.payload.sessionId,
          lastSeenAt: context.now,
        }
      : player);
    return normalizeResult({
      ...room,
      revision: room.revision + 1,
      hostStudentId: actorBecomesHost ? identity.studentId : room.hostStudentId,
      status: stalePlayers.length > 0 ? "recruiting" : room.status,
      players,
      activityLogs: stalePlayers.length > 0
        ? withActivity(room, activity(
            context,
            "stale-leave",
            `${stalePlayers[0].name} 님의 연결이 장시간 끊겨 좌석을 정리했습니다.`,
          ))
        : room.activityLogs,
    });
  }

  const mayLeaveMatchWithoutLobbySession = envelope.kind === "LEAVE"
    && (
      room.status === "playing"
      || room.status === "finished"
      || room.status === "cancelled"
    );
  const sessionFailure = mayLeaveMatchWithoutLobbySession
    ? null
    : requiresMatchingSession(me, envelope.payload.sessionId);
  if (sessionFailure) return sessionFailure;

  if (envelope.kind === "SET_READY") {
    if (
      room.status !== "recruiting"
      && room.status !== "ready"
      && room.status !== "full"
    ) {
      return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    }
    const players = room.players.map((player) => player.studentId === identity.studentId
      ? {
          ...player,
          isReady: envelope.payload.isReady,
          status: envelope.payload.isReady ? "ready" as const : "waiting" as const,
          lastSeenAt: context.now,
        }
      : player);
    return normalizeResult({
      ...room,
      revision: room.revision + 1,
      status: players.length === 2 ? "ready" : "recruiting",
      players,
    });
  }

  if (envelope.kind === "START") {
    if (room.hostStudentId !== identity.studentId || !me.isHost) {
      return { ok: false, status: 403, code: "HOST_ONLY" };
    }
    if (room.status !== "ready" && room.status !== "full") {
      return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    }
    if (
      room.players.length !== 2
      || new Set(room.players.map((player) => player.authId)).size !== 2
      || new Set(room.players.map((player) => player.studentId)).size !== 2
      || room.players.some((player) => !player.isReady)
    ) {
      return { ok: false, status: 409, code: "PLAYERS_NOT_READY" };
    }
    const nowMs = Date.parse(context.now);
    if (!Number.isFinite(nowMs) || room.players.some(
      (player) => !isFreshServerHeartbeat(player, nowMs),
    )) {
      return { ok: false, status: 409, code: "PLAYERS_NOT_CONNECTED" };
    }
    const visitor = room.players.find((player) => player.seat === 0);
    const home = room.players.find((player) => player.seat === 1);
    if (!visitor || !home) {
      return { ok: false, status: 409, code: "ROOM_CONTEXT_MISMATCH" };
    }
    return normalizeResult({
      ...room,
      revision: room.revision + 1,
      status: "playing",
      players: room.players.map((player) => ({ ...player, status: "playing" })),
      startedAt: context.now,
      matchId: context.matchId,
      gameState: createGameState(visitor.name, home.name, context.seed),
      activityLogs: withActivity(room, activity(
        context,
        "start",
        "야구 경기가 시작되었습니다.",
      )),
    });
  }

  if (envelope.kind === "CANCEL") {
    if (room.hostStudentId !== identity.studentId || !me.isHost) {
      return { ok: false, status: 403, code: "HOST_ONLY" };
    }
    if (room.status === "finished" || room.status === "cancelled") {
      return { ok: false, status: 409, code: "ROOM_STATE_CONFLICT" };
    }
    return normalizeResult({
      ...room,
      revision: room.revision + 1,
      status: "cancelled",
      finishedAt: context.now,
      activityLogs: withActivity(room, activity(
        context,
        "cancel",
        `${identity.name} 님이 야구 게임방을 취소했습니다.`,
      )),
    });
  }

  const remaining = room.players.filter((player) => player.studentId !== identity.studentId);
  if (remaining.length === 0) return { ok: true, room: null, deleted: true };
  const leavingActiveMatch = room.status === "playing";
  const nextHost = room.hostStudentId === identity.studentId
    ? [...remaining].sort((left, right) => (
        Date.parse(left.joinedAt) - Date.parse(right.joinedAt)
      ))[0]
    : remaining.find((player) => player.studentId === room.hostStudentId) ?? remaining[0];
  const waitingStatus = room.status === "ready" || room.status === "full"
    ? "recruiting"
    : room.status;
  return normalizeResult({
    ...room,
    revision: room.revision + 1,
    hostStudentId: nextHost.studentId,
    players: remaining.map((player) => ({
      ...player,
      isHost: player.studentId === nextHost.studentId,
      ...(leavingActiveMatch
        ? {}
        : { isReady: false, status: "waiting" as const }),
    })),
    status: leavingActiveMatch ? "cancelled" : waitingStatus,
    ...(leavingActiveMatch ? { finishedAt: context.now } : {}),
    activityLogs: withActivity(room, activity(
      context,
      "leave",
      `${identity.name} 님이 게임방을 나갔습니다.`,
    )),
  });
}

export function buildBaseballRoomCommandRpcArguments(
  envelope: BaseballRoomCommandEnvelope,
  identity: BaseballRoomMemberIdentity,
  context: BaseballRoomCommandServerContext,
  room: BaseballRoom | null,
  deleted: boolean,
): BaseballRoomCommandRpcArguments {
  return {
    p_command_id: envelope.commandId,
    p_kind: envelope.kind,
    p_room_id: envelope.kind === "CREATE" ? context.roomId : envelope.roomId,
    p_expected_revision: envelope.kind === "CREATE" ? null : envelope.expectedRevision,
    p_payload: canonicalizeBaseballRoomCommandEnvelope(envelope),
    p_next_room: room,
    p_delete_room: deleted,
    p_actor_auth_id: identity.authId,
    p_actor_student_id: identity.studentId,
  };
}
