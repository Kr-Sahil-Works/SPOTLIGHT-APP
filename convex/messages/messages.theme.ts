import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const setChatTheme = mutation({
  args: {
    userId: v.id("users"),
    themeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    const participants =
      current._id < args.userId
        ? [current._id, args.userId]
        : [args.userId, current._id];

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q.eq("participants", participants)
      )
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await ctx.db.patch(conversation._id, {
      themeIndex: args.themeIndex,
    });

    await ctx.db.insert("messages", {
      conversationId: conversation._id,
      senderId: current._id,
      receiverId: args.userId,
      text: `${current.fullname} changed the theme`,
      createdAt: Date.now(),
      type: "system",
      systemType: "theme_change",
      meta: { themeIndex: args.themeIndex },
    });
  },
});