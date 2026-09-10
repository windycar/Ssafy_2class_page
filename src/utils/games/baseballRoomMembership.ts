import type { BaseballRoom, BaseballRoomPlayer } from "../../types/baseballRoom";
import type { TeamIndex } from "./baseballEngine";

export const BASEBALL_ROOM_SEATS = [0, 1] as const satisfies readonly TeamIndex[];

export function getBaseballPlayerAtSeat(
  players: readonly BaseballRoomPlayer[],
  seat: TeamIndex,
) {
  return players.find((player) => player.seat === seat);
}

export function getFirstFreeBaseballSeat(
  players: readonly BaseballRoomPlayer[],
): TeamIndex | null {
  return BASEBALL_ROOM_SEATS.find(
    (seat) => getBaseballPlayerAtSeat(players, seat) === undefined,
  ) ?? null;
}

export function removeBaseballPlayer(
  room: BaseballRoom,
  studentId: number,
  reason = "게임방을 나갔습니다.",
): BaseballRoom | null {
  const leavingPlayer = room.players.find((player) => player.studentId === studentId);
  if (!leavingPlayer) return room;

  let players = room.players.filter((player) => player.studentId !== studentId);
  if (players.length === 0) return null;

  const nextHost = room.hostStudentId === studentId
    ? [...players].sort(
        (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
      )[0]
    : players.find((player) => player.studentId === room.hostStudentId);

  players = players.map((player) => ({
    ...player,
    isHost: player.studentId === nextHost?.studentId,
  }));

  const cancelled = room.status === "playing";
  const status = cancelled
    ? "cancelled"
    : room.status === "ready" || room.status === "full"
      ? "recruiting"
      : room.status;

  return {
    ...room,
    revision: room.revision + 1,
    hostStudentId: nextHost?.studentId ?? room.hostStudentId,
    players,
    status,
    finishedAt: cancelled ? new Date().toISOString() : room.finishedAt,
    activityLogs: [
      {
        id: `baseball-leave-${Date.now()}-${studentId}`,
        roomId: room.id,
        type: "leave",
        message: `${leavingPlayer.name} 님이 ${reason}`,
        createdAt: new Date().toISOString(),
      },
      ...room.activityLogs,
    ],
  };
}
