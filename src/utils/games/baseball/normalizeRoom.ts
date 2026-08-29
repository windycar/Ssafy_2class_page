import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
  type BaseballRoomActivity,
  type BaseballPresentationGate,
  type BaseballRoomPlayer,
} from "../../../types/baseballRoom.ts";
import type { GameRoomStatus } from "../../../types/game.ts";
import { normalizeBaseballGameState } from "./normalizeGameState.ts";

export type BaseballRoomNormalizeFailureCode =
  | "NOT_OBJECT"
  | "UNSUPPORTED_VERSION"
  | "ROW_ID_MISMATCH"
  | "INVALID_FIELD"
  | "INVALID_REVISION"
  | "INVALID_INVARIANT"
  | "INVALID_ACTIVE_MATCH";

export interface BaseballRoomNormalizeSuccess {
  ok: true;
  value: BaseballRoom;
  sourceVersion: 1 | 2;
  migrated: boolean;
  needsPersistence: boolean;
  repairs: string[];
}
export interface BaseballRoomNormalizeFailure {
  ok: false;
  code: BaseballRoomNormalizeFailureCode;
  path: string;
  recoverable: boolean;
}

export type BaseballRoomNormalizeResult =
  | BaseballRoomNormalizeSuccess
  | BaseballRoomNormalizeFailure;

type UnknownRecord = Record<string, unknown>;
type RoomSeat = 0 | 1;

const ROOM_STATUSES = new Set<GameRoomStatus>([
  "recruiting",
  "full",
  "ready",
  "playing",
  "finished",
  "cancelled",
]);
const PLAYER_STATUSES = new Set(["waiting", "ready", "playing"] as const);

