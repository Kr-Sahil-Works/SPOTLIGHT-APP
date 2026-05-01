import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

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
      : await getAuthenticatedUser(ctx);

    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId || user._id)
      )
      .order("desc")
      .take(30);
  },
});