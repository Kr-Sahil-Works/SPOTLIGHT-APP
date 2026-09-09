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
imageStorageId: v.optional(v.id("_storage")),

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
  createdAt: v.number(),
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
  lastMessageSenderId: v.optional(
  v.id("users")
),

/* 🔔 unread count per user */
unreadCounts: v.optional(
  v.array(
    v.object({
      userId: v.id("users"),
      count: v.number(),
    })
  )
),

  pinnedMessageId:
  v.optional(
    v.id("messages")
  ),

  pinnedBy:
  v.optional(
    v.id("users")
  ),

pinnedMessageText:
  v.optional(
    v.string()
  ),

pinnedAt:
  v.optional(
    v.number()
  ),

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

    contactNumbers: v.optional(
  v.array(
    v.object({
      userId: v.id("users"),
      phone: v.string(),
    })
  )
),
  updatedAt: v.optional(v.number()),
})
.index("by_participants", ["participants"])
.index("by_key", ["conversationKey"])
.index("by_lastMessageAt", ["lastMessageAt"]),


/* =========================
   💬 CONVERSATION MEMBERS
========================= */
conversationMembers: defineTable({
  conversationId:
    v.id("conversations"),

  userId:
    v.id("users"),
})
  .index(
    "by_user",
    ["userId"]
  )
  .index(
    "by_conversation",
    ["conversationId"]
  ),

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
    seenAt: v.optional(v.number()),

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

pinned: v.optional(
  v.boolean()
),

