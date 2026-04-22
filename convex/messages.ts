import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* 🔥 helper */
function getConversationId(a: string, b: string) {
  return [a, b].sort().join("_");
}

/* =========================
   ✅ SEND MESSAGE
========================= */
export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    text: v.string(),
    replyTo: v.optional(v.id("messages")), // 🔥 NEW
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      user._id.toString(),
      args.receiverId.toString()
    );

    await ctx.db.insert("messages", {
      conversationId,
      senderId: user._id,
      receiverId: args.receiverId,
      text: args.text.trim(),
      createdAt: Date.now(),
      seen: false,
      replyTo: args.replyTo, // ✅ NEW
      reactions: [], // ✅ NEW
    });
    // 🔥 SEND PUSH
const sender = await ctx.db.get(user._id);
const receiver = await ctx.db.get(args.receiverId);

if (receiver?.pushToken && sender) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: receiver.pushToken,
      sound: "default",

      // 🔥 Instagram style
      title: sender.fullname,
      body: args.text,

      // 🔥 deep link
      data: {
        userId: sender._id,
      },

      // 🔥 Android large icon
      icon: sender.image,
    }),
  });
}
  },
});

/* =========================
   👀 MARK AS SEEN
========================= */
export const markAsSeen = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      currentUser._id.toString(),
      args.userId.toString()
    );

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    await Promise.all(
      messages.map((msg) => {
        if (
          msg.receiverId === currentUser._id &&
          !msg.seen
        ) {
          return ctx.db.patch(msg._id, { seen: true });
        }
      })
    );
  },
});

/* =========================
   💬 GET MESSAGES
========================= */
export const getMessages = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      currentUser._id.toString(),
      args.userId.toString()
    );

    const limit = args.limit ?? 30;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(limit);

    return {
      messages: messages.reverse(),
      currentUserId: currentUser._id,
    };
  },
});

/* =========================
   ❤️ REACTIONS
========================= */
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    reaction: v.string(),
  },
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.messageId);
    if (!msg) return;

    const reactions = msg.reactions || [];

    const exists = reactions.includes(args.reaction);

    await ctx.db.patch(args.messageId, {
      reactions: exists
        ? reactions.filter((r) => r !== args.reaction)
        : [...reactions, args.reaction],
    });
  },
});

/* =========================
   ⌨️ TYPING SYNC
========================= */
export const setTyping = mutation({
  args: {
    to: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user_pair", (q) =>
        q.eq("from", user._id).eq("to", args.to)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
      });
    } else {
      await ctx.db.insert("typing", {
        from: user._id,
        to: args.to,
        isTyping: args.isTyping,
      });
    }
  },
});

export const getTyping = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const typing = await ctx.db
      .query("typing")
      .withIndex("by_user_pair", (q) =>
        q.eq("from", args.userId).eq("to", currentUser._id)
      )
      .first();

    return typing?.isTyping || false;
  },
});

/* =========================
   💬 CHAT LIST
========================= */
export const getChatList = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const messages = await ctx.db.query("messages").collect();

    const latestMap = new Map<string, (typeof messages)[0]>();

    for (const msg of messages) {
      if (
        msg.senderId !== currentUser._id &&
        msg.receiverId !== currentUser._id
      )
        continue;

      const otherUserId =
        msg.senderId === currentUser._id
          ? msg.receiverId
          : msg.senderId;

      const key = otherUserId.toString();

      if (
        !latestMap.has(key) ||
        latestMap.get(key)!.createdAt < msg.createdAt
      ) {
        latestMap.set(key, msg);
      }
    }

    const result: {
      userId: Id<"users">;
      fullname: string;
      image: string;
      lastMessage: string;
      createdAt: number;
      unreadCount: number;
    }[] = [];

    for (const [_, latestMsg] of latestMap.entries()) {
      const otherUserId =
        latestMsg.senderId === currentUser._id
          ? latestMsg.receiverId
          : latestMsg.senderId;

      const user = await ctx.db.get(otherUserId);
      if (!user) continue;

      let unreadCount = 0;

      for (const msg of messages) {
        if (
          msg.senderId === otherUserId &&
          msg.receiverId === currentUser._id &&
          !msg.seen
        ) {
          unreadCount++;
        }
      }

      result.push({
        userId: user._id,
        fullname: user.fullname,
        image: user.image,
        lastMessage: latestMsg.text,
        createdAt: latestMsg.createdAt,
        unreadCount,
      });
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  },
});


/* ✅ EDIT MESSAGE (10 MIN LIMIT) */
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    newText: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const msg = await ctx.db.get(args.messageId);

    if (!msg) throw new Error("Message not found");

    // ❗ only sender can edit
    if (msg.senderId !== user._id) throw new Error("Not allowed");

    // ❗ 10 min limit
    const TEN_MIN = 10 * 60 * 1000;
    if (Date.now() - msg.createdAt > TEN_MIN) {
      throw new Error("Edit time expired");
    }

    await ctx.db.patch(args.messageId, {
      text: args.newText,
      edited: true,
    });
  },
});

/* ✅ DELETE MESSAGE (10 MIN LIMIT) */
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const msg = await ctx.db.get(args.messageId);

    if (!msg) return;

    if (msg.senderId !== user._id) throw new Error("Not allowed");

    const TEN_MIN = 10 * 60 * 1000;
    if (Date.now() - msg.createdAt > TEN_MIN) {
      throw new Error("Delete time expired");
    }

    await ctx.db.delete(args.messageId);
  },
});