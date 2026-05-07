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

  currentUserId?: Id<"users">;

  themeIndex: number | null;

  isLoading: boolean;

  loadingMore: boolean;

  loadOlder: () => Promise<void>;
};

export default function useMessages(
  conversationId: Id<"users">
): UseMessagesResult {
  const convex = useConvex();

  const liveData = useQuery(
  api.messages.index.getMessages,
  {
    userId: conversationId,
    limit: 30,
  }
);

  const [messages, setMessages] =
    useState<Message[]>([]);

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
          userId: conversationId,
          limit: 30,
        }
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
}, [conversationId]);

useEffect(() => {
  if (!liveData) return;

  setThemeIndex(
    liveData.themeIndex ?? 0
  );

  setCurrentUserId(
    liveData.currentUserId ??
      undefined
  );

  setMessages((prev) => {
    const existingIds = new Set(
      prev.map((m) => m._id)
    );

    const fresh =
      liveData.messages.filter(
        (m) =>
          !existingIds.has(m._id)
      );

    if (!fresh.length) {
      return prev;
    }

    return [...prev, ...fresh];
  });
}, [liveData]);

  const loadOlder = async () => {
    if (loadingMore || !hasMore) return;

    const oldest = messages[0];

    if (!oldest?.createdAt) return;

    setLoadingMore(true);

    const data = await convex.query(
      api.messages.index.getMessages,
      {
        userId: conversationId,
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

    currentUserId,

    themeIndex,

    isLoading,

    loadingMore,

    loadOlder,
  };
}