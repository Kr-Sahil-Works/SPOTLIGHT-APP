import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createUserFromWebhook = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullname: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.email.split("@")[0],
      fullname: args.fullname,
      email: args.email,
      image: args.image,

      clerkId: args.clerkId,

      bio: "",
      followers: 0,
      following: 0,
      posts: 0,

      isPrivate: false,
      isOnline: false,
      lastSeen: Date.now(),
      lastActiveAt: Date.now(),
      showOnline: true,

      accountType: "user",
      createdAt: Date.now(),
    });
  },
});