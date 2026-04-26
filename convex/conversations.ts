import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* 🔥 INTERNAL HELPER (WORKS IN BOTH) */
export async function getOrCreateConversationInternal(
  ctx: any,
  currentUserId: string,
  otherUserId: string
) {
  const participants = [currentUserId, otherUserId].sort();

  const existing = await ctx.db
    .query("conversations")
   .withIndex("by_participants", (q: any) =>
      q.eq("participants", participants)
    )
    .first();

  if (existing) return existing._id;

  return await ctx.db.insert("conversations", {
    participants,
    createdAt: Date.now(),
  });
}

/* 🔥 OPTIONAL PUBLIC (if needed) */
export const getOrCreateConversation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    const participants = [current._id, args.userId].sort();

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q: any) =>
        q.eq("participants", participants)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participants,
      createdAt: Date.now(),
    });
  },
});

export async function getConversationInternal(
  ctx: any,
  currentUserId: string,
  otherUserId: string
) {
  const participants = [currentUserId, otherUserId].sort();

  return await ctx.db
    .query("conversations")
    .withIndex("by_participants", (q: any) =>
      q.eq("participants", participants)
    )
    .first();
}