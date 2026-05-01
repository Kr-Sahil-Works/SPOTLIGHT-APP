import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* =========================
     👤 USERS
  ========================= */
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),

    isPrivate: v.optional(v.boolean()),
    isOnline: v.optional(v.boolean()),
    lastSeen: v.optional(v.number()),
    showOnline: v.optional(v.boolean()),

    activeChatWith: v.optional(v.id("users")),

    followers: v.number(),
    following: v.number(),
    posts: v.number(),

    clerkId: v.string(),
    pushToken: v.optional(v.string()),

    // 🔥 NEW
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),


    followRequests: defineTable({
  senderId: v.id("users"),
  receiverId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_receiver", ["receiverId"])
  .index("by_sender_receiver", ["senderId", "receiverId"]),

  
  /* =========================
     📸 POSTS
  ========================= */
  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),

    likes: v.number(),
    comments: v.number(),

    // 🔥 NEW
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  /* =========================
     ❤️ LIKES
  ========================= */
  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  /* =========================
     💬 COMMENTS
  ========================= */
  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),

    // 🔥 NEW
    createdAt: v.number(),
  }).index("by_post", ["postId"]),

  /* =========================
     👥 FOLLOWS
  ========================= */
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),

    // 🔥 NEW
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  /* =========================
     🔔 NOTIFICATIONS
  ========================= */
  notifications: defineTable({
    receiverId: v.id("users"),
    senderId: v.id("users"),

    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("follow")
    ),

    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),

    isRead: v.boolean(),

    // 🔥 NEW
    createdAt: v.number(),
  })
    .index("by_receiver", ["receiverId"])
    .index("by_post", ["postId"])
    .index("by_receiver_read", ["receiverId", "isRead"]),

  /* =========================
     🔖 BOOKMARKS
  ========================= */
bookmarks: defineTable({
  userId: v.id("users"),
  postId: v.id("posts"),
  createdAt: v.number(), // ✅ ADD THIS
})
  .index("by_user", ["userId"])
  .index("by_post", ["postId"])
  .index("by_user_and_post", ["userId", "postId"])
  .index("by_user_time", ["userId", "createdAt"]), // ✅ ADD THIS
  /* =========================
     📝 NOTES
  ========================= */
  notes: defineTable({
    userId: v.id("users"),
    content: v.string(),
    updatedAt: v.number(),

    order: v.number(),
    pinned: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  /* =========================
     💬 CONVERSATIONS
  ========================= */
  conversations: defineTable({
    conversationKey: v.optional(v.string()),
    participants: v.array(v.id("users")),
    createdAt: v.number(),
    lastMessage: v.optional(v.string()),
lastMessageAt: v.optional(v.number()),

    // ✅ CORRECT PLACE FOR THEME
    themeIndex: v.optional(v.number()),
  }).index("by_participants", ["participants"])
  .index("by_key", ["conversationKey"]),

  /* =========================
     💬 MESSAGES
  ========================= */
  messages: defineTable({
    conversationId: v.id("conversations"),

    senderId: v.id("users"),
    receiverId: v.id("users"),

    text: v.string(),
    createdAt: v.number(),

    clientId: v.optional(v.string()),
    seen: v.optional(v.boolean()),

    type: v.optional(
      v.union(
        v.literal("text"),
        v.literal("system")
      )
    ),

    systemType: v.optional(
      v.union(
        v.literal("theme_change"),
        v.literal("date")
      )
    ),

    meta: v.optional(v.any()),

    edited: v.optional(v.boolean()),
    replyTo: v.optional(v.id("messages")),
    replyToText: v.optional(v.string()),

    reactions: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          value: v.string(),
        })
      )
    ),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_time", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  /* =========================
     ⌨️ TYPING
  ========================= */
  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),

    // 🔥 NEW (important for expiry later)
    updatedAt: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", ["conversationId", "userId"]),
});