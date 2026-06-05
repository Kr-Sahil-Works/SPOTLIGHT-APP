import { storage } from "@/lib/mmkv";

type CachedChat = {
  messages: unknown[];

  currentUserId?: string;

  conversationId?: string;

  themeIndex?: number | null;
};

export const saveChatCache = (
  chatId: string,
  data: CachedChat
) => {
  storage.set(
    `chat_${chatId}`,
    JSON.stringify({
      ...data,

      messages:
        data.messages.slice(-40),
    })
  );
};

export const getChatCache = (
  chatId: string
): CachedChat | null => {
  const cached =
    storage.getString(
      `chat_${chatId}`
    );

  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
};