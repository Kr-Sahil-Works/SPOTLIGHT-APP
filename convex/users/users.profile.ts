import { v } from "convex/values";
import { query } from "../_generated/server";

/* =========================
   📊 PROFILE STATS (OPTIMIZED)
========================= */
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = args.userId;

    /* 👥 FOLLOWERS */
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) =>
        q.eq("followingId", userId)
      )
      .take(1000); // 🔥 limit instead of collect

    /* ➕ FOLLOWING */
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) =>
        q.eq("followerId", userId)
      )
      .take(1000);

    /* 📝 POSTS */
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId)
      )
      .take(1000);

    const postIds = posts.map((p) => p._id);

    /* ❤️ LIKES (ONLY RELEVANT) */
    let likesCount = 0;

    for (const postId of postIds) {
      const likes = await ctx.db
        .query("likes")
        .withIndex("by_post", (q) =>
          q.eq("postId", postId)
        )
        .take(1000);

      likesCount += likes.length;
    }

    /* 💬 COMMENTS (ONLY RELEVANT) */
    let commentsCount = 0;

    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_post", (q) =>
          q.eq("postId", postId)
        )
        .take(1000);

      commentsCount += comments.length;
    }

    /* 📩 MESSAGES SENT */
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) =>
        q.eq("senderId", userId)
      )
      .take(1000);

    return {
      posts: posts.length,
      followers: followers.length,
      following: following.length,
      likes: likesCount,
      comments: commentsCount,
      messages: messages.length,
    };
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return user;
  },
});