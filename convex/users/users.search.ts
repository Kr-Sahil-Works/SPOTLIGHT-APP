import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserQuery } from "./users.core";

export const searchUsers = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUserQuery(ctx);
    if (!currentUser) return [];

    const s = args.search.toLowerCase().trim();
    if (!s) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.gte("username", s).lt("username", s + "z")
      )
      .take(15);

    return users
      .filter((u) => u._id !== currentUser._id && !u.isDeleted)
      .map((u) => ({
        _id: u._id,
        username: u.username,
        fullname: u.fullname,
        image: u.image,
      }));
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUserQuery(ctx);
    if (!currentUser) return [];

    const users = await ctx.db
      .query("users")
      .take(20);

    return users
      .filter((u) => u._id !== currentUser._id && !u.isDeleted)
      .map((u) => ({
        _id: u._id,
        username: u.username,
        fullname: u.fullname,
        image: u.image,
      }));
  },
});