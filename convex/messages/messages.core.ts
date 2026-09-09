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

    const now =
      Date.now();

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
          now,

        type: "text",

        seen: false,

        status: "sent",

        replyTo:
          args.replyTo,

        replyToText:
          args.replyToText,
      }
    );

    const conversation =
      await ctx.db.get(
        conversationId
      );

    const unreadCounts =
      conversation?.unreadCounts
        ? [...conversation.unreadCounts]
        : [];

    const receiverUnreadIndex =
      unreadCounts.findIndex(
        (item) =>
          item.userId ===
          args.receiverId
      );

    if (
      receiverUnreadIndex >= 0
    ) {
      unreadCounts[
        receiverUnreadIndex
      ] = {
        userId:
          args.receiverId,
        count:
          unreadCounts[
            receiverUnreadIndex
          ].count + 1,
      };
    } else {
      unreadCounts.push({
        userId:
          args.receiverId,
        count: 1,
      });
    }

    await ctx.db.patch(
      conversationId,
      {
        lastMessage:
          args.text,

              lastMessageAt:
          now,

        lastMessageSenderId:
          current._id,

        updatedAt:
          now,

        unreadCounts,
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
      
    const hasUndelivered =
  messages.some(
    (msg) =>
      msg.receiverId ===
        user._id &&
      msg.status ===
        "sent" &&
      msg.senderId ===
        args.userId
  );

if (!hasUndelivered) {
  return;
}

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

const conversation = await getConversationInternal(
  ctx,
  user._id,
  args.userId
);

if (!conversation) {
  return;
}

const conversationId =
  conversation._id;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(200);
let markedCount = 0;

for (const msg of messages) {
  if (
    msg.receiverId === user._id &&
    !msg.seen &&
    msg.senderId === args.userId
  ) {
    await ctx.db.patch(
      msg._id,
      {
        seen: true,
        seenAt: Date.now(),
        status: "seen",
      }
    );

    markedCount++;
  }
}

/* 🔔 reset unread counter */
if (markedCount > 0) {
  const unreadCounts =
    conversation.unreadCounts
      ? [...conversation.unreadCounts]
      : [];

  const unreadIndex =
    unreadCounts.findIndex(
      (item) =>
        item.userId === user._id
    );

  if (unreadIndex >= 0) {
    unreadCounts[unreadIndex] = {
      userId: user._id,
      count: 0,
    };
  }

  await ctx.db.patch(
    conversationId,
    {
      unreadCounts,
    }
  );
}
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


    const senderIds = [
  ...new Set(
    messages.map((m) => m.senderId)
  ),
];

const senders = await Promise.all(
  senderIds.map((id) =>
    ctx.db.get(id)
  )
);

const senderMap = new Map(
  senders
    .filter(
      (
        u
      ): u is NonNullable<
        typeof senders[number]
      > => !!u
    )
    .map((u) => [
      u._id,
      u,
    ])
);

const enriched = messages.map(
  (m) => ({
    ...m,
    senderImage:
      senderMap.get(
        m.senderId
      )?.image || "",
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


