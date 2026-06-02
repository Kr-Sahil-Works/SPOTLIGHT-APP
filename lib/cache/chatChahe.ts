import { storage } from "@/lib/mmkv";

export const saveChatCache = (
  conversationId: string,
  messages: unknown[]
) => {
  storage.set(
    `chat_${conversationId}`,
    JSON.stringify(messages)
  );
};

export const getChatCache = (
  conversationId: string
) => {
  const cached = storage.getString(
    `chat_${conversationId}`
  );

  if (!cached) return [];

  try {
    return JSON.parse(cached);
  } catch {
    return [];
  }
};