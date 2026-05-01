import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "./users.core";

export const updateProfile = mutation({
  args: {
    fullname: v.optional(v.string()),
    bio: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const patch: any = {};

    /* 🔥 USERNAME */
    if (args.username !== undefined) {
      const username = args.username.trim().toLowerCase();

      if (!username) throw new Error("Invalid username");

      const taken = await ctx.db
        .query("users")
        .withIndex("by_username", (q) =>
          q.eq("username", username)
        )
        .first();

      if (taken && taken._id !== user._id) {
        throw new Error("Username taken");
      }

      patch.username = username;
    }

    /* 🔥 FULLNAME */
    if (args.fullname !== undefined) {
      const fullname = args.fullname.trim();
      if (!fullname) throw new Error("Invalid name");

      patch.fullname = fullname;
    }

    /* 🔥 BIO */
    if (args.bio !== undefined) {
      patch.bio = args.bio.trim();
    }

    if (Object.keys(patch).length === 0) return;

    await ctx.db.patch(user._id, patch);
  },
});