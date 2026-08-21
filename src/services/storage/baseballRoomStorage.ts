import { supabase } from "../../lib/supabase";
import type { BaseballRoom } from "../../types/baseballRoom";
import {
  normalizeBaseballRoom,
  type BaseballRoomNormalizeFailure,
} from "../../utils/games/baseball/normalizeRoom";
import { removeBaseballPlayer } from "../../utils/games/baseballRoomMembership";

const LOCAL_KEY = "ssafy-gwangju-2-baseball-rooms";
const TABLE = "bang_rooms";
const ID_PATTERN = "baseball-%";

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

function cacheRoom(room: BaseballRoom) {
  const normalized = normalizeBaseballRoom(room, room.id);
  if (!normalized.ok) return false;

  const entries = readRawLocalEntries();
  if (hasFutureVersionCollision(entries, room.id)) return false;

  let replaced = false;
  const nextEntries = entries.flatMap((entry) => {
    if (rawRoomId(entry) !== room.id) return [entry];
    if (replaced) return [];
    replaced = true;
    return [normalized.value];
  });
  return saveRaw(replaced ? nextEntries : [normalized.value, ...entries]);
}

async function upsertRemote(room: BaseballRoom) {
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).upsert({
    id: room.id,
    room_data: room,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("야구 게임방을 저장하지 못했습니다.", error.message);
}

function warnInvalidRoom(scope: string, result: BaseballRoomNormalizeFailure) {
  console.warn(`${scope}: ${result.code} ${result.path}`);
}

function replaceLocalWithRemote(rows: BaseballRoomRow[]) {
  const rooms: BaseballRoom[] = [];
  const remoteEntries: unknown[] = [];
  const remoteIds = new Set<string>();

  for (const row of rows) {
    const normalized = normalizeBaseballRoom(row.room_data, row.id);
    if (normalized.ok) {
      rooms.push(normalized.value);
      remoteEntries.push(normalized.value);
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

  // A future local entry must not disappear merely because this client cannot normalize it.
  for (const entry of readRawLocalEntries()) {
    const id = rawRoomId(entry);
    if (!id || remoteIds.has(id)) continue;
    const normalized = normalizeBaseballRoom(entry, id);
    if (!normalized.ok && normalized.code === "UNSUPPORTED_VERSION") remoteEntries.push(entry);
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

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_data")
      .like("id", ID_PATTERN)
      .order("updated_at", { ascending: false });

    if (error) {
      console.warn("야구 게임방 목록을 불러오지 못했습니다.", error.message);
      return localRooms;
    }

    return replaceLocalWithRemote((data ?? []) as BaseballRoomRow[]);
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
    cacheRoom(normalized.value);
    return normalized.value;
  },

  createRoom(room: BaseballRoom) {
    const normalized = normalizeBaseballRoom(room, room.id);
    if (!normalized.ok) {
      warnInvalidRoom("유효하지 않은 야구 게임방을 만들 수 없습니다", normalized);
      return room;
    }
    if (cacheRoom(normalized.value)) void upsertRemote(normalized.value);
    return normalized.value;
  },

  updateRoom(room: BaseballRoom) {
    const normalized = normalizeBaseballRoom(room, room.id);
    if (!normalized.ok) {
      warnInvalidRoom("유효하지 않은 야구 게임방을 저장할 수 없습니다", normalized);
      return room;
    }
    if (cacheRoom(normalized.value)) void upsertRemote(normalized.value);
    return normalized.value;
  },

  leaveRoom(room: BaseballRoom, studentId: number): BaseballRoom | null {
    const updated = removeBaseballPlayer(room, studentId);
    if (!updated) {
      this.deleteRoom(room.id);
      return null;
    }
    return this.updateRoom(updated);
  },

  deleteCachedRoom(roomId: string) {
    saveRaw(readRawLocalEntries().filter((entry) => rawRoomId(entry) !== roomId));
  },

  deleteRoom(roomId: string) {
    this.deleteCachedRoom(roomId);
    if (!supabase) return;
    void supabase.from(TABLE).delete().eq("id", roomId).then(({ error }) => {
      if (error) console.warn("야구 게임방을 삭제하지 못했습니다.", error.message);
    });
  },
};
