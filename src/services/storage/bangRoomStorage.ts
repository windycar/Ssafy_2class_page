import { supabase } from "../../lib/supabase";
import type { BangRoom } from "../../types/bang";
import { removeBangPlayer } from "../../utils/games/bangRoomMembership";

const LOCAL_KEY = "ssafy-gwangju-2-bang-rooms";
const TABLE = "bang_rooms";

interface BangRoomRow {
  id: string;
  room_data: BangRoom;
}

function load(): BangRoom[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as BangRoom[]) : [];
  } catch {
    return [];
  }
}

function save(rooms: BangRoom[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rooms));
}

function cacheRoom(room: BangRoom): void {
  const rooms = load();
  const exists = rooms.some((item) => item.id === room.id);
  save(exists ? rooms.map((item) => (item.id === room.id ? room : item)) : [room, ...rooms]);
}

async function upsertRemote(room: BangRoom): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from(TABLE).upsert({
    id: room.id,
    room_data: room,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn("뱅 게임방을 Supabase에 저장하지 못했습니다.", error.message);
  }
}

export const bangRoomStorage = {
  getRooms(): BangRoom[] {
    return load();
  },

  getRoom(roomId: string): BangRoom | null {
    return load().find((room) => room.id === roomId) ?? null;
  },

  async refreshRooms(): Promise<BangRoom[]> {
    const localRooms = load();
    if (!supabase) return localRooms;

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_data")
      .order("updated_at", { ascending: false });

    if (error) {
      console.warn("뱅 게임방 목록을 불러오지 못했습니다.", error.message);
      return localRooms;
    }

    const remoteRooms = ((data ?? []) as BangRoomRow[]).map((row) => row.room_data);
    save(remoteRooms);
    return remoteRooms;
  },

  async refreshRoom(roomId: string): Promise<BangRoom | null> {
    const localRoom = this.getRoom(roomId);
    if (!supabase) return localRoom;

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_data")
      .eq("id", roomId)
      .maybeSingle();

    if (error) {
      console.warn("뱅 게임방을 불러오지 못했습니다.", error.message);
      return localRoom;
    }

    if (!data) {
      save(load().filter((room) => room.id !== roomId));
      return null;
    }

    const room = (data as BangRoomRow).room_data;
    cacheRoom(room);
    return room;
  },

  createRoom(room: BangRoom): BangRoom {
    cacheRoom(room);
    void upsertRemote(room);
    return room;
  },

  updateRoom(room: BangRoom): BangRoom {
    cacheRoom(room);
    void upsertRemote(room);
    return room;
  },

  leaveRoom(room: BangRoom, studentId: number): BangRoom | null {
    const updated = removeBangPlayer(room, studentId);
    if (!updated) {
      this.deleteRoom(room.id);
      return null;
    }
    return this.updateRoom(updated);
  },

  deleteRoom(roomId: string): void {
    save(load().filter((room) => room.id !== roomId));
    if (supabase) {
      void supabase
        .from(TABLE)
        .delete()
        .eq("id", roomId)
        .then(({ error }) => {
          if (error) console.warn("뱅 게임방을 삭제하지 못했습니다.", error.message);
        });
    }
  },
};
