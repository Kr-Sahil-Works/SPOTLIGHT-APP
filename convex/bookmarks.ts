import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   🔖 TOGGLE BOOKMARK (OPTIMIZED)
========================= */
export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("bookmarks", {
      userId: currentUser._id,
      postId: args.postId,
    });

    return true;
  },
});

/* =========================
   📥 GET BOOKMARKS (OPTIMIZED)
========================= */
export const getBookmarkedPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const limit = args.limit ?? 20; // ⚡ prevent overload

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .take(limit); // ⚡ instead of collect()

    // ⚡ batch fetch posts
    const posts = await Promise.all(
      bookmarks.map((b) => ctx.db.get(b.postId))
    );

    // ⚡ remove null (deleted posts)
    return posts.filter(Boolean);
  },
});