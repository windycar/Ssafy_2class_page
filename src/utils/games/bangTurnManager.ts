import type { BangRoom } from "../../types/bang";

export function getNextTurnStudentId(room: BangRoom): number | undefined {
  const alive = room.turnOrder.filter((id) => {
    const p = room.players.find((p) => p.studentId === id);
    return p && p.status === "alive";
  });
  if (alive.length === 0) return undefined;

  const currentIdx = alive.indexOf(room.currentTurnStudentId ?? -1);
  return alive[(currentIdx + 1) % alive.length];
}

export function getPrevTurnStudentId(room: BangRoom): number | undefined {
  const alive = room.turnOrder.filter((id) => {
    const p = room.players.find((p) => p.studentId === id);
    return p && p.status === "alive";
  });
  if (alive.length === 0) return undefined;

  const currentIdx = alive.indexOf(room.currentTurnStudentId ?? -1);
  const prevIdx = (currentIdx - 1 + alive.length) % alive.length;
  return alive[prevIdx];
}

export function buildTurnOrder(room: BangRoom): number[] {
  const sheriff = room.players.find((p) => p.role === "sheriff");
  const others = room.players.filter((p) => p.role !== "sheriff");
  const ordered = sheriff ? [sheriff, ...others] : room.players;
  return ordered.map((p) => p.studentId);
}

