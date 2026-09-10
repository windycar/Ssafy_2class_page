import assert from "node:assert/strict";
import test from "node:test";

import { baseballRoomStorage } from "../src/services/storage/baseballRoomStorage.ts";
import type { BaseballRoom } from "../src/types/baseballRoom.ts";

const LOCAL_KEY = "ssafy-gwangju-2-baseball-rooms";
const CREATED_AT = "2026-08-24T00:00:00.000Z";

function room(revision = 7): BaseballRoom {
  return {
    schemaVersion: 2,
    revision,
    id: "baseball-storage-room",
    title: "저장소 테스트 방",
    description: "",
    hostStudentId: 101,
    maxPlayers: 2,
    isPublic: false,
    status: "recruiting",
    players: [{
      seat: 0,
      studentId: 101,
      authId: "00000000-0000-4000-8000-000000000101",
      name: "방장",
      username: "host",
      isHost: true,
      isReady: false,
      status: "waiting",
      joinedAt: CREATED_AT,
    }],
    activityLogs: [{
      id: "baseball-storage-log",
      roomId: "baseball-storage-room",
      type: "create",
      message: "방을 만들었습니다.",
      createdAt: CREATED_AT,
    }],
    createdAt: CREATED_AT,
  };
}

test("canonical 로컬 캐시는 미래 버전을 보존하고 revision을 뒤로 돌리지 않는다", async (context) => {
  const values = new Map<string, string>();
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem(key: string) { return values.get(key) ?? null; },
      setItem(key: string, value: string) { values.set(key, value); },
    },
  });
  context.after(() => {
    if (originalDescriptor) Object.defineProperty(globalThis, "localStorage", originalDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  });

  const futureRoom = {
    schemaVersion: 99,
    id: "baseball-future-storage-room",
    revision: 1,
  };
  values.set(LOCAL_KEY, JSON.stringify([room(), futureRoom]));

  assert.equal(baseballRoomStorage.cacheCanonicalRoom(room(6))?.revision, 7);
  assert.equal(baseballRoomStorage.cacheCanonicalRoom(room(8))?.revision, 8);
  assert.equal(baseballRoomStorage.getRoom(room().id)?.revision, 8);
  assert.deepEqual(
    JSON.parse(values.get(LOCAL_KEY) ?? "[]").find(
      (entry: { id?: string }) => entry.id === futureRoom.id,
    ),
    futureRoom,
  );

  // Native Node does not provide Vite's import.meta.env. The storage module
  // must still be importable and return its canonical offline cache safely.
  const offlineRooms = await baseballRoomStorage.refreshRooms();
  assert.equal(offlineRooms.find((entry) => entry.id === room().id)?.revision, 8);
});
