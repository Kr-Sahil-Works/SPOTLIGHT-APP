import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

/* =========================
   ❤️ TOGGLE LIKE
========================= */
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

 if (existing) {
  await ctx.db.delete(existing._id);

  await ctx.db.patch(args.postId, {
    likes: Math.max(0, (post.likes || 0) - 1),
  });

  return false;
}

    await ctx.db.insert("likes", {
      userId: user._id,
      postId: args.postId,
    });
await ctx.db.patch(args.postId, {
  likes: (post.likes || 0) + 1,
});
    if (user._id !== post.userId) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: user._id,
        type: "like",
        isRead: false,
        postId: args.postId,
        createdAt: Date.now(),
      });
    }

    return true;
  },
});