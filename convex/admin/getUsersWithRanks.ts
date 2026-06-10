import { query } from "../_generated/server";

export const getUsersWithRanks = query({
  args: {},

  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .collect();

    const sortedUsers =
      users.sort(
        (a, b) =>
          a.createdAt - b.createdAt
      );

    return sortedUsers.map(
      (user, index) => ({
        ...user,
        rank: index + 1,
      })
    );
  },
});