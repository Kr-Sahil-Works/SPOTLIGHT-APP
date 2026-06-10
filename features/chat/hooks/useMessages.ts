import { useEffect, useState } from "react";

import {
  useConvex,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Message } from "@/types/chat";

import {
  getChatCache,
  saveChatCache,
} from "@/lib/cache/chatCache";

type UseMessagesResult = {
  messages: Message[];

  conversationId?: Id<"conversations">;

  currentUserId?: Id<"users">;

  themeIndex: number | null;

  isLoading: boolean;

  loadingMore: boolean;

  loadOlder: () => Promise<void>;
};

export default function useMessages(
  userId: Id<"users">
): UseMessagesResult {
  const convex = useConvex();

  const liveData = useQuery(
    api.messages.index.getMessages,
    {
      userId,
      limit: 30,
    }
  );

  const cachedChat =
    getChatCache(
      String(userId)
    );

  const [messages, setMessages] =
    useState<Message[]>(
      (cachedChat?.messages ??
        []) as Message[]
    );

  const [
    conversationId,
    setConversationId,
  ] = useState<
    Id<"conversations"> | undefined
  >(
  cachedChat
  ?.conversationId &&
cachedChat
  ?.conversationId !==
  "undefined"
  ? (cachedChat.conversationId as Id<"conversations">)
  : undefined
  );

  const [
    themeIndex,
    setThemeIndex,
  ] = useState<number | null>(
    cachedChat
      ?.themeIndex ?? null
  );

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<
    Id<"users"> | undefined
  >(
    cachedChat
      ?.currentUserId as
      | Id<"users">
      | undefined
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !cachedChat?.messages
      ?.length
  );

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const loadInitialMessages =
    async () => {
      const cached =
        getChatCache(
          String(userId)
        );

      if (
        cached?.messages &&
        cached.messages.length > 0
      ) {
        setMessages(
          cached.messages as Message[]
        );

    setConversationId(
  cached
    ?.conversationId &&
  cached
    ?.conversationId !==
    "undefined"
    ? (cached.conversationId as Id<"conversations">)
    : undefined
);
        setCurrentUserId(
          cached.currentUserId as
            | Id<"users">
            | undefined
        );

        setThemeIndex(
          cached.themeIndex ?? 0
        );

        setIsLoading(false);
      }

      try {
        const data =
          await convex.query(
            api.messages.index.getMessages,
            {
              userId,
              limit: 30,
            }
          );

        setConversationId(
          data?.conversationId
        );

       if (
  data?.messages &&
  data.messages.length > 0
) {
  setMessages(
    data.messages as Message[]
  );
}

        setThemeIndex(
          data?.themeIndex ?? 0
        );

        setCurrentUserId(
          data?.currentUserId ??
            undefined
        );

        saveChatCache(
          String(userId),
          {
            messages:
              data?.messages ?? [],

            currentUserId:
              String(
                data?.currentUserId
              ),

          conversationId:
  data?.conversationId,

            themeIndex:
              data?.themeIndex ??
              0,
          }
        );

        setHasMore(
          (data?.messages
            ?.length ?? 0) >=
            30
        );
      } catch {
        console.log(
          "Using cached chat"
        );
      }

      setIsLoading(false);
    };

  useEffect(() => {
    loadInitialMessages();
  }, [userId]);

  useEffect(() => {
    if (!liveData) return;

    setConversationId(
      liveData.conversationId
    );

    setThemeIndex(
      liveData.themeIndex ?? 0
    );

    setCurrentUserId(
      liveData.currentUserId ??
        undefined
    );

    setMessages(
      liveData.messages as Message[]
    );

    saveChatCache(
      String(userId),
      {
        messages:
          liveData.messages,

        currentUserId:
          String(
            liveData.currentUserId
          ),

      conversationId:
  liveData.conversationId,

        themeIndex:
          liveData.themeIndex ??
          0,
      }
    );
  }, [liveData, userId]);

  const loadOlder = async () => {
    if (
      loadingMore ||
      !hasMore
    )
      return;

    const oldest =
      messages[0];

    if (
      !oldest?.createdAt
    )
      return;

    setLoadingMore(true);

    const data =
      await convex.query(
        api.messages.index.getMessages,
        {
          userId,
          limit: 30,
          before:
            oldest.createdAt,
        }
      );

    const older =
      (data?.messages ??
        []) as Message[];

    if (
      older.length < 30
    ) {
      setHasMore(false);
    }

    setMessages((prev) => [
      ...older,
      ...prev,
    ]);

    setLoadingMore(false);
  };

  return {
    messages,

    conversationId,

    currentUserId,

    themeIndex,

    isLoading,

    loadingMore,

    loadOlder,
  };
}