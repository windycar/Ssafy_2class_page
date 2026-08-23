import { isBaseballPitchType } from "../../../data/games/baseball/pitches.ts";
import type { BatterActionCommand, StartPitchCommand } from "./playEngine.ts";
import type { TeamIndex } from "./types.ts";

export const BASEBALL_ONLINE_PROTOCOL_VERSION = 2 as const;

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export type BaseballMatchCommandKind = "START_PITCH" | "BATTER_ACTION";
export type BaseballBatterActionIntent = Omit<BatterActionCommand, "occurredAt">;

export type BaseballMatchCommandEnvelope = {
  schemaVersion: typeof BASEBALL_ONLINE_PROTOCOL_VERSION;
  roomId: string;
  matchId: string;
  commandId: string;
  commandSequence: number;
  baseRoomRevision: number;
  baseGameRevision: number;
  actorSeat: TeamIndex;
  seed: number;
  playId: string;
} & (
  | { kind: "START_PITCH"; command: StartPitchCommand }
  | { kind: "BATTER_ACTION"; command: BaseballBatterActionIntent }
);

export interface BaseballMatchCommittedNotice {
  schemaVersion: typeof BASEBALL_ONLINE_PROTOCOL_VERSION;
  roomId: string;
  matchId: string;
  commandId: string;
  commandSequence: number;
  baseRoomRevision: number;
  committedRoomRevision: number;
  committedGameRevision: number;
  actorSeat: TeamIndex;
  seed: number;
  playId: string;
  kind: BaseballMatchCommandKind;
}

export type NoticeDecision =
  | "APPLY"
  | "REFETCH_GAP"
  | "IGNORE_DUPLICATE"
  | "IGNORE_STALE"
  | "REJECT_CONTEXT"
  | "REJECT_INVALID";

export interface NoticeCursor {
  roomId: string;
  matchId: string;
  seed: number;
  lastCommandSequence: number;
  lastRoomRevision: number;
  seenCommandIds: ReadonlySet<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 0xffff_ffff;
}

function isSeat(value: unknown): value is TeamIndex {
  return value === 0 || value === 1;
}

function isPoint(value: unknown): boolean {
  return isRecord(value)
    && typeof value.x === "number"
    && Number.isFinite(value.x)
    && typeof value.y === "number"
    && Number.isFinite(value.y);
}

function isStartPitchIntent(
  command: Record<string, unknown>,
  envelope: Record<string, unknown>,
): boolean {
  return command.commandId === envelope.commandId
    && command.expectedRevision === envelope.baseGameRevision
    && command.playId === envelope.playId
    && isPositiveInteger(command.sequence)
    && isId(command.pitcherId)
    && isBaseballPitchType(command.pitchType)
    && isPoint(command.target)
    && (
      command.timingQuality === "PERFECT"
      || command.timingQuality === "GOOD"
      || command.timingQuality === "NORMAL"
      || command.timingQuality === "MISS"
    );
}

function isBatterActionIntent(
  command: Record<string, unknown>,
  envelope: Record<string, unknown>,
): boolean {
  if (Object.hasOwn(command, "occurredAt")
    || command.commandId !== envelope.commandId
    || command.expectedRevision !== envelope.baseGameRevision
    || command.playId !== envelope.playId
    || !isId(command.batterId)
    || !isRecord(command.action)) return false;
  const action = command.action;
  if (action.kind === "TAKE") return action.batterId === command.batterId;
  if (action.kind !== "SWING" || !isRecord(action.swing)) return false;
  return action.swing.batterId === command.batterId
    && (
      action.swing.swingType === "CONTACT"
      || action.swing.swingType === "NORMAL"
      || action.swing.swingType === "POWER"
    )
    && isPoint(action.swing.aim)
    && typeof action.swing.progress === "number"
    && Number.isFinite(action.swing.progress)
    && action.swing.progress >= 0
    && action.swing.progress <= 1.25;
}

