import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   🔖 TOGGLE BOOKMARK
========================= */
export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
const post = await ctx.db.get(args.postId);
if (!post) throw new Error("Post not found");
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

  if (!existing) {
await ctx.db.insert("bookmarks", {
  userId: user._id,
  postId: args.postId,
  createdAt: Date.now(),
});
}

    return true;
  },
});

/* =========================
   📥 GET BOOKMARKED POSTS
========================= */
export const getBookmarkedPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const limit = args.limit ?? 30;

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .order("desc")
      .take(limit);

    if (bookmarks.length === 0) return [];

    // ⚡ batch posts
    const postIds = bookmarks.map(b => b.postId);

    const posts = await Promise.all(
      postIds.map(id => ctx.db.get(id))
    );

    // remove deleted posts safely
    return bookmarks
  .map((b, i) => posts[i])
  .filter(Boolean);
  },
});