import { useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

import { createBaseballClientId } from "../services/baseballCommandClient.ts";
import type { TeamIndex } from "../utils/games/baseball/types.ts";
import { authenticateBaseballRealtime } from "./baseballRealtimeAuth.ts";

const PRESENCE_SCHEMA_VERSION = 1 as const;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const FORBIDDEN_STATE_KEYS = new Set([
  "room",
  "roomState",
  "game",
  "gameState",
  "state",
  "room_data",
  "studentId",
  "sessionId",
]);
const PRESENCE_META_KEYS = new Set([
  "schemaVersion",
  "roomId",
  "matchId",
  "authId",
  "seat",
  "connectionId",
  "presence_ref",
]);

export type BaseballOnlinePresenceStatus =
  | "DISABLED"
  | "CONNECTING"
  | "SUBSCRIBED"
  | "AUTH_ERROR"
  | "CHANNEL_ERROR"
  | "TIMED_OUT"
  | "CLOSED";

export interface BaseballOnlinePresenceParticipant {
  authId: string;
  seat: TeamIndex;
}

export interface BaseballOnlinePresenceContext {
  roomId: string;
  matchId: string;
  participants: readonly BaseballOnlinePresenceParticipant[];
}

export interface BaseballOnlinePresenceMeta {
  schemaVersion: typeof PRESENCE_SCHEMA_VERSION;
  roomId: string;
  matchId: string;
  authId: string;
  seat: TeamIndex;
  connectionId: string;
}

export interface UseBaseballOnlinePresenceOptions extends BaseballOnlinePresenceContext {
  currentAuthId: string;
  enabled?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function isSeat(value: unknown): value is TeamIndex {
  return value === 0 || value === 1;
}

function participantKey(participants: readonly BaseballOnlinePresenceParticipant[]) {
  return [...participants]
    .sort((left, right) => left.seat - right.seat)
    .map((participant) => `${participant.seat}:${participant.authId}`)
    .join("|");
}

function topicFor(roomId: string, matchId: string) {
  return `baseball-game-presence:${roomId}:${matchId}`;
}

export function parseBaseballOnlinePresenceMeta(
  raw: unknown,
  context: BaseballOnlinePresenceContext,
): BaseballOnlinePresenceMeta | null {
  if (!isRecord(raw)) return null;
  if (Object.keys(raw).some((key) => (
    FORBIDDEN_STATE_KEYS.has(key) || !PRESENCE_META_KEYS.has(key)
  ))) return null;
  if (
    raw.schemaVersion !== PRESENCE_SCHEMA_VERSION
    || raw.roomId !== context.roomId
    || raw.matchId !== context.matchId
    || !isId(raw.authId)
    || !isSeat(raw.seat)
    || !isId(raw.connectionId)
  ) return null;
  const participant = context.participants.find((candidate) => (
    candidate.authId === raw.authId && candidate.seat === raw.seat
  ));
  if (!participant) return null;
  return {
    schemaVersion: PRESENCE_SCHEMA_VERSION,
    roomId: context.roomId,
    matchId: context.matchId,
    authId: raw.authId,
    seat: raw.seat,
    connectionId: raw.connectionId,
  };
}

/**
 * Reduces client-claimed Presence metadata to configured room members.
 * This is an advisory liveness signal only: Presence metadata and keys are
 * client supplied and must never authorize a gameplay command or seat.
 */
export function connectedBaseballOnlineAuthIds(
  rawState: unknown,
  context: BaseballOnlinePresenceContext,
): ReadonlySet<string> {
  const connected = new Set<string>();
  if (!isRecord(rawState)) return connected;

  for (const [presenceKey, rawMetas] of Object.entries(rawState)) {
    if (!Array.isArray(rawMetas)) continue;
    for (const rawMeta of rawMetas) {
      const meta = parseBaseballOnlinePresenceMeta(rawMeta, context);
      if (meta && presenceKey === meta.authId) connected.add(meta.authId);
    }
  }
  return connected;
}

export function hasAllBaseballOnlineParticipants(
  connectedAuthIds: ReadonlySet<string>,
  participants: readonly BaseballOnlinePresenceParticipant[],
) {
  return participants.length === 2
    && new Set(participants.map((participant) => participant.authId)).size === 2
    && participants.every((participant) => connectedAuthIds.has(participant.authId));
}

export function useBaseballOnlinePresence({
  roomId,
  matchId,
  participants,
  currentAuthId,
  enabled = true,
}: UseBaseballOnlinePresenceOptions) {
  const [status, setStatus] = useState<BaseballOnlinePresenceStatus>("DISABLED");
  const [connectedAuthIds, setConnectedAuthIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const channelRef = useRef<RealtimeChannel | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const participantsRef = useRef(participants);
  participantsRef.current = participants;
  const participantsSignature = participantKey(participants);
  const currentSeat = useMemo<TeamIndex | null>(
    () => participants.find((participant) => participant.authId === currentAuthId)?.seat ?? null,
    [currentAuthId, participantsSignature],
  );

  useEffect(() => {
    if (!enabled || !roomId || !matchId || currentSeat === null || participants.length !== 2) {
      setStatus("DISABLED");
      setConnectedAuthIds(new Set());
      return;
    }

    let disposed = false;
    const connectionId = createBaseballClientId("baseball-presence");
    const context = (): BaseballOnlinePresenceContext => ({
      roomId,
      matchId,
      participants: participantsRef.current,
    });
    setStatus("CONNECTING");
    setConnectedAuthIds(new Set());

    void import("../lib/supabase.ts").then(async ({ supabase }) => {
      if (disposed || !supabase) {
        if (!disposed) setStatus("DISABLED");
        return;
      }

      const realtimeAuth = await authenticateBaseballRealtime(supabase, currentAuthId);
      if (disposed) return;
      if (!realtimeAuth.ok) {
        setStatus(realtimeAuth.reason === "AUTH_ERROR" ? "AUTH_ERROR" : "CHANNEL_ERROR");
        setConnectedAuthIds(new Set());
        return;
      }

      const channel = supabase.channel(topicFor(roomId, matchId), {
        config: {
          private: true,
          presence: { key: currentAuthId, enabled: true },
        },
      });
      const syncPresence = () => {
        if (disposed) return;
        setConnectedAuthIds(connectedBaseballOnlineAuthIds(
          channel.presenceState(),
          context(),
        ));
      };
      channel
        .on("presence", { event: "sync" }, syncPresence)
        .on("presence", { event: "join" }, syncPresence)
        .on("presence", { event: "leave" }, syncPresence)
        .subscribe((nextStatus) => {
          if (disposed) return;
          if (nextStatus === "SUBSCRIBED") {
            setStatus("SUBSCRIBED");
            const meta: BaseballOnlinePresenceMeta = {
              schemaVersion: PRESENCE_SCHEMA_VERSION,
              roomId,
              matchId,
              authId: currentAuthId,
              seat: currentSeat,
              connectionId,
            };
            void channel.track(meta).then((trackStatus) => {
              if (!disposed && trackStatus !== "ok") {
                setStatus("CHANNEL_ERROR");
                setConnectedAuthIds(new Set());
              }
            }).catch(() => {
              if (!disposed) {
                setStatus("CHANNEL_ERROR");
                setConnectedAuthIds(new Set());
              }
            });
            return;
          }
          if (nextStatus === "CHANNEL_ERROR" || nextStatus === "TIMED_OUT") {
            setStatus(nextStatus);
            setConnectedAuthIds(new Set());
            return;
          }
          if (nextStatus === "CLOSED") {
            setStatus("CLOSED");
            setConnectedAuthIds(new Set());
          }
        });
      channelRef.current = channel;
      clientRef.current = supabase;
    }).catch(() => {
      if (!disposed) {
        setStatus("CHANNEL_ERROR");
        setConnectedAuthIds(new Set());
      }
    });

    return () => {
      disposed = true;
      const channel = channelRef.current;
      const client = clientRef.current;
      channelRef.current = null;
      clientRef.current = null;
      if (channel) void channel.untrack();
      if (channel && client) void client.removeChannel(channel);
    };
  }, [
    currentAuthId,
    currentSeat,
    enabled,
    matchId,
    participants.length,
    participantsSignature,
    roomId,
  ]);

  const selfConnected = connectedAuthIds.has(currentAuthId);
  const opponent = participants.find((participant) => participant.authId !== currentAuthId) ?? null;
  const opponentConnected = opponent ? connectedAuthIds.has(opponent.authId) : false;
  const allPlayersConnected = status === "SUBSCRIBED"
    && hasAllBaseballOnlineParticipants(connectedAuthIds, participants);

  return {
    status,
    connectedAuthIds,
    selfConnected,
    opponentConnected,
    allPlayersConnected,
  };
}

export default useBaseballOnlinePresence;
