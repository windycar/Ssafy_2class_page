import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export interface BaseballMatchGameEvent {
  id: string;
  matchId: string;
  senderAuthId: string;
  payload: Record<string, unknown>;
}

export function useBaseballMatchChannel(roomId?: string, currentAuthId?: string) {
  const [gameEvent, setGameEvent] = useState<BaseballMatchGameEvent | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase || !roomId || !currentAuthId) return;

    const channel = supabase.channel(`baseball-match:${roomId}`, {
      config: { broadcast: { self: true, ack: true } },
    });
    channel.on("broadcast", { event: "baseball-game" }, ({ payload }) => {
      const nextEvent = payload as BaseballMatchGameEvent;
      if (
        typeof nextEvent?.id === "string"
        && typeof nextEvent.matchId === "string"
        && typeof nextEvent.senderAuthId === "string"
        && nextEvent.payload
      ) {
        setGameEvent(nextEvent);
      }
    });
    channel.subscribe();
    channelRef.current = channel;

    return () => {
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [currentAuthId, roomId]);

  const sendGameEvent = useCallback(async (
    matchId: string,
    payload: Record<string, unknown>,
  ) => {
    const channel = channelRef.current;
    if (!channel || !matchId || !currentAuthId) return false;

    const event: BaseballMatchGameEvent = {
      id: typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${currentAuthId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      matchId,
      senderAuthId: currentAuthId,
      payload,
    };
    const result = await channel.send({
      type: "broadcast",
      event: "baseball-game",
      payload: event,
    });
    return result === "ok";
  }, [currentAuthId]);

  return { gameEvent, sendGameEvent };
}
