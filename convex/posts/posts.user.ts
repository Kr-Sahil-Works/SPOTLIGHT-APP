import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "../users/users.core";

/* =========================
   👤 USER POSTS
========================= */
export const getPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args.userId
      ? await ctx.db.get(args.userId)
: await getAuthenticatedUserQuery(ctx);

if (!user) return [];

    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId || user._id)
      )
      .order("desc")
      .take(30);
  },
});