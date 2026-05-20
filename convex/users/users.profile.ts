import { v } from "convex/values";
import { query } from "../_generated/server";

/* =========================
   📊 PROFILE STATS
========================= */
export const getUserStats = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const userId = args.userId;

    /* =========================
       👥 FOLLOWERS
    ========================= */

    const followers =
      await ctx.db
        .query("follows")
        .withIndex(
          "by_following",
          (q) =>
            q.eq(
              "followingId",
              userId
            )
        )
        .collect();

    /* =========================
       ➕ FOLLOWING
    ========================= */

    const following =
      await ctx.db
        .query("follows")
        .withIndex(
          "by_follower",
          (q) =>
            q.eq(
              "followerId",
              userId
            )
        )
        .collect();

    /* =========================
       📝 POSTS
    ========================= */

    const posts =
      await ctx.db
        .query("posts")
        .withIndex(
          "by_user",
          (q) =>
            q.eq(
              "userId",
              userId
            )
        )
        .collect();

    const postIds = posts.map(
      (p) => p._id
    );

    /* =========================
       ❤️ LIKES
    ========================= */

    const likesResults =
      await Promise.all(
        postIds.map((postId) =>
          ctx.db
            .query("likes")
            .withIndex(
              "by_post",
              (q) =>
                q.eq(
                  "postId",
                  postId
                )
            )
            .collect()
        )
      );

    const likesCount =
      likesResults.reduce(
        (acc, cur) =>
          acc + cur.length,
        0
      );

    /* =========================
       💬 COMMENTS
    ========================= */

    const commentsResults =
      await Promise.all(
        postIds.map((postId) =>
          ctx.db
            .query("comments")
            .withIndex(
              "by_post",
              (q) =>
                q.eq(
                  "postId",
                  postId
                )
            )
            .collect()
        )
      );

    const commentsCount =
      commentsResults.reduce(
        (acc, cur) =>
          acc + cur.length,
        0
      );

    /* =========================
       📩 MESSAGES
    ========================= */

    const messages =
      await ctx.db
        .query("messages")
        .withIndex(
          "by_sender",
          (q) =>
            q.eq(
              "senderId",
              userId
            )
        )
        .collect();

    /* =========================
       ✅ RETURN
    ========================= */

    return {
      posts: posts.length,

      followers:
        followers.length,

      following:
        following.length,

      likes: likesCount,

      comments:
        commentsCount,

      messages:
        messages.length,
    };
  },
});

/* =========================
   👤 GET USER
========================= */

export const getUser = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const user =
      await ctx.db.get(
        args.userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return user;
  },
});