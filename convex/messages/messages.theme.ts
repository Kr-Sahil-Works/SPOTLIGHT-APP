import { v } from "convex/values";

import { mutation } from "../_generated/server";

import { getAuthenticatedUser } from "../users";

export const setChatTheme = mutation({
  args: {
    userId: v.id("users"),
    themeIndex: v.number(),
  },

  handler: async (ctx, args) => {
    const current =
      await getAuthenticatedUser(ctx);

    const participants =
      current._id < args.userId
        ? [current._id, args.userId]
        : [args.userId, current._id];

    const conversation =
      await ctx.db
        .query("conversations")
        .withIndex(
          "by_participants",
          (q) =>
            q.eq(
              "participants",
              participants
            )
        )
        .first();

    if (!conversation) {
      throw new Error(
        "Conversation not found"
      );
    }

    // ✅ UPDATE THEME
    await ctx.db.patch(
      conversation._id,
      {
        themeIndex: args.themeIndex,
      }
    );

    // ✅ LAST SYSTEM MESSAGE
    const latest = await ctx.db
      .query("messages")
      .withIndex(
        "by_conversation_time",
        (q) =>
          q.eq(
            "conversationId",
            conversation._id
          )
      )
      .order("desc")
      .first();

    const oneMinuteAgo =
      Date.now() - 60_000;

    // ✅ MERGE WITH PREVIOUS
    if (
      latest &&
      latest.type === "system" &&
      latest.systemType ===
        "theme_change" &&
      latest.senderId ===
        current._id &&
      latest.createdAt >
        oneMinuteAgo
    ) {
      await ctx.db.patch(
        latest._id,
        {
          systemCount:
            (latest.systemCount ?? 1) +
            1,

          createdAt: Date.now(),

          meta: {
            themeIndex:
              args.themeIndex,
          },

          text: `${current.fullname} changed the theme`,
        }
      );

      return;
    }

    // ✅ CREATE NEW SYSTEM EVENT
    await ctx.db.insert("messages", {
      conversationId:
        conversation._id,

      senderId: current._id,

      receiverId: args.userId,

      text: `${current.fullname} changed the theme`,

      createdAt: Date.now(),

      type: "system",

      systemType: "theme_change",

      systemCount: 1,

      meta: {
        themeIndex:
          args.themeIndex,
      },
    });
  },
});