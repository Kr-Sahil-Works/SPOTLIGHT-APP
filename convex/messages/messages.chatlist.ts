import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "../users/users.core";

export const getChatList = query({
  handler: async (ctx) => {
    const currentUser =
      await getAuthenticatedUserQuery(ctx);

    if (!currentUser) {
      return [];
    }

    const conversations =
      await ctx.db
        .query("conversations")
        .collect();

    const myConversations =
      conversations.filter((conversation) =>
        conversation.participants.some(
          (userId) =>
            userId === currentUser._id
        )
      );

    const result = [];

    for (const conversation of myConversations) {
      const otherUserId =
        conversation.participants.find(
          (userId) =>
            userId !== currentUser._id
        );

      if (!otherUserId) {
        continue;
      }

      const user =
        await ctx.db.get(otherUserId);

      if (!user) {
        continue;
      }

      const unreadCount =
        conversation.unreadCounts?.find(
          (entry) =>
            entry.userId === currentUser._id
        )?.count ?? 0;

      result.push({
        userId: user._id,
        fullname: user.fullname,
        image: user.image,

        lastMessage:
          conversation.lastMessage || "",

        createdAt:
          conversation.lastMessageAt ||
          conversation.createdAt,

        unreadCount,

        isOnline:
          !!user.showOnline &&
          !!user.lastActiveAt &&
          Date.now() -
            user.lastActiveAt <
            70000,

        showOnline:
          user.showOnline,
      });
    }

    return result.sort(
      (a, b) =>
        b.createdAt - a.createdAt
    );
  },
});