export function parseBaseballMatchCommandEnvelope(
  value: unknown,
): BaseballMatchCommandEnvelope | null {
  if (!isRecord(value)
    || value.schemaVersion !== BASEBALL_ONLINE_PROTOCOL_VERSION
    || !isId(value.roomId)
    || !isId(value.matchId)
    || !isId(value.commandId)
    || !isPositiveInteger(value.commandSequence)
    || !isNonNegativeInteger(value.baseRoomRevision)
    || !isNonNegativeInteger(value.baseGameRevision)
    || !isSeat(value.actorSeat)
    || !isUint32(value.seed)
    || !isId(value.playId)
    || !isRecord(value.command)) return null;
  if (value.kind === "START_PITCH" && isStartPitchIntent(value.command, value)) {
    return value as unknown as BaseballMatchCommandEnvelope;
  }
  if (value.kind === "BATTER_ACTION" && isBatterActionIntent(value.command, value)) {
    return value as unknown as BaseballMatchCommandEnvelope;
  }
  return null;
}

function hasNoticeShape(value: Record<string, unknown>): boolean {
  return value.schemaVersion === BASEBALL_ONLINE_PROTOCOL_VERSION
    && isId(value.roomId)
    && isId(value.matchId)
    && isId(value.commandId)
    && isPositiveInteger(value.commandSequence)
    && isNonNegativeInteger(value.baseRoomRevision)
    && isPositiveInteger(value.committedRoomRevision)
    && (value.committedRoomRevision as number) > (value.baseRoomRevision as number)
    && isPositiveInteger(value.committedGameRevision)
    && isSeat(value.actorSeat)
    && isUint32(value.seed)
    && isId(value.playId)
    && (value.kind === "START_PITCH" || value.kind === "BATTER_ACTION");
}

export function parseBaseballMatchCommittedNotice(
  value: unknown,
): BaseballMatchCommittedNotice | null {
  if (!isRecord(value) || !hasNoticeShape(value)) return null;
  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: value.roomId as string,
    matchId: value.matchId as string,
    commandId: value.commandId as string,
    commandSequence: value.commandSequence as number,
    baseRoomRevision: value.baseRoomRevision as number,
    committedRoomRevision: value.committedRoomRevision as number,
    committedGameRevision: value.committedGameRevision as number,
    actorSeat: value.actorSeat as TeamIndex,
    seed: value.seed as number,
    playId: value.playId as string,
    kind: value.kind as BaseballMatchCommandKind,
  };
}

/**
 * Realtime is only an invalidation signal. APPLY still means "refetch the room";
 * the notice itself never contains authoritative game state.
 */
export function decideBaseballMatchNotice(
  cursor: NoticeCursor,
  rawNotice: unknown,
): NoticeDecision {
  const notice = parseBaseballMatchCommittedNotice(rawNotice);
  if (!notice) return "REJECT_INVALID";
  if (
    notice.roomId !== cursor.roomId
    || notice.matchId !== cursor.matchId
    || notice.seed !== cursor.seed
  ) return "REJECT_CONTEXT";
  if (cursor.seenCommandIds.has(notice.commandId)) return "IGNORE_DUPLICATE";
  if (
    notice.commandSequence <= cursor.lastCommandSequence
    || notice.committedRoomRevision <= cursor.lastRoomRevision
  ) return "IGNORE_STALE";
  if (
    notice.commandSequence !== cursor.lastCommandSequence + 1
    || notice.baseRoomRevision !== cursor.lastRoomRevision
    || notice.committedRoomRevision !== notice.baseRoomRevision + 1
  ) return "REFETCH_GAP";
  return "APPLY";
}

export function createBaseballMatchCommittedNotice(
  envelope: BaseballMatchCommandEnvelope,
  committedRoomRevision: number,
  committedGameRevision: number,
): BaseballMatchCommittedNotice {
  if (!isPositiveInteger(committedRoomRevision)
    || committedRoomRevision !== envelope.baseRoomRevision + 1
    || !isPositiveInteger(committedGameRevision)) {
    throw new RangeError("Committed revisions must be positive and advance the room by exactly one.");
  }
  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: envelope.roomId,
    matchId: envelope.matchId,
    commandId: envelope.commandId,
    commandSequence: envelope.commandSequence,
    baseRoomRevision: envelope.baseRoomRevision,
    committedRoomRevision,
    committedGameRevision,
    actorSeat: envelope.actorSeat,
    seed: envelope.seed,
    playId: envelope.playId,
    kind: envelope.kind,
  };
}
