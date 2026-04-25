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
      replyToText: v.optional(v.string()), // 🔥 ADD THIS
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

  replyTo: args.replyTo || undefined,
  replyToText: args.replyToText || undefined, // 🔥 ADD THIS

  reactions: [],
});
    // 🔥 SEND PUSH
const sender = await ctx.db.get(user._id);
const receiver = await ctx.db.get(args.receiverId);

if (receiver?.pushToken && sender) {
  const isInSameChat =
    receiver.activeChatWith?.toString() === user._id.toString();

  if (!isInSameChat) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: receiver.pushToken,
        sound: "default",
        title: sender.fullname,
        body: args.text,
        data: {
          userId: sender._id,
        },
      }),
    });
  }
}
  },
});



export const setTyping = mutation({
  args: {
    receiverId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      user._id.toString(),
      args.receiverId.toString()
    );

    // ⚡ DIRECT lookup (no scan)
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("conversationId", conversationId)
          .eq("userId", user._id)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
      });
      return;
    }

    await ctx.db.insert("typing", {
      conversationId,
      userId: user._id,
      isTyping: args.isTyping,
    });
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

    // ⚡ batch reply fetch (avoid many db calls)
    const replyIds = messages
      .map((m) => m.replyTo)
      .filter(Boolean);

    const replyMap = new Map();

    await Promise.all(
      replyIds.map(async (id) => {
        const msg = await ctx.db.get(id!);
        if (msg) replyMap.set(id, msg.text);
      })
    );

    const enriched = messages.map((m) => ({
      ...m,
      replyToText:
        m.replyToText ||
        (m.replyTo ? replyMap.get(m.replyTo) : undefined),
    }));

    return {
      messages: enriched.reverse(),
      currentUserId: currentUser._id,
    };
  },
});


export const getTyping = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      currentUser._id.toString(),
      args.userId.toString()
    );

    // ⚡ use better index (no full scan)
    const typing = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    return typing.find(
      (t) =>
        t.userId !== currentUser._id &&
        t.isTyping === true
    );
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
    const user = await getAuthenticatedUser(ctx);

    const msg = await ctx.db.get(args.messageId);
    if (!msg) return;

    const reactions = msg.reactions || [];

    const existing = reactions.find(
      (r: any) =>
        r.userId.toString() === user._id.toString() &&
        r.value === args.reaction
    );

    await ctx.db.patch(args.messageId, {
      reactions: existing
        ? reactions.filter(
            (r: any) =>
              !(
                r.userId.toString() === user._id.toString() &&
                r.value === args.reaction
              )
          )
        : [...reactions, { userId: user._id, value: args.reaction }],
    });
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
        // ✅ ADD THESE
  isOnline?: boolean;
  showOnline?: boolean;
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
        isOnline: user.isOnline,
        showOnline: user.showOnline,
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


export const setTheme = mutation({
  args: {
    themeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    await ctx.db.patch(user._id, {
      themeIndex: args.themeIndex,
    });
  },
});

export const setOnlineStatus = mutation({
  args: {
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    await ctx.db.patch(user._id, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });
  },
});

export const toggleOnlineVisibility = mutation({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const current = user.showOnline ?? true;

    await ctx.db.patch(user._id, {
      showOnline: !current,
    });
  },
});

export const saveNote = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    await ctx.db.insert("notes", {
      userId: user._id,
      content: args.content,
      updatedAt: Date.now(),
      order: existing.length,
      pinned: false,
    });
  },
});

export const getNotes = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.order - b.order;
    });
  },
});
export const reorderNotes = mutation({
  args: {
    notes: v.array(
      v.object({
        id: v.id("notes"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const n of args.notes) {
      await ctx.db.patch(n.id, { order: n.order });
    }
  },
});

export const togglePinNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) return;

    await ctx.db.patch(args.id, {
      pinned: !note.pinned,
    });
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const note = await ctx.db.get(args.id);
    if (!note) return;

    // optional safety: only owner can delete
    if (note.userId.toString() !== user._id.toString()) return;

    await ctx.db.delete(args.id);
  },
});



export const setChatTheme = mutation({
  args: {
    userId: v.id("users"),
    themeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    const conversationId = getConversationId(
      current._id.toString(),
      args.userId.toString()
    );

    // ✅ update both users theme
    await ctx.db.patch(current._id, {
      themeIndex: args.themeIndex,
    });

    await ctx.db.patch(args.userId, {
      themeIndex: args.themeIndex,
    });

    // 🔥 INSERT SYSTEM MESSAGE
    await ctx.db.insert("messages", {
      conversationId,
      senderId: current._id,
      receiverId: args.userId,

      text: `${current.fullname} changed the theme`,
      createdAt: Date.now(),

      type: "system",
      systemType: "theme_change",
      meta: {
        themeIndex: args.themeIndex,
      },
    });
  },
});