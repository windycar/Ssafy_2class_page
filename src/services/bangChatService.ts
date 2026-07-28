import { supabase } from "../lib/supabase";
import type { BangChatMessage } from "../types/bang";

const TABLE = "bang_chat_messages";
const MESSAGE_LIMIT = 100;

interface BangChatMessageRow {
  id: string;
  room_id: string;
  student_id: number;
  name: string;
  message: string;
  created_at: string;
}

function toChatMessage(row: BangChatMessageRow): BangChatMessage {
  return {
    id: row.id,
    studentId: row.student_id,
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  };
}

export const bangChatService = {
  isConfigured: Boolean(supabase),

  async listMessages(roomId: string): Promise<BangChatMessage[]> {
    if (!supabase) throw new Error("Supabase connection is not configured.");

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, room_id, student_id, name, message, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(MESSAGE_LIMIT);

    if (error) throw error;

    return ((data ?? []) as BangChatMessageRow[])
      .map(toChatMessage)
      .reverse();
  },

  async insertMessage(roomId: string, chat: BangChatMessage): Promise<void> {
    if (!supabase) throw new Error("Supabase connection is not configured.");

    const { error } = await supabase.from(TABLE).insert({
      id: chat.id,
      room_id: roomId,
      student_id: chat.studentId,
      name: chat.name,
      message: chat.message,
      created_at: chat.createdAt,
    });

    if (error) throw error;
  },

  subscribe(
    roomId: string,
    onInsert: (chat: BangChatMessage) => void,
    onReconnectNeeded?: () => void,
  ): () => void {
    if (!supabase) return () => undefined;

    const channel = supabase
      .channel(`bang-chat:${roomId}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: TABLE,
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          onInsert(toChatMessage(payload.new as BangChatMessageRow));
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          onReconnectNeeded?.();
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  },
};
