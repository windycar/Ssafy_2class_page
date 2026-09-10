import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

import { createBaseballClientId } from "../services/baseballCommandClient.ts";
import {
  createBaseballMatchCommittedNotice,
  decideBaseballMatchNotice,
  parseBaseballMatchCommittedNotice,
  type BaseballMatchCommandEnvelope,
  type BaseballMatchCommittedNotice,
  type NoticeCursor,
  type NoticeDecision,
} from "../utils/games/baseball/onlineProtocol.ts";
import { authenticateBaseballRealtime } from "./baseballRealtimeAuth.ts";

const BROADCAST_EVENT = "baseball-command-committed";
const EMPTY_SEEN_COMMAND_IDS: ReadonlySet<string> = new Set();
const NOTICE_KEYS = new Set([
  "schemaVersion",
  "roomId",
  "matchId",
  "commandId",
  "commandSequence",
  "baseRoomRevision",
  "committedRoomRevision",
  "committedGameRevision",
  "actorSeat",
  "seed",
  "playId",
  "kind",
]);

export type BaseballNoticeRefetchReason = "COMMIT" | "GAP" | "DUPLICATE" | "CHANNEL_RECOVERY";

export interface BaseballNoticeRefetchSignal {
  id: string;
  reason: BaseballNoticeRefetchReason;
  notice: BaseballMatchCommittedNotice | null;
}

export type BaseballNoticeProcessingResult =
  | {
      kind: "REFETCH";
      reason: Exclude<BaseballNoticeRefetchReason, "CHANNEL_RECOVERY">;
      decision: "APPLY" | "REFETCH_GAP" | "IGNORE_DUPLICATE";
      notice: BaseballMatchCommittedNotice;
    }
  | {
      kind: "IGNORE";
      decision: Exclude<NoticeDecision, "APPLY" | "REFETCH_GAP" | "IGNORE_DUPLICATE">;
      notice: BaseballMatchCommittedNotice | null;
    };

export interface UseBaseballCommandNoticeChannelOptions {
  roomId?: string;
  matchId?: string;
  seed?: number;
  lastCommandSequence: number;
  lastRoomRevision: number;
  seenCommandIds?: ReadonlySet<string>;
  enabled?: boolean;
  onRefetchRequested?: (signal: BaseballNoticeRefetchSignal) => void;
}

export type BaseballNoticeChannelStatus =
  | "DISABLED"
  | "CONNECTING"
  | "SUBSCRIBED"
  | "CHANNEL_ERROR"
  | "TIMED_OUT"
  | "CLOSED";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Rejects any payload carrying room/game state or unknown side-channel fields. */
export function parseStateFreeBaseballCommittedNotice(
  value: unknown,
): BaseballMatchCommittedNotice | null {
  if (!isRecord(value)) return null;
  const keys = Object.keys(value);
  if (keys.length !== NOTICE_KEYS.size || keys.some((key) => !NOTICE_KEYS.has(key))) {
    return null;
  }
  return parseBaseballMatchCommittedNotice(value);
}

export function processBaseballCommittedNotice(
  cursor: NoticeCursor,
  rawNotice: unknown,
): BaseballNoticeProcessingResult {
  const notice = parseStateFreeBaseballCommittedNotice(rawNotice);
  if (!notice) return { kind: "IGNORE", decision: "REJECT_INVALID", notice: null };

  const decision = decideBaseballMatchNotice(cursor, notice);
  if (decision === "APPLY") {
    return { kind: "REFETCH", reason: "COMMIT", decision, notice };
  }
  if (decision === "REFETCH_GAP") {
    return { kind: "REFETCH", reason: "GAP", decision, notice };
  }
  if (decision === "IGNORE_DUPLICATE") {
    return { kind: "REFETCH", reason: "DUPLICATE", decision, notice };
  }
  return { kind: "IGNORE", decision, notice };
}

function topicFor(roomId: string, matchId: string) {
  return `baseball-command-notice:${roomId}:${matchId}`;
}

