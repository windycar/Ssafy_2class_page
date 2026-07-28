import type { BangRoom } from "../../types/bang";
import { shuffleArray } from "../shuffleArray";

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
  const shuffledPlayers = shuffleArray(room.players);
  const sheriffIndex = shuffledPlayers.findIndex((player) => player.role === "sheriff");
  if (sheriffIndex < 0) {
    return shuffledPlayers.map((player) => player.studentId);
  }

  const clockwiseFromSheriff = [
    ...shuffledPlayers.slice(sheriffIndex),
    ...shuffledPlayers.slice(0, sheriffIndex),
  ];
  return clockwiseFromSheriff.map((player) => player.studentId);
}

