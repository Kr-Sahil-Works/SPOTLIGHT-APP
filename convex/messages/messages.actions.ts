import { v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const editMessage = mutation({
  args: { messageId: v.id("messages"), newText: v.string() },
  handler: async (ctx, args) => {
    const text = args.newText.trim();
if (!text) throw new Error("Empty message");
    const user = await getAuthenticatedUser(ctx);
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");
    if (msg.senderId !== user._id) throw new Error("Not allowed");

    if (Date.now() - msg.createdAt > 600000) {
      throw new Error("Edit time expired");
    }

    await ctx.db.patch(args.messageId, {
      text,
      edited: true,
    });
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");

    if (msg.senderId !== user._id) throw new Error("Not allowed");

    if (Date.now() - msg.createdAt > 600000) {
      throw new Error("Delete time expired");
    }

    const conversationId =
  msg.conversationId;

await ctx.db.delete(
  args.messageId
);

const latest =
  await ctx.db
    .query("messages")
    .withIndex(
      "by_conversation_time",
      (q) =>
        q.eq(
          "conversationId",
          conversationId
        )
    )
    .order("desc")
    .first();

await ctx.db.patch(
  conversationId,
  {
    lastMessage:
      latest?.text || "",

    lastMessageAt:
      latest?.createdAt ||
      0,

    lastMessageSenderId:
      latest?.senderId,
  }
);
  },
});

export const sendPushNotification = action({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },

  handler: async (_, args) => {
    console.log(
  "PUSH TITLE",
  args.title
);
  const response = await fetch(
  "https://exp.host/--/api/v2/push/send",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
   body: JSON.stringify({
  to: args.token,

  sound: "default",

title: args.title,
body:
  args.body
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 140),

subtitle:
  "Spotlight",

  data: args.data,

  channelId: "default",

  priority: "high",

  threadId:
    args.data?.userId?.toString(),
    collapseId:
  args.data?.userId?.toString(),

  categoryId: "message",
})
  }
);

const result =
  await response.json();

console.log(
  "PUSH RESULT",
  JSON.stringify(result)
);
  },
});