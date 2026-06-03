import { storage } from "@/lib/mmkv";

const CHAT_LIST_KEY =
  "chat_list";

export const saveChatListCache = (
  chats: unknown[]
) => {
  storage.set(
    CHAT_LIST_KEY,
    JSON.stringify(chats)
  );
};

export const getChatListCache =
  () => {
    const cached =
      storage.getString(
        CHAT_LIST_KEY
      );

    if (!cached) return [];

    try {
      return JSON.parse(
        cached
      );
    } catch {
      return [];
    }
  };

export const clearChatListCache =
  () => {
    storage.remove(
      CHAT_LIST_KEY
    );
  };