import { query } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const getChatList = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversations = await ctx.db.query("conversations").take(100);

    const myConversations = conversations.filter((c) =>
      c.participants.some(
        (p) => p.toString() === currentUser._id.toString()
      )
    );

    const result = [];

    for (const conv of myConversations) {
      const otherUserId = conv.participants.find(
        (p) => p.toString() !== currentUser._id.toString()
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
  .take(20);

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
        isOnline: user.isOnline,
        showOnline: user.showOnline,
      });
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  },
});