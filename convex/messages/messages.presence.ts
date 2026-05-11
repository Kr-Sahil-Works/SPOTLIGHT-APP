import { v } from "convex/values";

import { mutation } from "../_generated/server";

export const setOnlineStatus =
  mutation({
    args: {
      isOnline:
        v.boolean(),
    },

    handler: async (
      ctx,
      args
    ) => {
      const identity =
        await ctx.auth.getUserIdentity();

      // logout race condition
      if (!identity) {
        return;
      }

      const user =
        await ctx.db
          .query("users")
          .withIndex(
            "by_clerk_id",
            (q) =>
              q.eq(
                "clerkId",
                identity.subject
              )
          )
          .first();

      if (!user) {
        return;
      }

    await ctx.db.patch(
  user._id,
{
  isOnline:
    args.isOnline,

  lastActiveAt:
    Date.now(),

  ...(args.isOnline
    ? {}
    : {
        lastSeen:
          Date.now(),
      }),
}
);
    },
  });

export const toggleOnlineVisibility =
  mutation({
    handler: async (
      ctx
    ) => {
      const identity =
        await ctx.auth.getUserIdentity();

      if (!identity) {
        return;
      }

      const user =
        await ctx.db
          .query("users")
          .withIndex(
            "by_clerk_id",
            (q) =>
              q.eq(
                "clerkId",
                identity.subject
              )
          )
          .first();

      if (!user) {
        return;
      }

      await ctx.db.patch(
        user._id,
        {
          showOnline:
            !(
              user.showOnline ??
              true
            ),
        }
      );
    },
  });