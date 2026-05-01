import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { getConversationInternal } from "../conversations";
import { getAuthenticatedUser } from "../users";

export const setTyping = mutation({
  args: {
    receiverId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const conversationId = await ctx.runMutation(
      api.conversations.getOrCreateConversation,
      { userId: args.receiverId }
    );

    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q.eq("conversationId", conversationId).eq("userId", user._id)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
      return;
    }

    await ctx.db
  .query("typing")
  .withIndex("by_user_conversation", (q) =>
    q.eq("conversationId", conversationId).eq("userId", user._id)
  )
  .first();

    await ctx.db.insert("typing", {
      conversationId,
      userId: user._id,
      isTyping: args.isTyping,
      updatedAt: Date.now(),
    });
  },
});

export const getTyping = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversation = await getConversationInternal(
      ctx,
      currentUser._id.toString(),
      args.userId.toString()
    );

    if (!conversation) return null;

    const typingList = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .take(10);

    const now = Date.now();

    return typingList.find(
      (t) =>
        t.userId !== currentUser._id &&
        t.isTyping &&
        t.updatedAt &&
        now - t.updatedAt < 5000
    );
  },
});