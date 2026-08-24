import { createClient } from "@supabase/supabase-js";

import type { BaseballRoom } from "../src/types/baseballRoom.ts";
import { normalizeBaseballRoom } from "../src/utils/games/baseball/normalizeRoom.ts";
import { authenticateBaseballRoomMember } from "./_lib/baseballRoomAuth.ts";
import {
  applyBaseballRoomCommand,
  buildBaseballRoomCommandRpcArguments,
  parseBaseballRoomCommandRequestBody,
  type BaseballRoomCommandKind,
  type BaseballRoomCommandServerContext,
} from "./_lib/baseballRoomCommandHandler.ts";

interface BaseballRoomRow {
  id: string;
  room_data: unknown;
}

interface BaseballRoomCommandRpcRow {
  outcome: string;
  room_data: unknown;
  deleted: boolean;
  room_revision: number | string | null;
  committed_command_id: string | null;
}

function jsonError(code: string, status: number, room?: BaseballRoom) {
  return Response.json(
    { ok: false, code, ...(room ? { room } : {}) },
    { status },
  );
}

function firstRpcRow(value: unknown): BaseballRoomCommandRpcRow | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || typeof candidate !== "object") return null;
  const row = candidate as Partial<BaseballRoomCommandRpcRow>;
  if (typeof row.outcome !== "string" || typeof row.deleted !== "boolean") return null;
  return row as BaseballRoomCommandRpcRow;
}

function serverId(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

function serverSeed() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0];
}

export function normalizeBaseballRoomCommandCommit(
  raw: unknown,
  expectedRoomId?: string,
) {
  const normalized = normalizeBaseballRoom(raw, expectedRoomId);
  if (!normalized.ok || normalized.sourceVersion !== 2 || normalized.needsPersistence) {
    return null;
  }
  return normalized.value;
}

/**
 * Private rooms are capability-addressed for CREATE/JOIN. Every other error may
 * include canonical room data only when the verified actor is still a member.
 * In particular, a forged stale command must not turn the service-role endpoint
 * into a private-room read oracle.
 */
export function mayExposeBaseballRoomCommandState(
  room: BaseballRoom,
  kind: BaseballRoomCommandKind,
  identity: { authId: string; studentId: number },
) {
  return kind === "CREATE"
    || kind === "JOIN"
    || room.players.some((player) => (
      player.authId === identity.authId && player.studentId === identity.studentId
    ));
}

export async function handleBaseballRoomCommandRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return jsonError("SERVER_CONFIGURATION_MISSING", 500);
  }

  const serviceClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const authentication = await authenticateBaseballRoomMember(serviceClient, request);
  if (!authentication.ok) {
    return jsonError(authentication.code, authentication.status);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError("INVALID_JSON", 400);
  }
  const envelope = parseBaseballRoomCommandRequestBody(rawBody);
  if (!envelope) return jsonError("INVALID_COMMAND_ENVELOPE", 400);

  const roomId = envelope.kind === "CREATE"
    ? serverId("baseball")
    : envelope.roomId;
  const context: BaseballRoomCommandServerContext = {
    now: new Date().toISOString(),
    roomId,
    activityId: serverId("baseball-log"),
    matchId: serverId("baseball-match"),
    seed: serverSeed(),
  };

  let currentRoom: BaseballRoom | null = null;
  if (envelope.kind !== "CREATE") {
    const { data: stored, error: loadError } = await serviceClient
      .from("bang_rooms")
      .select("id, room_data")
      .eq("id", envelope.roomId)
      .maybeSingle();
    if (loadError) return jsonError("ROOM_LOAD_FAILED", 500);
    if (stored) {
      const row = stored as BaseballRoomRow;
      const normalized = normalizeBaseballRoom(row.room_data, row.id);
      if (!normalized.ok) {
        return jsonError(
          normalized.code,
          normalized.recoverable ? 409 : 426,
        );
      }
      if (normalized.sourceVersion !== 2 || normalized.needsPersistence) {
        return jsonError(
          "ROOM_SCHEMA_UPGRADE_REQUIRED",
          426,
          mayExposeBaseballRoomCommandState(
            normalized.value,
            envelope.kind,
            authentication.identity,
          )
            ? normalized.value
            : undefined,
        );
      }
      currentRoom = normalized.value;
    }
  }

  const applied = applyBaseballRoomCommand(
    currentRoom,
    envelope,
    authentication.identity,
    context,
  );
  if (!applied.ok && applied.code !== "STALE_REVISION" && currentRoom) {
    return jsonError(
      applied.code,
      applied.status,
      mayExposeBaseballRoomCommandState(
        currentRoom,
        envelope.kind,
        authentication.identity,
      )
        ? currentRoom
        : undefined,
    );
  }

  const nextRoom = applied.ok ? applied.room : null;
  const deleted = applied.ok && applied.deleted;
  const { data: commitData, error: commitError } = await serviceClient.rpc(
    "commit_baseball_room_command",
    buildBaseballRoomCommandRpcArguments(
      envelope,
      authentication.identity,
      context,
      nextRoom,
      deleted,
    ),
  );
  if (commitError) return jsonError("ROOM_COMMAND_COMMIT_FAILED", 500);

  const commit = firstRpcRow(commitData);
  if (!commit) return jsonError("INVALID_ROOM_COMMAND_COMMIT_RESULT", 502);
  if (commit.outcome === "ACTOR_NOT_ACTIVE") {
    return jsonError("MEMBER_FORBIDDEN", 403);
  }

  let committedRoom: BaseballRoom | undefined;
  if (!commit.deleted && commit.room_data !== null) {
    // CREATE retries generate a fresh candidate id in this request, while the
    // idempotency log returns the original server-created room. In that case the
    // canonical payload itself supplies the strictly validated baseball-* id.
    committedRoom = normalizeBaseballRoomCommandCommit(
      commit.room_data,
      envelope.kind === "CREATE" ? undefined : roomId,
    ) ?? undefined;
    if (!committedRoom) return jsonError("INVALID_CANONICAL_ROOM", 502);
  }

  if (commit.outcome === "COMMITTED" || commit.outcome === "IDEMPOTENT") {
    if (commit.deleted === !committedRoom) {
      return Response.json({
        ok: true,
        idempotent: commit.outcome === "IDEMPOTENT",
        commandId: envelope.commandId,
        ...(commit.deleted ? { deleted: true } : { room: committedRoom }),
      });
    }
    return jsonError("INVALID_ROOM_COMMAND_COMMIT_RESULT", 502);
  }

  if (commit.outcome === "IDEMPOTENT_GONE") {
    return jsonError("ROOM_GONE", 410);
  }
  if (commit.outcome === "ROOM_NOT_FOUND") return jsonError("ROOM_NOT_FOUND", 404);
  const conflicts: Record<string, string> = {
    STALE: "STALE_REVISION",
    COMMAND_CONFLICT: "COMMAND_ID_CONFLICT",
    CONTEXT_MISMATCH: "ROOM_CONTEXT_MISMATCH",
    ACTIVE_PLAYERS_REQUIRED: "ACTIVE_PLAYERS_REQUIRED",
    PLAYERS_NOT_READY: "PLAYERS_NOT_READY",
    PLAYERS_NOT_CONNECTED: "PLAYERS_NOT_CONNECTED",
  };
  const canonicalErrorRoom = committedRoom ?? currentRoom ?? undefined;
  const exposedErrorRoom = canonicalErrorRoom
    && mayExposeBaseballRoomCommandState(
      canonicalErrorRoom,
      envelope.kind,
      authentication.identity,
    )
    ? canonicalErrorRoom
    : undefined;
  return jsonError(
    conflicts[commit.outcome] ?? "ROOM_COMMAND_REJECTED",
    409,
    exposedErrorRoom,
  );
}

export default { fetch: handleBaseballRoomCommandRequest };
