import { v } from "convex/values";
import {
  mutation,
  query,
} from "./_generated/server";

export const submitScore = mutation({
  args: {
    score: v.number(),
  },

  handler: async (ctx, args) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId =
      identity.subject;

    const existing =
      await ctx.db
        .query("treeScores")
        .withIndex(
          "by_user",
          (q) =>
            q.eq(
              "userId",
              userId
            )
        )
        .unique();

    if (
      existing &&
      existing.score >= args.score
    ) {
      return;
    }

    const user =
      await ctx.db
        .query("users")
        .filter((q) =>
          q.eq(
            q.field("clerkId"),
            userId
          )
        )
        .first();

    if (!user) return;

    if (existing) {
      await ctx.db.patch(
        existing._id,
        {
          score: args.score,
        }
      );
    } else {
      await ctx.db.insert(
        "treeScores",
        {
          userId,
          fullname:
            user.fullname,
          image:
            user.image,
          score:
            args.score,
        }
      );
    }

    const allScores =
  await ctx.db
    .query("treeScores")
    .collect();

const sorted =
  allScores.sort(
    (a, b) =>
      b.score - a.score
  );

const toDelete =
  sorted.slice(10);

for (const item of toDelete) {
  await ctx.db.delete(
    item._id
  );
}
  },
});

export const getTopScores = query({
  handler: async (ctx) => {
    const scores =
      await ctx.db
        .query("treeScores")
        .collect();

    return scores
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(0, 10);
  },
});

export const getMyBestScore = query({
  handler: async (ctx) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity)
      return 0;

    const score =
      await ctx.db
        .query("treeScores")
        .withIndex(
          "by_user",
          (q) =>
            q.eq(
              "userId",
              identity.subject
            )
        )
        .unique();

    return score?.score ?? 0;
  },
});