import { useCallback, useEffect, useMemo, useState } from "react";
import { bangChatService } from "../services/bangChatService";
import type { BangChatMessage } from "../types/bang";

const MESSAGE_LIMIT = 100;
const RECOVERY_INTERVAL_MS = 10_000;

function mergeMessages(...groups: BangChatMessage[][]): BangChatMessage[] {
  const byId = new Map<string, BangChatMessage>();

  for (const group of groups) {
    for (const chat of group) byId.set(chat.id, chat);
  }

  return [...byId.values()]
    .sort((a, b) => {
      const timeDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return timeDifference || a.id.localeCompare(b.id);
    })
    .slice(-MESSAGE_LIMIT);
}

export function useBangChat(roomId: string, legacyMessages: BangChatMessage[]) {
  const [messages, setMessages] = useState<BangChatMessage[]>(() => mergeMessages(legacyMessages));
  const legacySignature = useMemo(
    () => legacyMessages.map((chat) => `${chat.id}:${chat.createdAt}`).join("|"),
    [legacyMessages],
  );

  const refresh = useCallback(async () => {
    if (!bangChatService.isConfigured) return false;

    try {
      const remoteMessages = await bangChatService.listMessages(roomId);
      setMessages((current) => mergeMessages(current, remoteMessages));
      return true;
    } catch (error) {
      console.warn("BANG 채팅을 불러오지 못했습니다.", error);
      return false;
    }
  }, [roomId]);

  useEffect(() => {
    setMessages((current) => mergeMessages(current, legacyMessages));
    // The signature changes only when legacy room_data chat history changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacySignature]);

  useEffect(() => {
    let active = true;
    setMessages(mergeMessages(legacyMessages));

    const recover = () => {
      if (active) void refresh();
    };
    const unsubscribe = bangChatService.subscribe(
      roomId,
      (chat) => {
        if (active) setMessages((current) => mergeMessages(current, [chat]));
      },
      recover,
    );

    void refresh();
    const recoveryTimer = window.setInterval(recover, RECOVERY_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(recoveryTimer);
      unsubscribe();
    };
    // A room id change starts an entirely new chat subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, refresh]);

  const sendMessage = useCallback(async (chat: BangChatMessage) => {
    setMessages((current) => mergeMessages(current, [chat]));

    try {
      await bangChatService.insertMessage(roomId, chat);
      return true;
    } catch (error) {
      setMessages((current) => current.filter((item) => item.id !== chat.id));
      console.warn("BANG 채팅을 저장하지 못했습니다.", error);
      return false;
    }
  }, [roomId]);

  return {
    messages,
    sendMessage,
    refresh,
    isRealtimeConfigured: bangChatService.isConfigured,
  };
}
