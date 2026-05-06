import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ensureUser } from "../users/users.core";

export const setOnlineStatus = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, args) => {
const user = await ensureUser(ctx);

    await ctx.db.patch(user._id, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });
  },
});

export const toggleOnlineVisibility = mutation({
  handler: async (ctx) => {
const user = await ensureUser(ctx);
    await ctx.db.patch(user._id, {
      showOnline: !(user.showOnline ?? true),
    });
  },
});