export function useBaseballCommandNoticeChannel({
  roomId,
  matchId,
  seed,
  lastCommandSequence,
  lastRoomRevision,
  seenCommandIds = EMPTY_SEEN_COMMAND_IDS,
  enabled = true,
  onRefetchRequested,
}: UseBaseballCommandNoticeChannelOptions) {
  const [latestNotice, setLatestNotice] = useState<BaseballMatchCommittedNotice | null>(null);
  const [refetchSignal, setRefetchSignal] = useState<BaseballNoticeRefetchSignal | null>(null);
  const [status, setStatus] = useState<BaseballNoticeChannelStatus>("DISABLED");
  const channelRef = useRef<RealtimeChannel | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const onRefetchRef = useRef(onRefetchRequested);
  const cursorRef = useRef<NoticeCursor | null>(null);

  onRefetchRef.current = onRefetchRequested;

  useEffect(() => {
    if (!roomId || !matchId || seed === undefined) {
      cursorRef.current = null;
      return;
    }
    const current = cursorRef.current;
    const sameContext = current?.roomId === roomId
      && current.matchId === matchId
      && current.seed === seed;
    cursorRef.current = {
      roomId,
      matchId,
      seed,
      lastCommandSequence: sameContext
        ? Math.max(current.lastCommandSequence, lastCommandSequence)
        : lastCommandSequence,
      lastRoomRevision: sameContext
        ? Math.max(current.lastRoomRevision, lastRoomRevision)
        : lastRoomRevision,
      seenCommandIds: new Set([
        ...(sameContext ? current.seenCommandIds : []),
        ...seenCommandIds,
      ]),
    };
  }, [lastCommandSequence, lastRoomRevision, matchId, roomId, seed, seenCommandIds]);

  const emitRefetchSignal = useCallback((
    reason: BaseballNoticeRefetchReason,
    notice: BaseballMatchCommittedNotice | null,
  ) => {
    const signal: BaseballNoticeRefetchSignal = {
      id: createBaseballClientId("baseball-refetch"),
      reason,
      notice,
    };
    setRefetchSignal(signal);
    onRefetchRef.current?.(signal);
  }, []);

  useEffect(() => {
    if (!enabled || !roomId || !matchId || seed === undefined) {
      setStatus("DISABLED");
      return;
    }

    let disposed = false;
    setLatestNotice(null);
    setRefetchSignal(null);
    setStatus("CONNECTING");
    void import("../lib/supabase.ts").then(async ({ supabase }) => {
      if (disposed || !supabase) {
        if (!disposed) setStatus("DISABLED");
        return;
      }

      const realtimeAuth = await authenticateBaseballRealtime(supabase);
      if (disposed) return;
      if (!realtimeAuth.ok) {
        setStatus("CHANNEL_ERROR");
        emitRefetchSignal("CHANNEL_RECOVERY", null);
        return;
      }

      const channel = supabase.channel(topicFor(roomId, matchId), {
        config: {
          private: true,
          broadcast: { self: true, ack: true },
        },
      });
      channel.on("broadcast", { event: BROADCAST_EVENT }, ({ payload }) => {
        const cursor = cursorRef.current;
        if (!cursor) return;
        const processed = processBaseballCommittedNotice(cursor, payload);
        if (processed.kind === "IGNORE") return;

        setLatestNotice(processed.notice);
        if (processed.reason === "COMMIT") {
          cursorRef.current = {
            ...cursor,
            lastCommandSequence: processed.notice.commandSequence,
            lastRoomRevision: processed.notice.committedRoomRevision,
            seenCommandIds: new Set([...cursor.seenCommandIds, processed.notice.commandId]),
          };
        }
        emitRefetchSignal(processed.reason, processed.notice);
      });
      channel.subscribe((nextStatus) => {
        if (disposed) return;
        if (nextStatus === "SUBSCRIBED") {
          setStatus("SUBSCRIBED");
          return;
        }
        if (nextStatus === "CHANNEL_ERROR" || nextStatus === "TIMED_OUT") {
          setStatus(nextStatus);
          emitRefetchSignal("CHANNEL_RECOVERY", null);
          return;
        }
        if (nextStatus === "CLOSED") setStatus("CLOSED");
      });
      channelRef.current = channel;
      clientRef.current = supabase;
    }).catch(() => {
      if (!disposed) {
        setStatus("CHANNEL_ERROR");
        emitRefetchSignal("CHANNEL_RECOVERY", null);
      }
    });

    return () => {
      disposed = true;
      const channel = channelRef.current;
      const client = clientRef.current;
      channelRef.current = null;
      clientRef.current = null;
      if (channel && client) void client.removeChannel(channel);
    };
  }, [emitRefetchSignal, enabled, matchId, roomId, seed]);

  const sendCommitNotice = useCallback(async (
    envelope: BaseballMatchCommandEnvelope,
    committedRoomRevision: number,
    committedGameRevision: number,
  ) => {
    const channel = channelRef.current;
    if (
      !channel
      || envelope.roomId !== roomId
      || envelope.matchId !== matchId
      || envelope.seed !== seed
    ) return false;

    let notice: BaseballMatchCommittedNotice;
    try {
      notice = createBaseballMatchCommittedNotice(
        envelope,
        committedRoomRevision,
        committedGameRevision,
      );
    } catch {
      return false;
    }
    const result = await channel.send({
      type: "broadcast",
      event: BROADCAST_EVENT,
      payload: notice,
    });
    return result === "ok";
  }, [matchId, roomId, seed]);

  const clearRefetchSignal = useCallback(() => setRefetchSignal(null), []);

  return {
    status,
    latestNotice,
    refetchSignal,
    sendCommitNotice,
    clearRefetchSignal,
  };
}
