import type { BaseballRoom } from "../types/baseballRoom.ts";
import { normalizeBaseballRoom } from "../utils/games/baseball/normalizeRoom.ts";
import { createBaseballClientId } from "./baseballCommandClient.ts";

export const BASEBALL_ROOM_COMMAND_SCHEMA_VERSION = 1 as const;

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

export interface BaseballRoomCommandClientDependencies {
  getAccessToken: () => Promise<string | null>;
  fetch: typeof globalThis.fetch;
}

export interface BaseballRoomCommandSuccess {
  ok: true;
  status: number;
  idempotent: boolean;
  commandId: string;
  room?: BaseballRoom;
  deleted?: true;
}

export interface BaseballRoomCommandFailure {
  ok: false;
  status: number;
  code: string;
  room?: BaseballRoom;
}

export type BaseballRoomCommandResult =
  | BaseballRoomCommandSuccess
  | BaseballRoomCommandFailure;

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

/**
 * Rebuilds the request from an allow-list. Runtime-added identity or whole-room
 * fields are deliberately discarded before anything reaches the network.
 */
export function parseBaseballRoomCommandEnvelope(
  raw: BaseballRoomCommandEnvelope,
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
        title: raw.payload.title.trim(),
        description: raw.payload.description.trim(),
        isPublic: raw.payload.isPublic,
        sessionId: raw.payload.sessionId,
      },
    };
  }

  if (
    !validString(raw.roomId, 8, 128)
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

function normalizeResponseRoom(rawRoom: unknown, expectedRoomId?: string) {
  const normalized = normalizeBaseballRoom(rawRoom, expectedRoomId);
  if (!normalized.ok || normalized.sourceVersion !== 2) return null;
  return normalized.value;
}

function responseCode(body: Record<string, unknown>, fallback: string) {
  return typeof body.code === "string" && body.code.length > 0 ? body.code : fallback;
}

async function currentSupabaseAccessToken() {
  const { supabase } = await import("../lib/supabase.ts");
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token ?? null;
}

const defaultDependencies: BaseballRoomCommandClientDependencies = {
  getAccessToken: currentSupabaseAccessToken,
  fetch: (...args) => globalThis.fetch(...args),
};

export async function sendBaseballRoomCommand(
  rawEnvelope: BaseballRoomCommandEnvelope,
  dependencies: BaseballRoomCommandClientDependencies = defaultDependencies,
): Promise<BaseballRoomCommandResult> {
  const envelope = parseBaseballRoomCommandEnvelope(rawEnvelope);
  if (!envelope) {
    return { ok: false, status: 400, code: "INVALID_COMMAND_ENVELOPE" };
  }

  let accessToken: string | null;
  try {
    accessToken = await dependencies.getAccessToken();
  } catch {
    return { ok: false, status: 401, code: "AUTH_SESSION_FAILED" };
  }
  if (!accessToken) return { ok: false, status: 401, code: "AUTH_REQUIRED" };

  const requestInit: RequestInit = {
      method: "POST",
      keepalive: envelope.kind === "LEAVE",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(envelope),
  };
  let response: Response | null = null;
  for (let attempt = 0; attempt < 2 && response === null; attempt += 1) {
    try {
      response = await dependencies.fetch("/api/baseball-room-command", requestInit);
    } catch {
      if (attempt === 1) return { ok: false, status: 0, code: "NETWORK_ERROR" };
    }
  }
  if (!response) return { ok: false, status: 0, code: "NETWORK_ERROR" };

  let rawBody: unknown;
  try {
    rawBody = await response.json();
  } catch {
    return { ok: false, status: 502, code: "INVALID_SERVER_RESPONSE" };
  }
  if (!isRecord(rawBody)) {
    return { ok: false, status: 502, code: "INVALID_SERVER_RESPONSE" };
  }

  const expectedRoomId = envelope.kind === "CREATE" ? undefined : envelope.roomId;
  const room = Object.hasOwn(rawBody, "room")
    ? normalizeResponseRoom(rawBody.room, expectedRoomId) ?? undefined
    : undefined;

  if (response.ok && rawBody.ok === true) {
    if (
      rawBody.commandId !== envelope.commandId
      || typeof rawBody.idempotent !== "boolean"
      || (rawBody.deleted !== true && !room)
      || (rawBody.deleted === true && room)
      || (rawBody.deleted === true && envelope.kind !== "LEAVE")
      || (
        room
        && envelope.kind === "CREATE"
        && room.revision !== 0
        && rawBody.idempotent !== true
      )
      || (
        room
        && envelope.kind !== "CREATE"
        && room.revision < envelope.expectedRevision + 1
      )
    ) {
      return { ok: false, status: 502, code: "COMMAND_RESPONSE_MISMATCH" };
    }
    return {
      ok: true,
      status: response.status,
      idempotent: rawBody.idempotent,
      commandId: envelope.commandId,
      ...(room ? { room } : {}),
      ...(rawBody.deleted === true ? { deleted: true as const } : {}),
    };
  }

  const code = responseCode(rawBody, `HTTP_${response.status}`);
  if (response.status === 409 && !room) {
    return { ok: false, status: 502, code: "INVALID_CANONICAL_ROOM" };
  }
  return {
    ok: false,
    status: response.status,
    code,
    ...(room ? { room } : {}),
  };
}

export function createBaseballRoomCommandId(kind: BaseballRoomCommandKind) {
  return createBaseballClientId(`baseball-room-${kind.toLowerCase()}`);
}

let tabSessionId: string | null = null;
const BASEBALL_ROOM_TAB_SESSION_KEY = "ssafy-baseball-room-session:v1";

interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function resolveBaseballRoomSessionId(
  storage: SessionStorageLike | undefined,
  createId: () => string = () => createBaseballClientId("baseball-room-session"),
) {
  try {
    const stored = storage?.getItem(BASEBALL_ROOM_TAB_SESSION_KEY);
    if (validString(stored, 8, 128)) return stored;
  } catch {
    // Private browsing and hardened browser profiles may reject storage access.
  }

  const created = createId();
  try {
    storage?.setItem(BASEBALL_ROOM_TAB_SESSION_KEY, created);
  } catch {
    // The in-memory fallback below remains stable for this page lifetime.
  }
  return created;
}

/** A non-authoritative per-tab id that survives reload through sessionStorage. */
export function getBaseballRoomSessionId() {
  if (tabSessionId === null) {
    tabSessionId = resolveBaseballRoomSessionId(
      typeof sessionStorage === "undefined" ? undefined : sessionStorage,
    );
  }
  return tabSessionId;
}

export const baseballRoomCommandClient = {
  send: sendBaseballRoomCommand,
  createCommandId: createBaseballRoomCommandId,
  getSessionId: getBaseballRoomSessionId,
};
