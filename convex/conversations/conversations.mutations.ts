import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users/users.core";

import {
  clearChatInternal,
  deleteChatInternal,
  getOrCreateConversationInternal,
  toggleHiddenInternal,
  toggleMuteInternal,
  togglePinInternal,
} from "./conversations.core";

/* =========================
   💬 CREATE
========================= */
export const createConversation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    return await getOrCreateConversationInternal(
      ctx,
      current._id,
      args.userId
    );
  },
});

/* =========================
   🧹 CLEAR
========================= */
export const clearChat = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await clearChatInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   ❌ DELETE
========================= */
export const deleteChat = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await deleteChatInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   🔕 MUTE
========================= */
export const toggleMute = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await toggleMuteInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   📌 PIN
========================= */
export const togglePin = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await togglePinInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});



/* =========================
   👻 HIDE
========================= */
export const toggleHidden = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await toggleHiddenInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

export const saveContactNumber =
  mutation({
    args: {
      conversationId: v.id(
        "conversations"
      ),

      phone: v.string(),
    },

    handler: async (
      ctx,
      args
    ) => {
      const current =
        await getAuthenticatedUser(
          ctx
        );

      const convo =
        await ctx.db.get(
          args.conversationId
        );

      const existing =
        convo?.contactNumbers ||
        [];

      const filtered =
        existing.filter(
          (c: any) =>
            String(
              c.userId
            ) !==
            String(
              current._id
            )
        );

      await ctx.db.patch(
        args.conversationId,
        {
          contactNumbers: [
            ...filtered,
            {
              userId:
                current._id,
              phone:
                args.phone,
            },
          ],
        }
      );
    },
  });

export const setPinnedMessage =
  mutation({
    args: {
      conversationId:
        v.id(
          "conversations"
        ),

      text:
        v.optional(
          v.string()
        ),

      messageId:
        v.optional(
          v.id(
            "messages"
          )
        ),
        pinnedBy:
  v.optional(
    v.id("users")
  ),
    },

    handler: async (
      ctx,
      args
    ) => {
      await getAuthenticatedUser(
        ctx
      );

      await ctx.db.patch(
        args.conversationId,
        {
          pinnedMessageText:
            args.text,

          pinnedMessageId:
            args.messageId,
            pinnedBy:
  args.pinnedBy,
        }
      );
    },
  });

  export const setContactNumber =
  mutation({
    args: {
      conversationId:
        v.id("conversations"),

      phone:
        v.string(),
    },

    handler: async (
      ctx,
      args
    ) => {
      const current =
        await getAuthenticatedUser(
          ctx
        );

      const conversation =
        await ctx.db.get(
          args.conversationId
        );

      if (!conversation)
        return;

      const existing =
        conversation.contactNumbers ??
        [];

      const filtered =
        existing.filter(
          (c) =>
            String(
              c.userId
            ) !==
            String(
              current._id
            )
        );

      filtered.push({
        userId:
          current._id,

        phone:
          args.phone,
      });

      await ctx.db.patch(
        args.conversationId,
        {
          contactNumbers:
            filtered,
        }
      );
    },
  });