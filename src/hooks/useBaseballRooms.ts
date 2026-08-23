import { useCallback, useEffect, useRef, useState } from "react";

import {
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  baseballRoomCommandClient,
  type BaseballRoomCommandResult,
} from "../services/baseballRoomCommandClient.ts";
import { baseballRoomStorage } from "../services/storage/baseballRoomStorage";
import type { BaseballRoom } from "../types/baseballRoom";

export interface CreateBaseballRoomInput {
  title: string;
  description: string;
  isPublic: boolean;
}

export function useBaseballRooms() {
  const [rooms, setRooms] = useState<BaseballRoom[]>(() => baseballRoomStorage.getRooms());
  const refreshInFlightRef = useRef(false);
  const createInFlightRef = useRef(false);

  const refresh = useCallback(() => {
    setRooms(baseballRoomStorage.getRooms());
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    void baseballRoomStorage.refreshRooms()
      .then(setRooms)
      .finally(() => {
        refreshInFlightRef.current = false;
      });
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const createRoom = useCallback(async (
    input: CreateBaseballRoomInput,
  ): Promise<BaseballRoomCommandResult> => {
    if (createInFlightRef.current) {
      return { ok: false, status: 409, code: "COMMAND_IN_FLIGHT" };
    }
    createInFlightRef.current = true;
    try {
      const result = await baseballRoomCommandClient.send({
        schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
        commandId: baseballRoomCommandClient.createCommandId("CREATE"),
        kind: "CREATE",
        payload: {
          title: input.title,
          description: input.description,
          isPublic: input.isPublic,
          sessionId: baseballRoomCommandClient.getSessionId(),
        },
      });
      if (result.ok && result.room) {
        const canonicalRoom = result.room;
        baseballRoomStorage.cacheCanonicalRoom(canonicalRoom);
        setRooms((current) => [
          canonicalRoom,
          ...current.filter((room) => room.id !== canonicalRoom.id),
        ]);
      }
      return result;
    } finally {
      createInFlightRef.current = false;
    }
  }, []);

  return { rooms, refresh, createRoom };
}
