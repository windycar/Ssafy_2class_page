import type { BangRoom } from "../../types/bang";
import type { PendingAction } from "../../types/bangCards";

function cleanPending(
  pending: PendingAction | undefined,
  leavingStudentId: number,
): PendingAction | undefined {
  if (!pending) return undefined;

  if (
    ("fromId" in pending && pending.fromId === leavingStudentId)
    || ("playerId" in pending && pending.playerId === leavingStudentId)
    || ("targetId" in pending && pending.targetId === leavingStudentId)
    || (pending.type === "duel_response" && (pending.p1 === leavingStudentId || pending.p2 === leavingStudentId))
  ) {
    return undefined;
  }

  if (
    pending.type === "indians_response"
    || pending.type === "gatling_response"
    || pending.type === "general_store_pick"
  ) {
    const remaining = pending.remaining.filter((id) => id !== leavingStudentId);
    return remaining.length > 0 ? { ...pending, remaining } : undefined;
  }

  return pending;
}

export function removeBangPlayer(
  room: BangRoom,
  studentId: number,
  reason = "게임방에서 나갔습니다.",
): BangRoom | null {
  const leavingPlayer = room.players.find((player) => player.studentId === studentId);
  if (!leavingPlayer) return room;

  let remainingPlayers = room.players.filter((player) => player.studentId !== studentId);
  if (remainingPlayers.length === 0) return null;

  const nextHost = room.hostStudentId === studentId
    ? [...remainingPlayers].sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())[0]
    : remainingPlayers.find((player) => player.studentId === room.hostStudentId);

  if (nextHost) {
    remainingPlayers = remainingPlayers.map((player) => ({
      ...player,
      isHost: player.studentId === nextHost.studentId,
    }));
  }

  const oldTurnOrder = room.turnOrder;
  const oldTurnIndex = oldTurnOrder.indexOf(studentId);
  const turnOrder = oldTurnOrder.filter((id) => id !== studentId);
  let currentTurnStudentId = room.currentTurnStudentId;
  if (currentTurnStudentId === studentId) {
    currentTurnStudentId = turnOrder.length > 0
      ? turnOrder[Math.max(0, oldTurnIndex) % turnOrder.length]
      : undefined;
  }

  let cardState = room.cardState;
  if (cardState) {
    const key = String(studentId);
    const leavingCards = [
      ...(cardState.hands[key] ?? []),
      ...(cardState.equipment[key] ?? []),
    ];
    const { [key]: _removedHand, ...hands } = cardState.hands;
    const { [key]: _removedEquipment, ...equipment } = cardState.equipment;
    cardState = {
      ...cardState,
      hands,
      equipment,
      discardPile: [...leavingCards, ...cardState.discardPile],
      pending: cleanPending(cardState.pending, studentId),
      log: [`🚪 ${leavingPlayer.name} 님이 게임방을 나갔습니다.`, ...cardState.log].slice(0, 50),
    };
  }

  const cancelled = room.status === "playing" && remainingPlayers.length < 2;
  return {
    ...room,
    players: remainingPlayers,
    hostStudentId: nextHost?.studentId ?? room.hostStudentId,
    turnOrder,
    turnIndex: currentTurnStudentId ? Math.max(0, turnOrder.indexOf(currentTurnStudentId)) : 0,
    currentTurnStudentId,
    cardState,
    status: cancelled ? "cancelled" : room.status,
    winner: cancelled ? "cancelled" : room.winner,
    finishedAt: cancelled ? new Date().toISOString() : room.finishedAt,
    activityLogs: [
      {
        id: `leave-${Date.now()}-${studentId}`,
        roomId: room.id,
        type: "leave",
        message: `${leavingPlayer.name} 님이 ${reason}`,
        createdAt: new Date().toISOString(),
      },
      ...room.activityLogs,
    ],
  };
}
