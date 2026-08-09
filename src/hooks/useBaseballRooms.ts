import { useCallback, useEffect, useState } from "react";

import { baseballRoomStorage } from "../services/storage/baseballRoomStorage";
import type { BaseballRoom } from "../types/baseballRoom";

export function useBaseballRooms() {
  const [rooms, setRooms] = useState<BaseballRoom[]>(() => baseballRoomStorage.getRooms());

  const refresh = useCallback(() => {
    setRooms(baseballRoomStorage.getRooms());
    void baseballRoomStorage.refreshRooms().then(setRooms);
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const createRoom = useCallback((room: BaseballRoom) => {
    baseballRoomStorage.createRoom(room);
    refresh();
  }, [refresh]);

  const updateRoom = useCallback((room: BaseballRoom) => {
    baseballRoomStorage.updateRoom(room);
    refresh();
  }, [refresh]);

  const deleteRoom = useCallback((roomId: string) => {
    baseballRoomStorage.deleteRoom(roomId);
    refresh();
  }, [refresh]);

  return { rooms, refresh, createRoom, updateRoom, deleteRoom };
}
