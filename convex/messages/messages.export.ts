import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "../users/users.core";

export const exportChats = query({
  args: {},

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
      conversations.filter((c) =>
        c.participants.includes(
          currentUser._id
        )
      );

    const result =
      await Promise.all(
        myConversations.map(
          async (conversation) => {
            const messages =
              await ctx.db
                .query("messages")
                .withIndex(
                  "by_conversation_time",
                  (q) =>
                    q.eq(
                      "conversationId",
                      conversation._id
                    )
                )
                .collect();

            const participants =
              await Promise.all(
                conversation.participants.map(
                  (id) =>
                    ctx.db.get(id)
                )
              );

            return {
              conversationId:
                conversation._id,

              participants:
                participants.map(
                  (p) => ({
                    id: p?._id,
                    username:
                      p?.username,
                    fullname:
                      p?.fullname,
                  })
                ),

              messages,
            };
          }
        )
      );

    return result;
  },
});