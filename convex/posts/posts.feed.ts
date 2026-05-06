import { v } from "convex/values";
import { query } from "../_generated/server";

/* =========================
   🧠 FEED
========================= */
export const getFeedPosts = query({
  args: {
    limit: v.optional(v.number()),
    refreshKey: v.optional(v.number()), // ✅ add this
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(limit);

    if (posts.length === 0) return [];

    // 🔥 OPTIONAL: shuffle on refresh
    if (args.refreshKey) {
      posts = [...posts].sort(() => Math.random() - 0.5);
    }

    const userIds = [...new Set(posts.map(p => p.userId))];

    const users = await Promise.all(
      userIds.map(id => ctx.db.get(id))
    );

    const userMap = new Map(
      users.map(u => [u?._id.toString(), u])
    );

    return posts.map(post => {
      const author = userMap.get(post.userId.toString());

      return {
        ...post,
        author: {
          _id: author?._id,
          username: author?.username || "user",
          image: author?.image || "",
        },
      };
    });
  },
});