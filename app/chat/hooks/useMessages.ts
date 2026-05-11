import { useEffect, useState } from "react";

import {
  useConvex,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Message } from "@/types/chat";

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
    userId: userId,
    limit: 30,
  }
);

  const [messages, setMessages] =
    useState<Message[]>([]);
    
    const [conversationId, setConversationId] =
  useState<
    Id<"conversations"> | undefined
  >();

const [themeIndex, setThemeIndex] =
  useState<number | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<Id<"users"> | undefined>();

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const loadInitialMessages =
    async () => {
      setIsLoading(true);

      const data = await convex.query(
        api.messages.index.getMessages,
        {
          userId,
          limit: 30,
        }
      );

    setConversationId(
  data?.conversationId
);

setMessages(
  (data?.messages ?? []) as Message[]
);

      setThemeIndex(
        data?.themeIndex ?? 0
      );

      setCurrentUserId(
        data?.currentUserId ?? undefined
      );

      setHasMore(
        (data?.messages?.length ?? 0) >= 30
      );

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
}, [liveData]);

  const loadOlder = async () => {
    if (loadingMore || !hasMore) return;

    const oldest = messages[0];

    if (!oldest?.createdAt) return;

    setLoadingMore(true);

    const data = await convex.query(
      api.messages.index.getMessages,
      {
        userId,
        limit: 30,
        before: oldest.createdAt,
      }
    );

    const older =
      (data?.messages ?? []) as Message[];

    if (older.length < 30) {
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