function failure(
  code: BaseballRoomNormalizeFailureCode,
  path: string,
  recoverable = true,
): BaseballRoomNormalizeFailure {
  return { ok: false, code, path, recoverable };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafePositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

function normalizePresentationGate(
  raw: unknown,
  gameState: NonNullable<BaseballRoom["gameState"]> | undefined,
  roomStatus: GameRoomStatus,
): BaseballPresentationGate | BaseballRoomNormalizeFailure | undefined {
  if (raw === undefined) return undefined;
  if (!isRecord(raw)) return failure("INVALID_FIELD", "$.presentationGate");
  if (!isNonEmptyString(raw.playId)) {
    return failure("INVALID_FIELD", "$.presentationGate.playId");
  }
  if (!isIsoTimestamp(raw.openedAt) || !isIsoTimestamp(raw.expiresAt)) {
    return failure("INVALID_FIELD", "$.presentationGate.expiresAt");
  }
  if (!Array.isArray(raw.acknowledgedSeats)
    || raw.acknowledgedSeats.some((seat) => seat !== 0 && seat !== 1)
    || new Set(raw.acknowledgedSeats).size !== raw.acknowledgedSeats.length
    || raw.acknowledgedSeats.some((seat, index) => index > 0
      && Number(raw.acknowledgedSeats[index - 1]) >= Number(seat))) {
    return failure("INVALID_FIELD", "$.presentationGate.acknowledgedSeats");
  }
  const openedAtMs = Date.parse(raw.openedAt);
  const expiresAtMs = Date.parse(raw.expiresAt);
  if (expiresAtMs <= openedAtMs || expiresAtMs - openedAtMs > 60_000) {
    return failure("INVALID_INVARIANT", "$.presentationGate.expiresAt");
  }
  if (
    roomStatus !== "playing"
    || !gameState
    || gameState.status !== "playing"
    || gameState.activePlay?.phase !== "RESOLVED"
    || gameState.activePlay.playId !== raw.playId
    || gameState.lastPlay?.playId !== raw.playId
  ) {
    return failure("INVALID_INVARIANT", "$.presentationGate.playId");
  }
  let displayBeforeResult: NonNullable<BaseballPresentationGate["displayBeforeResult"]> | undefined;
  if (raw.displayBeforeResult !== undefined) {
    const normalizedDisplay = normalizeBaseballGameState(raw.displayBeforeResult);
    if (!normalizedDisplay.ok || normalizedDisplay.sourceVersion !== 2) {
      return failure("INVALID_FIELD", "$.presentationGate.displayBeforeResult");
    }
    const displayActivePlay = normalizedDisplay.value.activePlay;
    if (
      normalizedDisplay.value.status !== "playing"
      || normalizedDisplay.value.seed !== gameState.seed
      || normalizedDisplay.value.revision >= gameState.revision
      || displayActivePlay?.phase !== "AWAITING_BATTER"
      || displayActivePlay.playId !== raw.playId
      || displayActivePlay.batterId !== gameState.lastPlay?.batterId
      || normalizedDisplay.value.teams[0].id !== gameState.teams[0].id
      || normalizedDisplay.value.teams[1].id !== gameState.teams[1].id
    ) {
      return failure("INVALID_INVARIANT", "$.presentationGate.displayBeforeResult");
    }
    displayBeforeResult = normalizedDisplay.value;
  }
  return {
    playId: raw.playId,
    openedAt: raw.openedAt,
    expiresAt: raw.expiresAt,
    acknowledgedSeats: [...raw.acknowledgedSeats] as (0 | 1)[],
    ...(displayBeforeResult ? { displayBeforeResult } : {}),
  };
}

function isRoomStatus(value: unknown): value is GameRoomStatus {
  return typeof value === "string" && ROOM_STATUSES.has(value as GameRoomStatus);
}

function isPlayerStatus(value: unknown): value is BaseballRoomPlayer["status"] {
  return typeof value === "string"
    && PLAYER_STATUSES.has(value as BaseballRoomPlayer["status"]);
}

function normalizeOptionalPlayerPresence(
  raw: UnknownRecord,
  sourceVersion: 1 | 2,
  path: string,
): Pick<BaseballRoomPlayer, "sessionId" | "lastSeenAt"> | BaseballRoomNormalizeFailure {
  const sessionId = raw.sessionId;
  const lastSeenAt = raw.lastSeenAt;
  const sessionValid = sessionId === undefined || isNonEmptyString(sessionId);
  const lastSeenValid = lastSeenAt === undefined || isIsoTimestamp(lastSeenAt);
  const pairValid = lastSeenAt === undefined || sessionId !== undefined;

  if ((!sessionValid || !lastSeenValid || !pairValid) && sourceVersion === 2) {
    return failure("INVALID_FIELD", path);
  }

  if (!sessionValid || !lastSeenValid || !pairValid) return {};
  return {
    ...(sessionId === undefined ? {} : { sessionId }),
    ...(lastSeenAt === undefined ? {} : { lastSeenAt }),
  };
}

function normalizePlayer(
  raw: unknown,
  sourceVersion: 1 | 2,
  seat: RoomSeat,
  hostStudentId: number,
  path: string,
): BaseballRoomPlayer | BaseballRoomNormalizeFailure {
  if (!isRecord(raw)) return failure("INVALID_FIELD", path);
  if (!isSafePositiveInteger(raw.studentId)) return failure("INVALID_FIELD", `${path}.studentId`);
  if (!isNonEmptyString(raw.authId)) return failure("INVALID_FIELD", `${path}.authId`);
  if (!isNonEmptyString(raw.name)) return failure("INVALID_FIELD", `${path}.name`);
  if (typeof raw.username !== "string") return failure("INVALID_FIELD", `${path}.username`);
  if (typeof raw.isHost !== "boolean") return failure("INVALID_FIELD", `${path}.isHost`);
  if (typeof raw.isReady !== "boolean") return failure("INVALID_FIELD", `${path}.isReady`);
  if (!isPlayerStatus(raw.status)) return failure("INVALID_FIELD", `${path}.status`);
  if (!isIsoTimestamp(raw.joinedAt)) return failure("INVALID_FIELD", `${path}.joinedAt`);
  if (sourceVersion === 2 && raw.seat !== seat) return failure("INVALID_FIELD", `${path}.seat`);

  const shouldBeHost = raw.studentId === hostStudentId;
  if (sourceVersion === 2 && raw.isHost !== shouldBeHost) {
    return failure("INVALID_INVARIANT", `${path}.isHost`);
  }

  const presence = normalizeOptionalPlayerPresence(raw, sourceVersion, `${path}.sessionId`);
  if ("ok" in presence) return presence;

  return {
    studentId: raw.studentId,
    authId: raw.authId,
    name: raw.name,
    username: raw.username,
    seat,
    isHost: shouldBeHost,
    isReady: raw.isReady,
    status: raw.status,
    joinedAt: raw.joinedAt,
    ...presence,
  };
}

function normalizeActivity(
  raw: unknown,
  roomId: string,
  sourceVersion: 1 | 2,
  index: number,
): { activity: BaseballRoomActivity; repairedRoomId: boolean } | BaseballRoomNormalizeFailure {
  const path = `$.activityLogs[${index}]`;
  if (!isRecord(raw)) return failure("INVALID_FIELD", path);
  if (!isNonEmptyString(raw.id)) return failure("INVALID_FIELD", `${path}.id`);
  if (!isNonEmptyString(raw.type)) return failure("INVALID_FIELD", `${path}.type`);
  if (!isNonEmptyString(raw.message)) return failure("INVALID_FIELD", `${path}.message`);
  if (!isIsoTimestamp(raw.createdAt)) return failure("INVALID_FIELD", `${path}.createdAt`);

  const mayRepairEmptyRoomId = sourceVersion === 1 && raw.roomId === "";
  if (raw.roomId !== roomId && !mayRepairEmptyRoomId) {
    return failure("INVALID_INVARIANT", `${path}.roomId`);
  }

  return {
    activity: {
      id: raw.id,
      roomId,
      type: raw.type,
      message: raw.message,
      createdAt: raw.createdAt,
    },
    repairedRoomId: mayRepairEmptyRoomId,
  };
}

function validateRoomStatus(
  status: GameRoomStatus,
  players: BaseballRoomPlayer[],
  hasMatch: boolean,
): BaseballRoomNormalizeFailure | null {
  if (status === "recruiting" && players.length !== 1) {
    return failure("INVALID_INVARIANT", "$.players");
  }
  if ((status === "ready" || status === "full" || status === "playing") && players.length !== 2) {
    return failure("INVALID_INVARIANT", "$.players");
  }
  if (status === "playing" && !hasMatch) return failure("INVALID_ACTIVE_MATCH", "$.gameState");
  if (status !== "playing" && status !== "finished" && status !== "cancelled" && hasMatch) {
    return failure("INVALID_INVARIANT", "$.gameState");
  }
  if (status === "playing" && players.some((player) => player.status !== "playing")) {
    return failure("INVALID_INVARIANT", "$.players");
  }
  if (status !== "playing" && status !== "finished" && status !== "cancelled"
    && players.some((player) => player.status === "playing")) {
    return failure("INVALID_INVARIANT", "$.players");
  }
  return null;
}

/**
 * Converts persisted room_data into the current canonical room model.
 * The function is intentionally deterministic and never mutates its input.
 */
export function normalizeBaseballRoom(
  raw: unknown,
  expectedRowId?: string,
): BaseballRoomNormalizeResult {
  if (!isRecord(raw)) return failure("NOT_OBJECT", "$", true);

  const sourceVersion: 1 | 2 = raw.schemaVersion === undefined || raw.schemaVersion === 1 ? 1 : 2;
  if (sourceVersion === 2 && raw.schemaVersion !== BASEBALL_ROOM_SCHEMA_VERSION) {
    return failure("UNSUPPORTED_VERSION", "$.schemaVersion", false);
  }
  if (!isNonEmptyString(raw.id) || !raw.id.startsWith("baseball-")) {
    return failure("INVALID_FIELD", "$.id");
  }
  if (expectedRowId !== undefined && raw.id !== expectedRowId) {
    return failure("ROW_ID_MISMATCH", "$.id", false);
  }
  if (sourceVersion === 2 && (!Number.isSafeInteger(raw.revision) || (raw.revision as number) < 0)) {
    return failure("INVALID_REVISION", "$.revision");
  }
  if (!isNonEmptyString(raw.title)) return failure("INVALID_FIELD", "$.title");
  if (typeof raw.description !== "string") return failure("INVALID_FIELD", "$.description");
  if (!isSafePositiveInteger(raw.hostStudentId)) return failure("INVALID_FIELD", "$.hostStudentId");
  if (raw.maxPlayers !== 2) return failure("INVALID_FIELD", "$.maxPlayers");
  if (typeof raw.isPublic !== "boolean") return failure("INVALID_FIELD", "$.isPublic");
  if (!isRoomStatus(raw.status)) return failure("INVALID_FIELD", "$.status");
  if (!isIsoTimestamp(raw.createdAt)) return failure("INVALID_FIELD", "$.createdAt");
  if (!Array.isArray(raw.players) || raw.players.length < 1 || raw.players.length > 2) {
    return failure("INVALID_FIELD", "$.players");
  }

  const rawSeats = sourceVersion === 2
    ? raw.players.map((player) => isRecord(player) ? player.seat : undefined)
    : raw.players.map((_, index) => index);
  if (rawSeats.some((seat) => seat !== 0 && seat !== 1)
    || new Set(rawSeats).size !== rawSeats.length
    || (raw.players.length === 2 && !(rawSeats.includes(0) && rawSeats.includes(1)))) {
    return failure("INVALID_INVARIANT", "$.players[].seat");
  }

  const players: BaseballRoomPlayer[] = [];
  for (const [index, rawPlayer] of raw.players.entries()) {
    const player = normalizePlayer(
      rawPlayer,
      sourceVersion,
      rawSeats[index] as RoomSeat,
      raw.hostStudentId,
      `$.players[${index}]`,
    );
    if ("ok" in player) return player;
    players.push(player);
  }

  if (new Set(players.map((player) => player.studentId)).size !== players.length) {
    return failure("INVALID_INVARIANT", "$.players[].studentId");
  }
  if (new Set(players.map((player) => player.authId)).size !== players.length) {
    return failure("INVALID_INVARIANT", "$.players[].authId");
  }
  if (players.filter((player) => player.isHost).length !== 1) {
    return failure("INVALID_INVARIANT", "$.hostStudentId");
  }

  if (!Array.isArray(raw.activityLogs)) return failure("INVALID_FIELD", "$.activityLogs");
  const activityLogs: BaseballRoomActivity[] = [];
  let repairedActivityRoomId = false;
  for (const [index, rawActivity] of raw.activityLogs.entries()) {
    const normalized = normalizeActivity(rawActivity, raw.id, sourceVersion, index);
    if ("ok" in normalized) return normalized;
    activityLogs.push(normalized.activity);
    repairedActivityRoomId ||= normalized.repairedRoomId;
  }
  if (new Set(activityLogs.map((activity) => activity.id)).size !== activityLogs.length) {
    return failure("INVALID_INVARIANT", "$.activityLogs[].id");
  }

  const matchIdPresent = raw.matchId !== undefined;
  const gameStatePresent = raw.gameState !== undefined;
  if (matchIdPresent !== gameStatePresent) return failure("INVALID_ACTIVE_MATCH", "$.gameState");
  if (matchIdPresent && !isNonEmptyString(raw.matchId)) {
    return failure("INVALID_FIELD", "$.matchId");
  }

  let gameState: BaseballRoom["gameState"];
  let migratedGameState = false;
  if (gameStatePresent) {
    const normalizedGame = normalizeBaseballGameState(raw.gameState);
    if (!normalizedGame.ok) return failure("INVALID_ACTIVE_MATCH", `$.gameState${normalizedGame.path.slice(1)}`);
    if (sourceVersion === 2 && normalizedGame.sourceVersion !== 2) {
      return failure("INVALID_ACTIVE_MATCH", "$.gameState.version");
    }
    gameState = normalizedGame.value;
    migratedGameState = normalizedGame.migrated;
    if (raw.status === "playing" && gameState.status !== "playing") {
      return failure("INVALID_ACTIVE_MATCH", "$.gameState.status");
    }
    if (raw.status === "finished" && gameState.status !== "finished") {
      return failure("INVALID_ACTIVE_MATCH", "$.gameState.status");
    }
  }


  const presentationGate = normalizePresentationGate(raw.presentationGate, gameState, raw.status);
  if (presentationGate && "ok" in presentationGate) return presentationGate;

  const hasMatch = matchIdPresent && gameStatePresent;
  const statusFailure = validateRoomStatus(raw.status, players, hasMatch);
  if (statusFailure) return statusFailure;

  const startedAtRequired = raw.status === "playing" || raw.status === "finished";
  const finishedAtRequired = raw.status === "finished" || raw.status === "cancelled";
  if ((raw.startedAt !== undefined && !isIsoTimestamp(raw.startedAt))
    || (startedAtRequired && !isIsoTimestamp(raw.startedAt))) {
    return failure("INVALID_FIELD", "$.startedAt");
  }
  if ((raw.finishedAt !== undefined && !isIsoTimestamp(raw.finishedAt))
    || (finishedAtRequired && !isIsoTimestamp(raw.finishedAt))) {
    return failure("INVALID_FIELD", "$.finishedAt");
  }

  const repairs = sourceVersion === 1
    ? [
        "schemaVersion",
        "revision",
        "playerSeats",
        ...(repairedActivityRoomId ? ["activityLogRoomId"] : []),
        ...(migratedGameState ? ["gameState"] : []),
      ]
    : [];

  const room: BaseballRoom = {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: sourceVersion === 1 ? 0 : raw.revision as number,
    id: raw.id,
    title: raw.title,
    description: raw.description,
    hostStudentId: raw.hostStudentId,
    maxPlayers: 2,
    isPublic: raw.isPublic,
    status: raw.status,
    players,
    activityLogs,
    createdAt: raw.createdAt,
    ...(raw.startedAt === undefined ? {} : { startedAt: raw.startedAt }),
    ...(raw.finishedAt === undefined ? {} : { finishedAt: raw.finishedAt }),
    ...(raw.matchId === undefined ? {} : { matchId: raw.matchId }),
    ...(gameState === undefined ? {} : { gameState }),
    ...(presentationGate === undefined ? {} : { presentationGate }),
  };

  return {
    ok: true,
    value: room,
    sourceVersion,
    migrated: sourceVersion === 1,
    needsPersistence: sourceVersion === 1,
    repairs,
  };
}
