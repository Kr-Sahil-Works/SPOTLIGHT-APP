import { v } from "convex/values";

import {
  mutation,
} from "../_generated/server";

import {
  getAuthenticatedUser,
} from "../users";

export const togglePin =
  mutation({
    args: {
      messageId:
        v.id("messages"),
    },

    handler: async (
      ctx,
      args
    ) => {
      await getAuthenticatedUser(
        ctx
      );

      const msg =
        await ctx.db.get(
          args.messageId
        );

      if (!msg) return;

      const conversation =
        await ctx.db.get(
          msg.conversationId
        );

      if (!conversation)
        return;

      /* UNPIN */
      if (
        conversation.pinnedMessageId ===
        msg._id
      ) {
        await ctx.db.patch(
          conversation._id,
          {
            pinnedMessageId:
              undefined,

            pinnedMessageText:
              undefined,

            pinnedAt:
              undefined,
          }
        );

        return;
      }

      /* PIN */
      await ctx.db.patch(
        conversation._id,
        {
          pinnedMessageId:
            msg._id,

          pinnedMessageText:
            msg.text,

          pinnedAt:
            Date.now(),
        }
      );
    },
  });