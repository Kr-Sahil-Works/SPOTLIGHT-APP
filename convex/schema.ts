import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    clerkId: v.string(),
    pushToken: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
  }).index("by_user", ["userId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
  }).index("by_post", ["postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  notifications: defineTable({
    receiverId: v.id("users"),
    senderId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
  })
    .index("by_receiver", ["receiverId"])
    .index("by_post", ["postId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  // ✅ FIXED: INSIDE schema
// 💬 MESSAGES (PRO VERSION)
messages: defineTable({
  conversationId: v.string(),

  senderId: v.id("users"),
  receiverId: v.id("users"),

  text: v.string(),

  createdAt: v.number(),

  seen: v.optional(v.boolean()),
  

  // 🔥 NEW FEATURES
  edited: v.optional(v.boolean()),
  replyTo: v.optional(v.id("messages")), // reply support
  reactions: v.optional(v.array(v.string())), // ❤️🔥😂
})
  .index("by_conversation", ["conversationId"])
  .index("by_sender", ["senderId"])
  .index("by_receiver", ["receiverId"]),


// ⌨️ TYPING (REAL-TIME)
typing: defineTable({
  from: v.id("users"),
  to: v.id("users"),
  isTyping: v.boolean(),
}).index("by_user_pair", ["from", "to"])
})