import { useState, useCallback, useEffect } from "react";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import type { BangRoom } from "../types/bang";

export function useBangRooms() {
  const [rooms, setRooms] = useState<BangRoom[]>(() => bangRoomStorage.getRooms());

  const refresh = useCallback(() => {
    setRooms(bangRoomStorage.getRooms());
    void bangRoomStorage.refreshRooms().then(setRooms);
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

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
