import { useEffect, useRef } from "react";

import { baseballRoomStorage } from "../services/storage/baseballRoomStorage";
import type { BaseballRoom } from "../types/baseballRoom";

type UpdateRoom = (room: BaseballRoom) => unknown;

export function useBaseballRoomPresence(
  room: BaseballRoom,
  currentUserId: number | undefined,
  updateRoom: UpdateRoom,
) {
  const roomRef = useRef(room);
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `baseball-session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const currentSessionId = room.players.find(
    (player) => player.studentId === currentUserId,
  )?.sessionId;

  roomRef.current = room;

  useEffect(() => {
    if (!currentUserId) return;
    const player = roomRef.current.players.find((item) => item.studentId === currentUserId);
    if (!player || player.sessionId === sessionIdRef.current) return;

    updateRoom({
      ...roomRef.current,
      players: roomRef.current.players.map((item) => (
        item.studentId === currentUserId
          ? { ...item, sessionId: sessionIdRef.current, lastSeenAt: new Date().toISOString() }
          : item
      )),
    });
  }, [currentSessionId, currentUserId, room.id, updateRoom]);

  useEffect(() => {
    if (!currentUserId) return;

    const leaveForNavigation = (destinationPath: string) => {
      const roomPath = `/games/baseball/rooms/${roomRef.current.id}`;
      if (destinationPath.startsWith(roomPath)) return;
      baseballRoomStorage.leaveRoom(roomRef.current, currentUserId);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin) leaveForNavigation(destination.pathname);
    };

    const handlePopState = () => {
      window.setTimeout(() => leaveForNavigation(window.location.pathname), 0);
    };

    const handlePageHide = () => {
      if (!import.meta.env.PROD) return;
      const player = roomRef.current.players.find((item) => item.studentId === currentUserId);
      if (!player?.sessionId) return;
      const blob = new Blob([
        JSON.stringify({
          roomId: roomRef.current.id,
          studentId: currentUserId,
          sessionId: player.sessionId,
        }),
      ], { type: "application/json" });
      navigator.sendBeacon("/api/baseball-leave", blob);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [currentUserId]);

  return sessionIdRef.current;
}