pinnedAt: v.optional(
  v.number()
),

    reactions: v.optional(
      v.array(
      v.object({
  userId: v.id("users"),

  fullName: v.string(),

  userName: v.string(),

  userImage: v.optional(
    v.string()
  ),

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

    updatedAt: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", ["conversationId", "userId"]),

 

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



  /* =========================
     🎮 SPY GAME ROOMS
  ========================= */
  gameRooms: defineTable({
    /* 🔑 ROOM */
    roomCode: v.string(),

    /* 👑 HOST */
    hostId: v.id("users"),

    /* 🎮 GAME CONFIG */
    gameMode: v.union(
      v.literal("spy"),
      v.literal("wordless"),
      v.literal("master"),
      v.literal("y2")
    ),

    maxPlayers: v.number(),

    /* 🔐 PASSWORD */
    passwordEnabled: v.boolean(),
    passwordHash: v.optional(v.string()),

    /* 🎯 ROOM STATE */
    status: v.union(
      v.literal("lobby"),
      v.literal("starting"),
      v.literal("playing"),
      v.literal("finished")
    ),

    /* 🔒 PLAYER LIST */
    playerListLocked: v.boolean(),

    /* =========================
       🗂️ CLASSIC CATEGORY
    ========================= */

    // The 8 categories shown for
    // this particular match.
    categoryOptions: v.optional(
      v.array(v.string())
    ),

    // Winning category after voting.
    selectedCategory: v.optional(
      v.string()
    ),

    // Server-authoritative deadline.
    categorySelectionEndsAt:
      v.optional(v.number()),

    /* =========================
       👑 HOST GRACE PERIOD
    ========================= */

    // Set when the host disconnects.
    hostDisconnectedAt:
      v.optional(v.number()),

    // If the host doesn't return before
    // this timestamp, ownership transfers.
    hostGraceEndsAt:
      v.optional(v.number()),

    /* ⏱️ TIMESTAMPS */
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room_code", ["roomCode"])
    .index("by_host", ["hostId"])
    .index("by_status", ["status"]),


  /* =========================
     👥 SPY ROOM PLAYERS
  ========================= */
  gameRoomPlayers: defineTable({
    roomId: v.id("gameRooms"),
    userId: v.id("users"),

    /* 👑 ROLE IN ROOM */
    isHost: v.boolean(),

    /* ✅ LOBBY */
    isReady: v.boolean(),

    /* 🌐 CONNECTION */
    isConnected: v.boolean(),
    lastActiveAt: v.number(),

    /* 🎮 GAME */
    isAlive: v.boolean(),

    /* 🔒 MATCH */
    eliminatedAt: v.optional(v.number()),

    /* ⏱️ JOIN */
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_user", ["roomId", "userId"]),

/* =========================
   🔐 ROOM JOIN SECURITY
========================= */

gameRoomJoinAttempts: defineTable({
  userId: v.id("users"),

  roomCode: v.string(),

  failedAttempts: v.number(),

  lockedUntil:
    v.optional(v.number()),

  updatedAt: v.number(),
})
  .index(
    "by_user_room_code",
    ["userId", "roomCode"]
  ),


      /* =========================
     🎮 CLASSIC GAME ROUNDS
  ========================= */
  gameRounds: defineTable({
    roomId: v.id("gameRooms"),

    /* 🔢 ACTUAL ROUND NUMBER */
    roundNumber: v.number(),

    /* 🎮 ROUND STATE */
phase: v.union(
  v.literal("roundIntro"),
  v.literal("speaking"),
  v.literal("voting"),
  v.literal("tieBreak"),
  v.literal("result"),
  v.literal("finished")
),

    /* 🗣️ SPEAKER */
    speakerOrder: v.array(
      v.id("gameRoomPlayers")
    ),

    currentSpeakerIndex: v.number(),
    speakersCompleted: v.number(),

    /* ⏱️ CURRENT TIMER */
    turnEndsAt: v.optional(v.number()),
    /* 🎬 ROUND INTRO */

roundIntroEndsAt:
  v.optional(v.number()),

    /* 🗳️ VOTING TIMER */
    votingEndsAt: v.optional(v.number()),

    /* 🔁 TIE BREAK */
    isTieBreak: v.boolean(),

    tieBreakOrder: v.optional(
      v.array(v.id("gameRoomPlayers"))
    ),

    tieBreakSpeakerIndex:
      v.optional(v.number()),

 /* 🏁 ROUND RESULT */

resolution:
  v.optional(
    v.union(
      v.literal("no_elimination"),
      v.literal("eliminated"),
      v.literal("game_over"),
      v.literal("tie_break"),
      v.literal("super_tie"),
      v.literal("tie_break_no_elimination"),
      v.literal("tie_limit_reached")
    )
  ),

tiedPlayerIds:
  v.optional(
    v.array(
      v.id("gameRoomPlayers")
    )
  ),

tieRoundCount:
  v.optional(v.number()),

eliminatedPlayerId:
  v.optional(
    v.id("gameRoomPlayers")
  ),

createdAt: v.number(),
updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_round", [
      "roomId",
      "roundNumber",
    ]),

  /* =========================
   🗳️ CLASSIC ROUND VOTES
========================= */

gameRoundVotes: defineTable({
  /* 🔗 ROUND */
  roundId: v.id("gameRounds"),

  /* 🔗 ROOM */
  roomId: v.id("gameRooms"),

  /* 👤 VOTER */
  voterId: v.id("gameRoomPlayers"),

  /* 🎯 TARGET */
  targetId: v.optional(
    v.id("gameRoomPlayers")
  ),

  /* ⏭️ SKIP */
  skipped: v.boolean(),

  /* ⏱️ TIME */
  createdAt: v.number(),
})
  .index(
    "by_round",
    ["roundId"]
  )
  .index(
    "by_round_voter",
    [
      "roundId",
      "voterId",
    ]
  )
  .index(
    "by_round_target",
    [
      "roundId",
      "targetId",
    ]
  )
  .index(
    "by_room",
    ["roomId"]
  ),
  
  /* =========================
   ⚖️ CLASSIC TIE-BREAK VOTES
========================= */

gameTieBreakVotes: defineTable({
  /* 🔗 ROUND */
  roundId:
    v.id("gameRounds"),

  /* 🏠 ROOM */
  roomId:
    v.id("gameRooms"),

  /* 👤 VOTER */
  voterId:
    v.id("gameRoomPlayers"),

  /* 🎯 TARGET */
  targetId:
    v.optional(
      v.id("gameRoomPlayers")
    ),

  /* ⏭️ SKIP */
  skipped:
    v.boolean(),

  /* ⏱️ TIME */
  createdAt:
    v.number(),
})
  .index(
    "by_round",
    ["roundId"]
  )
  .index(
    "by_round_voter",
    [
      "roundId",
      "voterId",
    ]
  )
  .index(
    "by_round_target",
    [
      "roundId",
      "targetId",
    ]
  ),

  /* =========================
     🔐 PRIVATE CLASSIC PLAYER
  ========================= */
  gamePlayerSecrets: defineTable({
    roomId: v.id("gameRooms"),
    playerId: v.id("gameRoomPlayers"),
    userId: v.id("users"),

    /* 🎭 SECRET ROLE */
    role: v.union(
      v.literal("spy"),
      v.literal("villager")
    ),

    /* 🔐 SECRET WORD */
    word: v.string(),

    createdAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_player", ["playerId"])
    .index("by_room_user", [
      "roomId",
      "userId",
    ]),

  /* =========================
     🎮 SPY GAME MATCHES
  ========================= */
  gameMatches: defineTable({
    /* 🔗 ROOM */
    roomId: v.id("gameRooms"),

    /* 🎮 GAME */
    gameMode: v.union(
      v.literal("spy"),
      v.literal("wordless"),
      v.literal("master"),
      v.literal("y2")
    ),

    /* 🗂️ CATEGORY */
    category: v.string(),

    /* 🎯 MATCH STATE */
    status: v.union(
      v.literal("starting"),
      v.literal("playing"),
      v.literal("finished")
    ),

    /* 🔢 ROUND */
    currentRound: v.number(),

    tieRoundCount: v.number(),

    /* 👑 WINNER */
    winner: v.optional(
      v.union(
        v.literal("spy"),
        v.literal("villagers")
      )
    ),

    /* ⏱️ MATCH TIMING */
    startedAt: v.number(),

    finishedAt: v.optional(
      v.number()
    ),

 /* 🧩 WORD PAIR */
wordPairId: v.optional(
  v.string()
),

/* 👥 ACTUAL WORDS USED IN THIS MATCH */
villagerWord: v.optional(
  v.string()
),

spyWord: v.optional(
  v.string()
),

/* 🎯 SPY */
spyPlayerId: v.optional(
  v.id("gameRoomPlayers")
),

    createdAt: v.number(),

    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_status", ["status"])
    .index("by_room_status", [
      "roomId",
      "status",
    ]),

/* =========================
   🗳️ CLASSIC CATEGORY VOTES
========================= */

gameClassicCategoryVotes: defineTable({
  roomId: v.id("gameRooms"),

  userId: v.id("users"),

  categoryId: v.string(),

  createdAt: v.number(),

  updatedAt: v.number(),
})
  .index(
    "by_room",
    ["roomId"]
  )
  .index(
    "by_room_user",
    ["roomId", "userId"]
  )
  .index(
    "by_room_category",
    ["roomId", "categoryId"]
  ),
gameMatchHistory: defineTable({
  matchId: v.id("gameMatches"),
  roomId: v.id("gameRooms"),

  gameMode: v.string(),

  category: v.string(),

  winner: v.union(
    v.literal("spy"),
    v.literal("villagers")
  ),

  villagerWord: v.string(),
  spyWord: v.string(),

  spyPlayerId:
    v.id("gameRoomPlayers"),

  currentRound: v.number(),

  tieRoundCount: v.number(),

  completedAt: v.number(),

  players: v.array(
    v.object({
      playerId:
        v.id("gameRoomPlayers"),

      userId:
        v.id("users"),

      role: v.union(
        v.literal("spy"),
        v.literal("villager")
      ),

      isAlive: v.boolean(),

      eliminatedRound:
        v.optional(v.number()),

      eliminatedAt:
        v.optional(v.number()),
    })
  ),
})
  .index("by_room", ["roomId"])
  .index("by_match", ["matchId"])
  .index("by_room_completed", [
    "roomId",
    "completedAt",
  ]),

});


