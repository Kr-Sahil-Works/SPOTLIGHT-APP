import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { getConversationInternal } from "../conversations";
import { getAuthenticatedUser } from "../users";

export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    text: v.string(),
    replyTo: v.optional(v.id("messages")),
    replyToText: v.optional(v.string()),
    clientId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.text.trim()) throw new Error("Empty message");
    const current = await getAuthenticatedUser(ctx);

    const conversationId = await ctx.runMutation(
      api.conversations.getOrCreateConversation,
      { userId: args.receiverId }
    );

    await ctx.db.insert("messages", {
      conversationId,
      clientId: args.clientId,
      senderId: current._id,
      receiverId: args.receiverId,
      text: args.text,
      createdAt: Date.now(),
      type: "text",
      seen: false,
      replyTo: args.replyTo,
      replyToText: args.replyToText,
    });

    await ctx.db.patch(conversationId, {
      lastMessage: args.text,
      lastMessageAt: Date.now(),
    });
  },
});

export const markAsSeen = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const conversationId = await ctx.runMutation(
      api.conversations.getOrCreateConversation,
      { userId: args.userId }
    );

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(50);

    await Promise.all(
      messages.map((msg) => {
  if (
    msg.receiverId === user._id &&
    !msg.seen &&
    msg.senderId === args.userId
  ) {
    return ctx.db.patch(msg._id, { seen: true });
  }
})
    );
  },
});

export const getMessages = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    before: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversation = await getConversationInternal(
      ctx,
      currentUser._id.toString(),
      args.userId.toString()
    );

    if (!conversation) {
      return { messages: [], currentUserId: currentUser._id, nextCursor: null };
    }

    const limit = args.limit ?? 30;

    let q = ctx.db
      .query("messages")
      .withIndex("by_conversation_time", (qq) =>
        qq.eq("conversationId", conversation._id)
      )
      .order("desc");

    if (args.before) {
      q = q.filter((qq) =>
        qq.lt(qq.field("createdAt"), args.before!)
      );
    }

    const messages = await q.take(limit);

    const nextCursor =
      messages.length > 0
        ? messages[messages.length - 1].createdAt
        : null;

    return {
      messages: messages.reverse(),
      currentUserId: currentUser._id,
      nextCursor,
      themeIndex: conversation.themeIndex ?? 0,
    };
  },
});