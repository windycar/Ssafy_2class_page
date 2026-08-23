import type { BaseballRoom } from "../types/baseballRoom.ts";
import {
  parseBaseballMatchCommandEnvelope,
  type BaseballMatchCommandEnvelope,
} from "../utils/games/baseball/onlineProtocol.ts";
import { normalizeBaseballRoom } from "../utils/games/baseball/normalizeRoom.ts";

export interface BaseballCommandClientDependencies {
  getAccessToken: () => Promise<string | null>;
  fetch: typeof globalThis.fetch;
}

export interface BaseballCommandSuccess {
  ok: true;
  status: 200;
  idempotent: boolean;
  commandId: string;
  commandSequence: number;
  room: BaseballRoom;
}

export type BaseballCommandFailure =
  | {
      ok: false;
      status: 0;
      code: "NETWORK_ERROR";
    }
  | {
      ok: false;
      status: 400;
      code: "INVALID_COMMAND_ENVELOPE";
    }
  | {
      ok: false;
      status: 401;
      code: string;
    }
  | {
      ok: false;
      status: 403;
      code: string;
      room?: BaseballRoom;
    }
  | {
      ok: false;
      status: 409;
      code: string;
      room: BaseballRoom;
    }
  | {
      ok: false;
      status: 400 | 404 | 405 | 426 | 500 | 502 | 503;
      code: string;
      room?: BaseballRoom;
    };

export type BaseballCommandClientResult = BaseballCommandSuccess | BaseballCommandFailure;

interface CryptoLike {
  randomUUID?: () => string;
  getRandomValues?: <T extends ArrayBufferView | null>(array: T) => T;
}

let fallbackIdSequence = 0;

function sanitizeIdPrefix(prefix: string) {
  const cleaned = prefix.replace(/[^A-Za-z0-9._:-]/g, "-").slice(0, 48);
  return cleaned || "baseball";
}

