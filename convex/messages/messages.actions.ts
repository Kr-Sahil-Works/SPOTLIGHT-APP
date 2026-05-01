import { v } from "convex/values";
import { mutation } from "../_generated/server";
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

    await ctx.db.delete(args.messageId);
  },
});