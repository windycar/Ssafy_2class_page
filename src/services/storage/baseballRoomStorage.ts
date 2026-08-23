import { supabase } from "../../lib/supabase.ts";
import type { BaseballRoom } from "../../types/baseballRoom.ts";
import {
  normalizeBaseballRoom,
  type BaseballRoomNormalizeFailure,
} from "../../utils/games/baseball/normalizeRoom.ts";

const LOCAL_KEY = "ssafy-gwangju-2-baseball-rooms";
const TABLE = "bang_rooms";
const ID_PATTERN = "baseball-%";
let localCacheGeneration = 0;

interface BaseballRoomRow {
  id: string;
  room_data: unknown;
}

interface LocalRoomSnapshot {
  rawEntries: unknown[];
  rooms: BaseballRoom[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rawRoomId(value: unknown) {
  return isRecord(value) && typeof value.id === "string" ? value.id : null;
}

function readRawLocalEntries(): unknown[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRaw(entries: unknown[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

function load(): LocalRoomSnapshot {
  const rawEntries = readRawLocalEntries();
  const nextEntries: unknown[] = [];
  const rooms: BaseballRoom[] = [];
  let migrated = false;

  for (const entry of rawEntries) {
    const normalized = normalizeBaseballRoom(entry);
    if (!normalized.ok) {
      // Keep opaque/invalid entries untouched. A newer client may understand a future schema,
      // and this client must never erase it merely because it cannot render it.
      nextEntries.push(entry);
      continue;
    }
    rooms.push(normalized.value);
    nextEntries.push(normalized.value);
    migrated ||= normalized.needsPersistence;
  }

  if (migrated) saveRaw(nextEntries);
  return { rawEntries: migrated ? nextEntries : rawEntries, rooms };
}

function hasFutureVersionCollision(entries: unknown[], roomId: string) {
  return entries.some((entry) => {
    if (rawRoomId(entry) !== roomId) return false;
    const normalized = normalizeBaseballRoom(entry, roomId);
    return !normalized.ok && normalized.code === "UNSUPPORTED_VERSION";
  });
}

function cacheRoom(room: BaseballRoom, markMutation = false) {
  const normalized = normalizeBaseballRoom(room, room.id);
  if (!normalized.ok) return null;

  const entries = readRawLocalEntries();
  if (hasFutureVersionCollision(entries, room.id)) return null;
  const existingEntry = entries.find((entry) => rawRoomId(entry) === room.id);
  if (existingEntry) {
    const existing = normalizeBaseballRoom(existingEntry, room.id);
    if (existing.ok && existing.value.revision > normalized.value.revision) {
      return existing.value;
    }
  }

  let replaced = false;
  const nextEntries = entries.flatMap((entry) => {
    if (rawRoomId(entry) !== room.id) return [entry];
    if (replaced) return [];
    replaced = true;
    return [normalized.value];
  });
  if (!saveRaw(replaced ? nextEntries : [normalized.value, ...entries])) return null;
  if (markMutation) localCacheGeneration += 1;
  return normalized.value;
}

function warnInvalidRoom(scope: string, result: BaseballRoomNormalizeFailure) {
  console.warn(`${scope}: ${result.code} ${result.path}`);
}

function replaceLocalWithRemote(
  rows: BaseballRoomRow[],
  baselineRevisions: ReadonlyMap<string, number>,
  cacheChangedDuringRequest: boolean,
) {
  const rooms: BaseballRoom[] = [];
  const remoteEntries: unknown[] = [];
  const remoteIds = new Set<string>();
  const localEntries = readRawLocalEntries();
  const localRoomsById = new Map<string, BaseballRoom>();
  for (const entry of localEntries) {
    const id = rawRoomId(entry);
    if (!id) continue;
    const normalized = normalizeBaseballRoom(entry, id);
    if (normalized.ok) localRoomsById.set(id, normalized.value);
  }
  const deletedDuringRequest = new Set<string>();
  const changedDuringRequest = new Set<string>();
  if (cacheChangedDuringRequest) {
    for (const [id, revision] of baselineRevisions) {
      const current = localRoomsById.get(id);
      if (!current) deletedDuringRequest.add(id);
      else if (current.revision > revision) changedDuringRequest.add(id);
    }
    for (const id of localRoomsById.keys()) {
      if (!baselineRevisions.has(id)) changedDuringRequest.add(id);
    }
  }

  for (const row of rows) {
    if (deletedDuringRequest.has(row.id)) continue;
    const normalized = normalizeBaseballRoom(row.room_data, row.id);
    if (normalized.ok) {
      const localRoom = localRoomsById.get(row.id);
      const newestRoom = localRoom && localRoom.revision > normalized.value.revision
        ? localRoom
        : normalized.value;
      rooms.push(newestRoom);
      remoteEntries.push(newestRoom);
      remoteIds.add(row.id);
      continue;
    }

    // Preserve a well-addressed future version verbatim, but never surface or rewrite it.
    if (normalized.code === "UNSUPPORTED_VERSION" && rawRoomId(row.room_data) === row.id) {
      remoteEntries.push(row.room_data);
      remoteIds.add(row.id);
    } else {
      warnInvalidRoom(`야구 게임방 ${row.id}을 건너뜁니다`, normalized);
    }
  }

  // Preserve only entries changed after this request began. Unchanged entries
  // absent from the server are deletions and must not become permanent ghosts.
  for (const entry of localEntries) {
    const id = rawRoomId(entry);
    if (!id || remoteIds.has(id)) continue;
    const normalized = normalizeBaseballRoom(entry, id);
    if (normalized.ok && changedDuringRequest.has(id)) {
      rooms.push(normalized.value);
      remoteEntries.push(normalized.value);
    } else if (normalized.code === "UNSUPPORTED_VERSION") {
      remoteEntries.push(entry);
    }
  }

  saveRaw(remoteEntries);
  return rooms;
}

export const baseballRoomStorage = {
  getRooms(): BaseballRoom[] {
    return load().rooms;
  },

  getRoom(roomId: string): BaseballRoom | null {
    return load().rooms.find((room) => room.id === roomId) ?? null;
  },

  async refreshRooms(): Promise<BaseballRoom[]> {
    const localRooms = load().rooms;
    if (!supabase) return localRooms;
    const generationAtStart = localCacheGeneration;
    const baselineRevisions = new Map(
      localRooms.map((room) => [room.id, room.revision] as const),
    );

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_data")
      .like("id", ID_PATTERN)
      .order("updated_at", { ascending: false });

    if (error) {
      console.warn("야구 게임방 목록을 불러오지 못했습니다.", error.message);
      return localRooms;
    }

    return replaceLocalWithRemote(
      (data ?? []) as BaseballRoomRow[],
      baselineRevisions,
      localCacheGeneration !== generationAtStart,
    );
  },

  async refreshRoom(roomId: string): Promise<BaseballRoom | null> {
    const localRoom = this.getRoom(roomId);
    if (!supabase) return localRoom;

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_data")
      .eq("id", roomId)
      .maybeSingle();

    if (error) {
      console.warn("야구 게임방을 불러오지 못했습니다.", error.message);
      return localRoom;
    }
    if (!data) {
      saveRaw(readRawLocalEntries().filter((entry) => rawRoomId(entry) !== roomId));
      return null;
    }

    const row = data as BaseballRoomRow;
    const normalized = normalizeBaseballRoom(row.room_data, row.id);
    if (!normalized.ok) {
      if (normalized.code === "UNSUPPORTED_VERSION" && rawRoomId(row.room_data) === row.id) {
        const entries = readRawLocalEntries().filter((entry) => rawRoomId(entry) !== row.id);
        saveRaw([row.room_data, ...entries]);
        return null;
      }
      warnInvalidRoom(`야구 게임방 ${row.id}을 불러오지 못했습니다`, normalized);
      return localRoom;
    }
    return cacheRoom(normalized.value) ?? localRoom;
  },

  /** Caches only a canonical room already returned by the server. */
  cacheCanonicalRoom(room: BaseballRoom) {
    const normalized = normalizeBaseballRoom(room, room.id);
    if (!normalized.ok) {
      warnInvalidRoom("유효하지 않은 야구 게임방 응답을 저장할 수 없습니다", normalized);
      return null;
    }
    return cacheRoom(normalized.value, true);
  },

  deleteCachedRoom(roomId: string) {
    const entries = readRawLocalEntries();
    const nextEntries = entries.filter((entry) => rawRoomId(entry) !== roomId);
    if (nextEntries.length !== entries.length && saveRaw(nextEntries)) {
      localCacheGeneration += 1;
    }
  },

};
