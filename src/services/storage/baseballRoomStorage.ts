import { supabase } from "../../lib/supabase";
import type { BaseballRoom } from "../../types/baseballRoom";
import { removeBaseballPlayer } from "../../utils/games/baseballRoomMembership";

const LOCAL_KEY = "ssafy-gwangju-2-baseball-rooms";
const TABLE = "bang_rooms";
const ID_PATTERN = "baseball-%";

interface BaseballRoomRow {
  id: string;
  room_data: BaseballRoom;
}

function load(): BaseballRoom[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as BaseballRoom[]) : [];
  } catch {
    return [];
  }
}

function save(rooms: BaseballRoom[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rooms));
}

function cacheRoom(room: BaseballRoom) {
  const rooms = load();
  const exists = rooms.some((item) => item.id === room.id);
  save(exists ? rooms.map((item) => (item.id === room.id ? room : item)) : [room, ...rooms]);
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

export const baseballRoomStorage = {
  getRooms(): BaseballRoom[] {
    return load();
  },

  getRoom(roomId: string): BaseballRoom | null {
    return load().find((room) => room.id === roomId) ?? null;
  },

  async refreshRooms(): Promise<BaseballRoom[]> {
    const localRooms = load();
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

    const remoteRooms = ((data ?? []) as BaseballRoomRow[]).map((row) => row.room_data);
    save(remoteRooms);
    return remoteRooms;
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
      save(load().filter((room) => room.id !== roomId));
      return null;
    }

    const room = (data as BaseballRoomRow).room_data;
    cacheRoom(room);
    return room;
  },

  createRoom(room: BaseballRoom) {
    cacheRoom(room);
    void upsertRemote(room);
    return room;
  },

  updateRoom(room: BaseballRoom) {
    cacheRoom(room);
    void upsertRemote(room);
    return room;
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
    save(load().filter((room) => room.id !== roomId));
  },

  deleteRoom(roomId: string) {
    this.deleteCachedRoom(roomId);
    if (!supabase) return;
    void supabase.from(TABLE).delete().eq("id", roomId).then(({ error }) => {
      if (error) console.warn("야구 게임방을 삭제하지 못했습니다.", error.message);
    });
  },
};
