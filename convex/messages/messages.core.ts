import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { getConversationInternal } from "../conversations/conversations.core";
import { getAuthenticatedUser, getAuthenticatedUserQuery } from "../users/users.core";

export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),

    text: v.string(),

    replyTo: v.optional(
      v.id("messages")
    ),

    replyToText:
      v.optional(
        v.string()
      ),

    clientId:
      v.optional(
        v.string()
      ),
  },

  handler: async (
    ctx,
    args
  ) => {
    if (
      !args.text.trim()
    ) {
      throw new Error(
        "Empty message"
      );
    }

    const current =
      await getAuthenticatedUser(
        ctx
      );


    const conversationId =
      await ctx.runMutation(
        api.conversations
          .index
          .createConversation,
        {
          userId:
            args.receiverId,
        }
      );

      if (args.replyTo) {
  const messages =
    await ctx.db
      .query("messages")
      .withIndex(
        "by_conversation",
        (q) =>
          q.eq(
            "conversationId",
            conversationId
          )
      )
      .collect();

  await Promise.all(
    messages.map((msg) => {
      if (
        msg.receiverId ===
          current._id &&
        msg.senderId ===
          args.receiverId &&
        !msg.seen
      ) {
        return ctx.db.patch(
          msg._id,
          {
            seen: true,
            seenAt:
              Date.now(),
            status:
              "seen",
          }
        );
      }

      return null;
    })
  );
}

    await ctx.db.insert(
      "messages",
      {
        conversationId,

        clientId:
          args.clientId,

        senderId:
          current._id,

        receiverId:
          args.receiverId,

        text: args.text,

        createdAt:
          Date.now(),

        type: "text",

        seen: false,

        status: "sent",

        replyTo:
          args.replyTo,

        replyToText:
          args.replyToText,
      }
    );

    await ctx.db.patch(
      conversationId,
      {
        lastMessage:
          args.text,

        lastMessageAt:
          Date.now(),

        lastMessageSenderId:
          current._id,
      }
    );

    /* 🔔 PUSH */

    const receiver =
      await ctx.db.get(
        args.receiverId
      );

    if (
      receiver?.pushToken
    ) {
  await ctx.scheduler.runAfter(
  0,
  api.messages.index.sendPushNotification,
  {
    token:
      receiver.pushToken,

   title:
  current.fullname,

    body:
      args.text,

    data: {
  userId:
    current._id,

  senderName:
    current.fullname,

  senderImage:
    current.image,
},
  }
);
    }
  },
});

export const markAsDelivered = mutation({
  args: {
    userId: v.id("users"),
  },

handler: async (ctx, args) => {

  const identity =
    await ctx.auth.getUserIdentity();

  if (!identity) {
    return;
  }

  const user =
    await getAuthenticatedUser(ctx);

    const conversationId =
      await ctx.runMutation(
        api.conversations.index
          .createConversation,
        {
          userId: args.userId,
        }
      );

    const messages = await ctx.db
      .query("messages")
      .withIndex(
        "by_conversation",
        (q) =>
          q.eq(
            "conversationId",
            conversationId
          )
      )
      .order("desc")
      .take(200);

    await Promise.all(
      messages.map((msg) => {
        if (
          msg.receiverId ===
            user._id &&
          msg.status === "sent"
        ) {
          return ctx.db.patch(
            msg._id,
            {
              status:
                "delivered",
            }
          );
        }

        return null;
      })
    );
  },
});

export const markAsSeen = mutation({
  args: { userId: v.id("users") },
handler: async (ctx, args) => {

  const identity =
    await ctx.auth.getUserIdentity();

  if (!identity) {
    return;
  }

  const user =
    await getAuthenticatedUser(ctx);

 const conversationId = await ctx.runMutation(
api.conversations.index.createConversation,
  { userId: args.userId }
);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(200);

    await Promise.all(
 messages.map((msg) => {
  if (
    msg.receiverId === user._id &&
    !msg.seen &&
    msg.senderId === args.userId
  ) {
    return ctx.db.patch(
  msg._id,
  {
    seen: true,
    seenAt: Date.now(),
    status: "seen",
  }
);
  }
  return null;
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
    const currentUser =
      await getAuthenticatedUserQuery(ctx);

    if (!currentUser) {
      return {
        messages: [],
        currentUserId: null,
        nextCursor: null,
      };
    }

    const conversation =
      await getConversationInternal(
        ctx,
        currentUser._id,
        args.userId
      );

    if (!conversation) {
      return {
        messages: [],
        currentUserId:
          currentUser._id,
        nextCursor: null,
      };
    }

    const limit = args.limit ?? 30;

    let q = ctx.db
      .query("messages")
      .withIndex(
        "by_conversation_time",
        (qq) =>
          qq.eq(
            "conversationId",
            conversation._id
          )
      )
      .order("desc");

    if (args.before) {
      q = q.filter((qq) =>
        qq.lt(
          qq.field("createdAt"),
          args.before!
        )
      );
    }

    const messages =
      await q.take(limit);


      const enriched = await Promise.all(
  messages.map(async (m) => {
    const sender = await ctx.db.get(
      m.senderId
    );

    return {
      ...m,
      senderImage: sender?.image || "",
    };
  })
);

    const nextCursor =
      messages.length > 0
        ? messages[
            messages.length - 1
          ].createdAt
        : null;

    return {
      messages: enriched.reverse(),

      conversationId:
  conversation._id,

      currentUserId:
        currentUser._id,

      nextCursor,

      themeIndex:
        conversation.themeIndex ?? 0,
    };
  },
});

