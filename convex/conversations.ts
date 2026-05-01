import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   🔥 INTERNAL HELPER
========================= */
export async function getOrCreateConversationInternal(
  ctx: any,
  currentUserId: string,
  otherUserId: string
) {
  const participants = [currentUserId, otherUserId].sort();

  // ✅ stable key (fix duplicate conversations)
  const conversationKey = participants.join("_");

  const existing = await ctx.db
    .query("conversations")
    .withIndex("by_key", (q: any) =>
      q.eq("conversationKey", conversationKey)
    )
    .first();

  if (existing) return existing._id;

  return await ctx.db.insert("conversations", {
    participants,
    conversationKey, // ✅ required
    createdAt: Date.now(),
  });
}

/* =========================
   🔥 PUBLIC CREATE
========================= */
export const getOrCreateConversation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    const participants = [current._id, args.userId].sort();

    // ✅ same stable key
    const conversationKey = participants.join("_");

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_key", (q: any) =>
        q.eq("conversationKey", conversationKey)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participants,
      conversationKey,
      createdAt: Date.now(),
    });
  },
});

/* =========================
   🔍 GET CONVERSATION
========================= */
export async function getConversationInternal(
  ctx: any,
  currentUserId: string,
  otherUserId: string
) {
  const participants = [currentUserId, otherUserId].sort();

  const conversationKey = participants.join("_");

  return await ctx.db
    .query("conversations")
    .withIndex("by_key", (q: any) =>
      q.eq("conversationKey", conversationKey)
    )
    .first();
}