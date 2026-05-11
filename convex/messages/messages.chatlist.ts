import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "../users/users.core";

export const getChatList = query({
  handler: async (ctx) => {
const currentUser = await getAuthenticatedUserQuery(ctx);
if (!currentUser) return [];

    const conversations =
  await ctx.db
    .query("conversations")
    .collect();

    const myConversations = conversations.filter((c) =>
      c.participants.some(
        (p) => p === currentUser._id
      )
    );

    const result = [];

    for (const conv of myConversations) {
      const otherUserId = conv.participants.find(
        (p) => p !== currentUser._id
      );

      if (!otherUserId) continue;

      const user = await ctx.db.get(otherUserId);
      if (!user) continue;

const lastMessages = await ctx.db
  .query("messages")
  .withIndex("by_conversation_time", (q) =>
    q.eq("conversationId", conv._id)
  )
  .order("desc")
  .take(30);

const unreadCount = lastMessages.filter(
  (m) =>
    m.receiverId === currentUser._id &&
    !m.seen &&
    m.senderId === otherUserId
).length;

      result.push({
        userId: user._id,
        fullname: user.fullname,
        image: user.image,
        lastMessage: conv.lastMessage || "",
        createdAt: conv.lastMessageAt || conv.createdAt,
        unreadCount,
        isOnline:
  !!user.showOnline &&
  !!user.lastActiveAt &&
  Date.now() -
    user.lastActiveAt <
    45000,
        showOnline: user.showOnline,
      });
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  },
});