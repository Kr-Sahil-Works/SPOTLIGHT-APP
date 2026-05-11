import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import {
  getAuthenticatedUser,
  getAuthenticatedUserQuery,
} from "../users/users.core";

export const setTyping = mutation({
  args: {
    receiverId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const conversationId = await ctx.runMutation(
    api.conversations.index.createConversation,
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

    await ctx.db.insert("typing", {
      conversationId,
      userId: user._id,
      isTyping: args.isTyping,
      updatedAt: Date.now(),
    });
  },
});

export const getTyping = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUserQuery(ctx);
    if (!currentUser) return null;

    const typingList = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const now = Date.now();

const active = typingList.find(
  (t) =>
    t.userId !== currentUser._id &&
    t.isTyping &&
    t.updatedAt &&
    now - t.updatedAt < 5000
);

if (!active) return null;

const user = await ctx.db.get(
  active.userId
);

return {
  ...active,
  user,
};
  },
});