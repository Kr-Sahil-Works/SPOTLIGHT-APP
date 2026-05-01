import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUser } from "./users.core";

export const searchUsers = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const s = args.search.toLowerCase();

    if (!s) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.gte("username", s).lt("username", s + "z")
      )
      .take(15);

    return users
      .filter((u) => u._id !== currentUser._id)
      .map((u) => ({
        _id: u._id,
        username: u.username,
        fullname: u.fullname,
        image: u.image,
      }));
  },
});