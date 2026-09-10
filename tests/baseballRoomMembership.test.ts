import assert from "node:assert/strict";
import test from "node:test";

import {
  BASEBALL_ROOM_SCHEMA_VERSION,
  type BaseballRoom,
} from "../src/types/baseballRoom.ts";
import {
  getBaseballPlayerAtSeat,
  getFirstFreeBaseballSeat,
  removeBaseballPlayer,
} from "../src/utils/games/baseballRoomMembership.ts";

function createRoom(status: BaseballRoom["status"] = "ready"): BaseballRoom {
  return {
    schemaVersion: BASEBALL_ROOM_SCHEMA_VERSION,
    revision: 7,
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
        seat: 0,
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
        seat: 1,
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
  assert.equal(updated.players[0].seat, 1, "남은 참가자의 고정 좌석을 유지해야 한다");
  assert.equal(updated.status, "recruiting");
  assert.equal(updated.revision, 8);
});

test("진행 중 상대가 나가면 경기를 취소한다", () => {
  const updated = removeBaseballPlayer(createRoom("playing"), 2);
  assert.ok(updated);
  assert.equal(updated.status, "cancelled");
  assert.equal(updated.players.length, 1);
  assert.equal(updated.players[0].seat, 0, "퇴장 후 남은 참가자를 다른 좌석으로 옮기지 않는다");
  assert.equal(updated.revision, 8);
  assert.ok(updated.finishedAt);
});

test("마지막 참가자가 나가면 방을 삭제하도록 null을 반환한다", () => {
  const room = createRoom();
  room.players = room.players.slice(0, 1);
  assert.equal(removeBaseballPlayer(room, 1), null);
});

test("빈 좌석은 배열 순서가 아니라 고정 seat 값으로 찾는다", () => {
  const room = createRoom();
  room.players = [room.players[1]];

  assert.equal(getFirstFreeBaseballSeat(room.players), 0);
  assert.equal(getBaseballPlayerAtSeat(room.players, 1)?.studentId, 2);
  assert.equal(getBaseballPlayerAtSeat(room.players, 0), undefined);
});
