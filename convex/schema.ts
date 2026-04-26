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

    themeIndex: v.optional(v.number()),
    isOnline: v.optional(v.boolean()),
    lastSeen: v.optional(v.number()),
    showOnline: v.optional(v.boolean()),

    activeChatWith: v.optional(v.id("users")),

    followers: v.number(),
    following: v.number(),
    posts: v.number(),

    clerkId: v.string(),
    pushToken: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

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
  }).index("by_post", ["postId"]),

  /* =========================
     👥 FOLLOWS
  ========================= */
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
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

  // 🔥 ADD THIS (REQUIRED)
  isRead: v.boolean(),
})
  .index("by_receiver", ["receiverId"])
  .index("by_post", ["postId"]),

  /* =========================
     🔖 BOOKMARKS
  ========================= */
  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

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
     💬 CONVERSATIONS (NEW CORE)
  ========================= */
  conversations: defineTable({
    participants: v.array(v.id("users")),
    createdAt: v.number(),

    // 🔥 chat-level theme
    themeIndex: v.optional(v.number()),
  }).index("by_participants", ["participants"]),

  /* =========================
     💬 MESSAGES (UPGRADED)
  ========================= */
  messages: defineTable({
    conversationId: v.id("conversations"),

    senderId: v.id("users"),
    receiverId: v.id("users"),

    text: v.string(),
    createdAt: v.number(),

    clientId: v.optional(v.string()),

    seen: v.optional(v.boolean()),

    // 🔥 SYSTEM SUPPORT
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

    // 🔥 FEATURES
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
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", ["conversationId", "userId"]),
});