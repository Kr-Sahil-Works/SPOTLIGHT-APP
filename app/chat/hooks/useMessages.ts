import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/chat";
import { useQuery } from "convex/react";

type UseMessagesResult = {
  messages: Message[];
  currentUserId?: Id<"users">;
  themeIndex: number; // ✅ ADD
  isLoading: boolean;
};

export default function useMessages(
  conversationId: Id<"users">
): UseMessagesResult {
  const data = useQuery(api.messages.index.getMessages, {
    userId: conversationId,
    limit: 20,
  });

  return {
    messages: (data?.messages ?? []) as Message[],
    currentUserId: data?.currentUserId ?? undefined,
    themeIndex: data?.themeIndex ?? 0,
    isLoading: data === undefined,
  };
}