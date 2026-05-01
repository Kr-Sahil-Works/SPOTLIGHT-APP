import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const setChatTheme = mutation({
  args: {
    userId: v.id("users"),
    themeIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    const conversationId = await ctx.runMutation(
      api.conversations.getOrCreateConversation,
      { userId: args.userId }
    );

    await ctx.db.patch(conversationId, {
      themeIndex: args.themeIndex,
    });

    await ctx.db.insert("messages", {
      conversationId,
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