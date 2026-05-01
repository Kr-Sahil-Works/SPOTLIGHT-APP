import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "../_generated/server";

/* =========================
   🔐 AUTH USER
========================= */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .first();

   if (!user) throw new Error("User not found");

  return user!;
}

/* =========================
   👤 CREATE USER
========================= */
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .first();

    if (existing) return;

    const username = args.username.trim().toLowerCase();

    const taken = await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.eq("username", username)
      )
      .first();

    if (taken) throw new Error("Username taken");

    await ctx.db.insert("users", {
      username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
      createdAt: Date.now(),
      isPrivate: false,
    });
  },
});

/* =========================
   👤 GET CURRENT USER
========================= */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .first();

    return user ?? null;
  },
});
