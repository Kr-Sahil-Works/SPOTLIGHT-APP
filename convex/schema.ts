import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* =========================
     👤 USERS
  ========================= */
users: defineTable({
  username: v.string(),
  fullname: v.string(),
  email: v.optional(
  v.string()
),
  bio: v.optional(v.string()),
  image: v.string(),

  // 🔐 privacy / presence
  isPrivate: v.boolean(),
  isOnline: v.boolean(),
  lastSeen: v.number(),
  showOnline: v.boolean(),

  readReceiptsEnabled:
  v.optional(v.boolean()),

notificationsEnabled:
  v.optional(v.boolean()),

messageRequestsEnabled:
  v.optional(v.boolean()),

  activeChatWith: v.optional(v.id("users")),

  // 📊 stats (keep counters — good decision)
  followers: v.number(),
  following: v.number(),
  posts: v.number(),

  // 🔑 auth
  clerkId: v.string(),
  pushToken: v.optional(v.string()),

  // ⭐ profile extras (keep)
  isVerified: v.optional(v.boolean()),
  website: v.optional(v.string()),
  location: v.optional(v.string()),

  // 🧊 soft delete (correct)
  isDeleted: v.optional(v.boolean()),
  isBanned:
  v.optional(v.boolean()),

bannedReason:
  v.optional(v.string()),

bannedAt:
  v.optional(v.number()),
  deletedAt: v.optional(v.number()),

  // 🆕 ADD THESE (important)
  lastActiveAt: v.optional(v.number()),   // better than only lastSeen
  accountType: v.optional(               // future monetization
    v.union(
      v.literal("user"),
      v.literal("creator"),
      v.literal("business")
    )
  ),

  createdAt: v.number(),
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_username", ["username"])
.index("by_fullname", ["fullname"]),

  /* =========================
     🔁 FOLLOW REQUESTS
  ========================= */
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

  createdAt: v.number(),
})
.index("by_user", ["userId"])
.index("by_user_time", ["userId", "createdAt"]),

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
  }).index("by_post", ["postId"])
  .index("by_post_time", ["postId", "createdAt"]),

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
    .index("by_receiver_read", ["receiverId", "isRead"])
    .index("by_receiver_time", ["receiverId", "createdAt"]),
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

  collections: defineTable({
  userId: v.id("users"),
  name: v.string(),
  createdAt: v.number(),
})
.index("by_user", ["userId"]),

collectionPosts: defineTable({
  collectionId: v.id("collections"),
  postId: v.id("posts"),
  addedAt: v.number(),
})
.index("by_collection", ["collectionId"])
.index("by_collection_and_post", ["collectionId", "postId"]),

  /* =========================
     💬 CONVERSATIONS
  ========================= */
conversations: defineTable({
  /* 🔑 core */
  conversationKey: v.optional(v.string()),
  participants: v.array(v.id("users")),
  createdAt: v.number(),

  /* 💬 last message (for chat list) */
  lastMessage: v.optional(v.string()),
  lastMessageAt: v.optional(v.number()),
  lastMessageSenderId: v.optional(v.id("users")),

  /* 🎨 UI */
  themeIndex: v.optional(v.number()),

  /* 🔒 type */
  type: v.optional(
    v.union(
      v.literal("private"),
      v.literal("group"),
      v.literal("public")
    )
  ),

  /* 👻 hidden / archived */
  hiddenFor: v.optional(v.array(v.id("users"))),
  archivedFor: v.optional(v.array(v.id("users"))),

  /* 🔕 mute */
  mutedFor: v.optional(v.array(v.id("users"))),

  /* 📌 pin */
  pinnedFor: v.optional(v.array(v.id("users"))),

  /* 🧹 clear chat (per user) */
  clearedAt: v.optional(
    v.array(
      v.object({
        userId: v.id("users"),
        timestamp: v.number(),
      })
    )
  ),

  /* ❌ delete chat (soft delete per user) */
  deletedFor: v.optional(v.array(v.id("users"))),

  /* 📊 metadata */
  isBlocked: v.optional(v.boolean()),
  isReported: v.optional(v.boolean()),

  /* 🆕 future ready */
  customName: v.optional(v.string()),
  customImage: v.optional(v.string()),

  updatedAt: v.optional(v.number()),
})
.index("by_participants", ["participants"])
.index("by_key", ["conversationKey"])
.index("by_lastMessageAt", ["lastMessageAt"]),

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
    systemCount: v.optional(v.number()),

    edited: v.optional(v.boolean()),
    replyTo: v.optional(v.id("messages")),
    replyToText: v.optional(v.string()),


    status: v.optional(
  v.union(
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("seen")
  )
),


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