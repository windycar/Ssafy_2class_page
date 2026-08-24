import type { BaseballRoom } from "../../../types/baseballRoom.ts";

/**
 * Keeps active game entry strict while still letting the remaining participant
 * see the server-cancelled result after the opponent has left the room.
 */
export function canRenderBaseballOnlineRoom(
  room: BaseballRoom,
  currentAuthId: string,
) {
  const game = room.gameState;
  const isParticipant = room.players.some((player) => player.authId === currentAuthId);
  const hasCanonicalMatch = isParticipant && Boolean(room.matchId && game);
  if (!hasCanonicalMatch) return false;

  if (room.status === "cancelled") return true;

  const hasTwoDistinctPlayers = room.players.length === 2
    && new Set(room.players.map((player) => player.authId)).size === 2
    && new Set(room.players.map((player) => player.studentId)).size === 2;
  if (!hasTwoDistinctPlayers) return false;

  return (room.status === "playing" && game?.status === "playing")
    || (room.status === "finished" && game?.status === "finished");
}
