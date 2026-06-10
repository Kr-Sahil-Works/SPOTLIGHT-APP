import { query } from "../_generated/server";

export const getUserRank = query({
  args: {},

  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return null;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex(
        "by_clerk_id",
        (q) =>
          q.eq(
            "clerkId",
            user.subject
          )
      )
      .unique();

    if (!currentUser) {
      return null;
    }

    const users = await ctx.db
      .query("users")
      .collect();

    const rank =
      users.filter(
        (u) =>
          u.createdAt <=
          currentUser.createdAt
      ).length;

    return rank;
  },
});