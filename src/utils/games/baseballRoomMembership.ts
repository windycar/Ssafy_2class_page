import type { BaseballRoom } from "../../types/baseballRoom";

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