function bytesToUuid(bytes: Uint8Array) {
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

/** Generates client-only IDs without an insecure pseudo-random fallback. */
export function createBaseballClientId(
  prefix = "baseball-client",
  cryptoSource: CryptoLike | undefined = globalThis.crypto,
) {
  const safePrefix = sanitizeIdPrefix(prefix);
  if (typeof cryptoSource?.randomUUID === "function") {
    return `${safePrefix}-${cryptoSource.randomUUID()}`;
  }
  if (typeof cryptoSource?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    cryptoSource.getRandomValues(bytes);
    return `${safePrefix}-${bytesToUuid(bytes)}`;
  }

  // This path is only for runtimes without Web Crypto. The monotonic suffix is
  // process-local and is never used as an authorization or idempotency secret.
  fallbackIdSequence = (fallbackIdSequence + 1) % Number.MAX_SAFE_INTEGER;
  return `${safePrefix}-${Date.now().toString(36)}-${fallbackIdSequence.toString(36)}`;
}

function canonicalCommandEnvelope(
  envelope: BaseballMatchCommandEnvelope,
): BaseballMatchCommandEnvelope {
  const base = {
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
  };
  if (envelope.kind === "START_PITCH") {
    return {
      ...base,
      kind: "START_PITCH",
      command: {
        commandId: envelope.command.commandId,
        expectedRevision: envelope.command.expectedRevision,
        playId: envelope.command.playId,
        sequence: envelope.command.sequence,
        pitcherId: envelope.command.pitcherId,
        pitchType: envelope.command.pitchType,
        target: { ...envelope.command.target },
        timingQuality: envelope.command.timingQuality,
      },
    };
  }

  return {
    ...base,
    kind: "BATTER_ACTION",
    command: {
      commandId: envelope.command.commandId,
      expectedRevision: envelope.command.expectedRevision,
      playId: envelope.command.playId,
      batterId: envelope.command.batterId,
      action: envelope.command.action.kind === "TAKE"
        ? {
            kind: "TAKE",
            batterId: envelope.command.action.batterId,
          }
        : {
            kind: "SWING",
            swing: {
              batterId: envelope.command.action.swing.batterId,
              swingType: envelope.command.action.swing.swingType,
              aim: { ...envelope.command.action.swing.aim },
              progress: envelope.command.action.swing.progress,
            },
          },
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseCode(body: Record<string, unknown>, fallback: string) {
  return typeof body.code === "string" && body.code.length > 0 ? body.code : fallback;
}

function normalizeResponseRoom(
  rawRoom: unknown,
  envelope: BaseballMatchCommandEnvelope,
): BaseballRoom | null {
  const normalized = normalizeBaseballRoom(rawRoom, envelope.roomId);
  if (!normalized.ok || normalized.sourceVersion !== 2) return null;
  if (
    normalized.value.matchId !== envelope.matchId
    || normalized.value.gameState?.seed !== envelope.seed
  ) return null;
  return normalized.value;
}

async function currentSupabaseAccessToken() {
  const { supabase } = await import("../lib/supabase.ts");
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token ?? null;
}

const defaultDependencies: BaseballCommandClientDependencies = {
  getAccessToken: currentSupabaseAccessToken,
  fetch: (...args) => globalThis.fetch(...args),
};

/**
 * Sends only a validated command envelope. The browser identity is represented
 * solely by the current Supabase access token and is re-verified by the API.
 */
export async function sendBaseballCommand(
  rawEnvelope: BaseballMatchCommandEnvelope,
  dependencies: BaseballCommandClientDependencies = defaultDependencies,
): Promise<BaseballCommandClientResult> {
  const parsed = parseBaseballMatchCommandEnvelope(rawEnvelope);
  if (!parsed) {
    return { ok: false, status: 400, code: "INVALID_COMMAND_ENVELOPE" };
  }
  const envelope = canonicalCommandEnvelope(parsed);

  let accessToken: string | null;
  try {
    accessToken = await dependencies.getAccessToken();
  } catch {
    return { ok: false, status: 401, code: "AUTH_SESSION_FAILED" };
  }
  if (!accessToken) return { ok: false, status: 401, code: "AUTH_REQUIRED" };

  let response: Response;
  try {
    response = await dependencies.fetch("/api/baseball-command", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(envelope),
    });
  } catch {
    return { ok: false, status: 0, code: "NETWORK_ERROR" };
  }

  let rawBody: unknown;
  try {
    rawBody = await response.json();
  } catch {
    return { ok: false, status: 502, code: "INVALID_SERVER_RESPONSE" };
  }
  if (!isRecord(rawBody)) {
    return { ok: false, status: 502, code: "INVALID_SERVER_RESPONSE" };
  }

  if (response.status === 200 && rawBody.ok === true) {
    const room = normalizeResponseRoom(rawBody.room, envelope);
    if (!room) return { ok: false, status: 502, code: "INVALID_CANONICAL_ROOM" };
    if (
      rawBody.commandId !== envelope.commandId
      || rawBody.commandSequence !== envelope.commandSequence
      || typeof rawBody.idempotent !== "boolean"
      || room.revision < envelope.baseRoomRevision + 1
      || (room.gameState?.revision ?? -1) < envelope.baseGameRevision + 1
    ) {
      return { ok: false, status: 502, code: "COMMAND_RESPONSE_MISMATCH" };
    }
    return {
      ok: true,
      status: 200,
      idempotent: rawBody.idempotent,
      commandId: envelope.commandId,
      commandSequence: envelope.commandSequence,
      room,
    };
  }

  const code = responseCode(rawBody, `HTTP_${response.status}`);
  if (response.status === 401) return { ok: false, status: 401, code };
  if (response.status === 403) {
    const room = Object.hasOwn(rawBody, "room")
      ? normalizeResponseRoom(rawBody.room, envelope) ?? undefined
      : undefined;
    return { ok: false, status: 403, code, ...(room ? { room } : {}) };
  }
  if (response.status === 409) {
    const room = normalizeResponseRoom(rawBody.room, envelope);
    return room
      ? { ok: false, status: 409, code, room }
      : { ok: false, status: 502, code: "INVALID_CANONICAL_ROOM" };
  }

  const supportedStatus = (
    response.status === 400
    || response.status === 404
    || response.status === 405
    || response.status === 426
    || response.status === 500
    || response.status === 502
    || response.status === 503
  ) ? response.status : 502;
  const room = Object.hasOwn(rawBody, "room")
    ? normalizeResponseRoom(rawBody.room, envelope) ?? undefined
    : undefined;
  return {
    ok: false,
    status: supportedStatus,
    code: supportedStatus === response.status ? code : "UNSUPPORTED_SERVER_STATUS",
    ...(room ? { room } : {}),
  };
}

export const baseballCommandClient = {
  send: sendBaseballCommand,
  createId: createBaseballClientId,
};
