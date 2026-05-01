import { v } from "convex/values";
import { query } from "../_generated/server";

/* =========================
   👤 PROFILE
========================= */
export const getUserProfile = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) throw new Error("User not found");
    return user;
  },
});

/* =========================
   📊 PROFILE STATS
========================= */
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) =>
        q.eq("followingId", args.userId)
      )
      .take(1000);

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) =>
        q.eq("followerId", args.userId)
      )
      .take(1000);

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .take(1000);

    return {
      followers: followers.length,
      following: following.length,
      posts: posts.length,
    };
  },
});