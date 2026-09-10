import { createClient } from "@supabase/supabase-js";

import { authenticateBaseballMember } from "./_lib/baseballAuth.ts";
import {
  applyAuthorizedBaseballCommand,
  authorizeBaseballCommand,
  buildBaseballCommandRpcArguments,
  parseBaseballCommandRequestBody,
} from "./_lib/baseballCommandHandler.ts";
import { normalizeBaseballRoom } from "../src/utils/games/baseball/normalizeRoom.ts";
import type { BaseballRoom } from "../src/types/baseballRoom.ts";

interface BaseballRoomRow {
  id: string;
  room_data: unknown;
}

interface BaseballCommitRpcRow {
  outcome: string;
  room_data: unknown;
  room_revision: number | string | null;
  game_revision: number | string | null;
  committed_command_sequence: number | string | null;
  committed_command_id: string | null;
}

function jsonError(
  code: string,
  status: number,
  room?: BaseballRoom,
) {
  return Response.json(
    { ok: false, code, ...(room ? { room } : {}) },
    { status },
  );
}

function firstRpcRow(value: unknown): BaseballCommitRpcRow | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || typeof candidate !== "object") return null;
  const row = candidate as Partial<BaseballCommitRpcRow>;
  if (typeof row.outcome !== "string") return null;
  return row as BaseballCommitRpcRow;
}

/**
 * A canonical room is synchronization data, not authentication error detail.
 * It is returned only to a verified current member and never on 401/403.
 */
export function mayExposeBaseballCommandState(
  room: BaseballRoom,
  identity: { authId: string; studentId: number },
  status: number,
) {
  if (status === 401 || status === 403) return false;
  return room.players.some((player) => (
    player.authId === identity.authId && player.studentId === identity.studentId
  ));
}

export async function handleBaseballCommandRequest(request: Request) {
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
  const authentication = await authenticateBaseballMember(serviceClient, request);
  if (!authentication.ok) {
    return jsonError(authentication.code, authentication.status);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError("INVALID_JSON", 400);
  }
  const envelope = parseBaseballCommandRequestBody(rawBody);
  if (!envelope) return jsonError("INVALID_COMMAND_ENVELOPE", 400);

  const { data: stored, error: loadError } = await serviceClient
    .from("bang_rooms")
    .select("id, room_data")
    .eq("id", envelope.roomId)
    .maybeSingle();
  if (loadError) return jsonError("ROOM_LOAD_FAILED", 500);
  if (!stored) return jsonError("ROOM_NOT_FOUND", 404);

  const normalized = normalizeBaseballRoom(
    (stored as BaseballRoomRow).room_data,
    (stored as BaseballRoomRow).id,
  );
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
      mayExposeBaseballCommandState(normalized.value, authentication.identity, 426)
        ? normalized.value
        : undefined,
    );
  }

  const room = normalized.value;
  const occurredAt = new Date().toISOString();
  const authorization = authorizeBaseballCommand(
    room,
    envelope,
    authentication.identity,
    occurredAt,
  );
  let nextRoom = room;
  if (!authorization.ok) {
    if (authorization.code !== "STALE_REVISION") {
      return jsonError(
        authorization.code,
        authorization.status,
        mayExposeBaseballCommandState(
          room,
          authentication.identity,
          authorization.status,
        )
          ? room
          : undefined,
      );
    }
    // The RPC checks its command log before CAS. Passing the current room here
    // lets an exact stale retry succeed without trusting or replaying the client.
  } else {
    const applied = applyAuthorizedBaseballCommand(
      room,
      envelope,
      occurredAt,
    );
    if (!applied.ok) {
      return jsonError(
        applied.code,
        applied.status,
        mayExposeBaseballCommandState(room, authentication.identity, applied.status)
          ? room
          : undefined,
      );
    }
    nextRoom = applied.room;
  }

  const { data: commitData, error: commitError } = await serviceClient.rpc(
    "commit_baseball_command",
    buildBaseballCommandRpcArguments(
      envelope,
      authentication.identity,
      nextRoom,
    ),
  );
  if (commitError) return jsonError("COMMAND_COMMIT_FAILED", 500);

  const commit = firstRpcRow(commitData);
  if (!commit) return jsonError("INVALID_COMMAND_COMMIT_RESULT", 502);
  if (commit.outcome === "ACTOR_NOT_ACTIVE") {
    return jsonError("MEMBER_FORBIDDEN", 403);
  }
  if (commit.outcome === "ROOM_NOT_FOUND") return jsonError("ROOM_NOT_FOUND", 404);

  const committedRoom = normalizeBaseballRoom(commit.room_data, envelope.roomId);
  if (!committedRoom.ok || committedRoom.sourceVersion !== 2) {
    return jsonError("INVALID_CANONICAL_ROOM", 502);
  }

  if (commit.outcome === "COMMITTED" || commit.outcome === "IDEMPOTENT") {
    return Response.json({
      ok: true,
      idempotent: commit.outcome === "IDEMPOTENT",
      commandId: envelope.commandId,
      commandSequence: envelope.commandSequence,
      room: committedRoom.value,
    });
  }

  const conflicts: Record<string, string> = {
    STALE: "STALE_REVISION",
    COMMAND_CONFLICT: "COMMAND_ID_CONFLICT",
    SEQUENCE_CONFLICT: "COMMAND_SEQUENCE_CONFLICT",
    CONTEXT_MISMATCH: "ROOM_CONTEXT_MISMATCH",
    PRESENTATION_PENDING: "PRESENTATION_PENDING",
  };
  return jsonError(
    conflicts[commit.outcome] ?? "COMMAND_REJECTED",
    409,
    mayExposeBaseballCommandState(committedRoom.value, authentication.identity, 409)
      ? committedRoom.value
      : undefined,
  );
}

export default { fetch: handleBaseballCommandRequest };
