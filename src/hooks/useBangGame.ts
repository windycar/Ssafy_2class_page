import { useState, useCallback } from "react";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import { assignBangRoles } from "../utils/games/bangRoleAssignment";
import { buildTurnOrder, getNextTurnStudentId, getPrevTurnStudentId } from "../utils/games/bangTurnManager";
import { increaseLife, decreaseLife, eliminatePlayer, restorePlayer } from "../utils/games/bangLifeManager";
import { createId } from "../utils/createId";
import type { BangRoom, BangPlayer, BangWinner } from "../types/bang";

export function useBangGame(initialRoom: BangRoom) {
  const [room, setRoom] = useState<BangRoom>(initialRoom);

  const persist = useCallback((updated: BangRoom) => {
    bangRoomStorage.updateRoom(updated);
    setRoom(updated);
    return updated;
  }, []);

  const addLog = (r: BangRoom, message: string, type = "info"): BangRoom => ({
    ...r,
    activityLogs: [
      { id: createId("log"), roomId: r.id, type, message, createdAt: new Date().toISOString() },
      ...r.activityLogs,
    ],
  });

  const startGame = useCallback(() => {
    let r = { ...room };
    r.players = assignBangRoles(r.players);
    r.turnOrder = buildTurnOrder(r);
    const sheriff = r.players.find((p) => p.role === "sheriff");
    r.currentTurnStudentId = sheriff?.studentId ?? r.turnOrder[0];
    r.turnIndex = 0;
    r.status = "playing";
    r.startedAt = new Date().toISOString();
    r = addLog(r, "게임이 시작되었습니다.");
    if (sheriff) r = addLog(r, `현재 턴: ${sheriff.name}`);
    persist(r);
  }, [room, persist]);

  const nextTurn = useCallback(() => {
    let r = { ...room };
    const next = getNextTurnStudentId(r);
    if (!next) return;
    r.currentTurnStudentId = next;
    const player = r.players.find((p) => p.studentId === next);
    r = addLog(r, `다음 턴: ${player?.name ?? next}`);
    persist(r);
  }, [room, persist]);

  const prevTurn = useCallback(() => {
    let r = { ...room };
    const prev = getPrevTurnStudentId(r);
    if (!prev) return;
    r.currentTurnStudentId = prev;
    const player = r.players.find((p) => p.studentId === prev);
    r = addLog(r, `이전 턴으로: ${player?.name ?? prev}`);
    persist(r);
  }, [room, persist]);

  const changeLife = useCallback((studentId: number, delta: number) => {
    let r = { ...room };
    r.players = r.players.map((p) => {
      if (p.studentId !== studentId) return p;
      return delta > 0 ? increaseLife(p) : decreaseLife(p);
    });
    const player = r.players.find((p) => p.studentId === studentId);
    if (player) r = addLog(r, `${player.name}의 생명력이 ${player.life}으로 변경되었습니다.`);
    persist(r);
  }, [room, persist]);

  const eliminate = useCallback((studentId: number) => {
    let r = { ...room };
    r.players = r.players.map((p) =>
      p.studentId === studentId ? eliminatePlayer(p) : p
    );
    const player = r.players.find((p) => p.studentId === studentId);
    if (player) r = addLog(r, `${player.name}이(가) 탈락했습니다.`, "eliminate");
    persist(r);
  }, [room, persist]);

  const restore = useCallback((studentId: number) => {
    let r = { ...room };
    r.players = r.players.map((p) =>
      p.studentId === studentId ? restorePlayer(p) : p
    );
    const player = r.players.find((p) => p.studentId === studentId);
    if (player) r = addLog(r, `${player.name}이(가) 복구되었습니다.`);
    persist(r);
  }, [room, persist]);

  const endGame = useCallback((winner: BangWinner, mvpStudentId?: number, review?: string) => {
    let r = { ...room };
    r.status = "finished";
    r.winner = winner;
    r.mvpStudentId = mvpStudentId;
    r.review = review;
    r.finishedAt = new Date().toISOString();
    r = addLog(r, "게임이 종료되었습니다.", "end");
    persist(r);
  }, [room, persist]);

  const updatePlayer = useCallback((updated: BangPlayer) => {
    const r = { ...room, players: room.players.map((p) => p.studentId === updated.studentId ? updated : p) };
    persist(r);
  }, [room, persist]);

  const refresh = useCallback(async () => {
    const fresh = await bangRoomStorage.refreshRoom(room.id);
    if (fresh) setRoom(fresh);
    return fresh;
  }, [room.id]);

  return { room, setRoom: persist, refresh, startGame, nextTurn, prevTurn, changeLife, eliminate, restore, endGame, updatePlayer };
}
