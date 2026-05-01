import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getUserStats = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    /* =========================
       💬 MESSAGES COUNT
    ========================= */
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();

    /* =========================
       ❤️ LIKES COUNT
    ========================= */
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id)
      )
      .collect();

    /* =========================
       🔖 BOOKMARKS COUNT
    ========================= */
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    /* =========================
       💬 COMMENTS COUNT
    ========================= */
    const comments = await ctx.db
      .query("comments")
      .collect();

    const myComments = comments.filter(
      (c) => c.userId.toString() === user._id.toString()
    );

    return {
      messages: messages.length,
      likes: likes.length,
      bookmarks: bookmarks.length,
      comments: myComments.length,
    };
  },
});