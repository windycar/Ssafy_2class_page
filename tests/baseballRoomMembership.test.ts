import assert from "node:assert/strict";
import test from "node:test";

import type { BaseballRoom } from "../src/types/baseballRoom.ts";
import { removeBaseballPlayer } from "../src/utils/games/baseballRoomMembership.ts";

function createRoom(status: BaseballRoom["status"] = "ready"): BaseballRoom {
  return {
    id: "baseball-test-room",
    title: "테스트 방",
    description: "",
    hostStudentId: 1,
    maxPlayers: 2,
    isPublic: false,
    status,
    createdAt: "2026-08-09T00:00:00.000Z",
    activityLogs: [],
    players: [
      {
        studentId: 1,
        authId: "auth-1",
        name: "방장",
        username: "host",
        isHost: true,
        isReady: true,
        status: "ready",
        joinedAt: "2026-08-09T00:00:00.000Z",
      },
      {
        studentId: 2,
        authId: "auth-2",
        name: "초대 손님",
        username: "guest",
        isHost: false,
        isReady: true,
        status: "ready",
        joinedAt: "2026-08-09T00:01:00.000Z",
      },
    ],
  };
}

test("방장이 나가면 남은 참가자에게 방장이 넘어간다", () => {
  const updated = removeBaseballPlayer(createRoom(), 1);
  assert.ok(updated);
  assert.equal(updated.players.length, 1);
  assert.equal(updated.hostStudentId, 2);
  assert.equal(updated.players[0].isHost, true);
  assert.equal(updated.status, "recruiting");
});

test("진행 중 상대가 나가면 경기를 취소한다", () => {
  const updated = removeBaseballPlayer(createRoom("playing"), 2);
  assert.ok(updated);
  assert.equal(updated.status, "cancelled");
  assert.equal(updated.players.length, 1);
  assert.ok(updated.finishedAt);
});

test("마지막 참가자가 나가면 방을 삭제하도록 null을 반환한다", () => {
  const room = createRoom();
  room.players = room.players.slice(0, 1);
  assert.equal(removeBaseballPlayer(room, 1), null);
});
