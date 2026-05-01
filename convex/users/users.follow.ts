import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthenticatedUser } from "./users.core";

/* =========================
   🔁 TOGGLE FOLLOW
========================= */
export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser._id === args.followingId) {
      throw new Error("Cannot follow yourself");
    }

    const target = await ctx.db.get(args.followingId);
    if (!target) throw new Error("User not found");

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();

    // 🔥 UNFOLLOW
    if (existing) {
      await ctx.db.delete(existing._id);

      // ✅ update counters
      await ctx.db.patch(currentUser._id, {
        following: Math.max(0, currentUser.following - 1),
      });

      await ctx.db.patch(args.followingId, {
        followers: Math.max(0, (target.followers || 0) - 1),
      });

      return "unfollowed";
    }

    // 🔒 PRIVATE → REQUEST
    if (target.isPrivate) {
      const req = await ctx.db
        .query("followRequests")
        .withIndex("by_sender_receiver", (q) =>
          q.eq("senderId", currentUser._id).eq("receiverId", args.followingId)
        )
        .first();

      if (!req) {
        await ctx.db.insert("followRequests", {
          senderId: currentUser._id,
          receiverId: args.followingId,
          createdAt: Date.now(),
        });
      }

      return "requested";
    }

    // 🔥 FOLLOW
    await ctx.db.insert("follows", {
      followerId: currentUser._id,
      followingId: args.followingId,
      createdAt: Date.now(),
    });

    // ✅ update counters
    await ctx.db.patch(currentUser._id, {
      following: currentUser.following + 1,
    });

    await ctx.db.patch(args.followingId, {
      followers: (target.followers || 0) + 1,
    });

    return "followed";
  },
});

/* =========================
   ✅ ACCEPT REQUEST
========================= */
export const acceptFollowRequest = mutation({
  args: { requestId: v.id("followRequests") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const req = await ctx.db.get(args.requestId);
    if (!req || req.receiverId !== user._id) return;

    await ctx.db.insert("follows", {
      followerId: req.senderId,
      followingId: user._id,
      createdAt: Date.now(),
    });

    // ✅ update counters
    const sender = await ctx.db.get(req.senderId);

    await ctx.db.patch(req.senderId, {
      following: (sender?.following || 0) + 1,
    });

    await ctx.db.patch(user._id, {
      followers: user.followers + 1,
    });

    await ctx.db.delete(args.requestId);
  },
});

/* =========================
   ❌ REJECT REQUEST
========================= */
export const rejectFollowRequest = mutation({
  args: { requestId: v.id("followRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.requestId);
  },
});

/* =========================
   👀 IS FOLLOWING
========================= */
export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id)
         .eq("followingId", args.followingId)
      )
      .first();

    return !!follow;
  },
});