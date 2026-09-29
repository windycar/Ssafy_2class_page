import { useState, useCallback, useEffect } from "react";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import type { BangRoom } from "../types/bang";

export function useBangRooms(enabled = true) {
  const [rooms, setRooms] = useState<BangRoom[]>(() => enabled ? bangRoomStorage.getRooms() : []);

  const refresh = useCallback(() => {
    setRooms(bangRoomStorage.getRooms());
    void bangRoomStorage.refreshRooms().then(setRooms);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    refresh();
    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [refresh, enabled]);

  const createRoom = useCallback((room: BangRoom) => {
    bangRoomStorage.createRoom(room);
    refresh();
  }, [refresh]);

  const updateRoom = useCallback((room: BangRoom) => {
    bangRoomStorage.updateRoom(room);
    refresh();
  }, [refresh]);

  const deleteRoom = useCallback((roomId: string) => {
    bangRoomStorage.deleteRoom(roomId);
    refresh();
  }, [refresh]);

  return { rooms, refresh, createRoom, updateRoom, deleteRoom };
}
