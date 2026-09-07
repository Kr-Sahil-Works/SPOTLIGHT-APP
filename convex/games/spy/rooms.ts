import { v } from "convex/values";

import { mutation, query } from "../../_generated/server";

import { getAuthenticatedUser } from "../../users/users.core";

import {
  startCategorySelectionInternal,
} from "./classic/categorySelection";

const MIN_PLAYERS = 4;

const MAX_PLAYERS = 8;

/* =========================
   🔢 UNIQUE 4-DIGIT ROOM CODE
========================= */

const generateRoomCode =
  () => {
    return Math.floor(
      1000 +
        Math.random() *
          9000
    ).toString();
  };

export const getRoom = query({
  args: {
    roomId: v.id("gameRooms"),
  },

  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);

    if (!room) {
      return null;
    }

   return {
  _id:
    room._id,

  roomCode:
    room.roomCode,

  hostId:
    room.hostId,

  gameMode:
    room.gameMode,

  maxPlayers:
    room.maxPlayers,

  passwordEnabled:
    room.passwordEnabled,

  status:
    room.status,

  selectedCategory:
    room.selectedCategory,

  categoryOptions:
    room.categoryOptions,

  categorySelectionEndsAt:
    room.categorySelectionEndsAt,

  playerListLocked:
    room.playerListLocked,

  createdAt:
    room.createdAt,

  updatedAt:
    room.updatedAt,
};
  },
});


export const getRoomPlayers = query({
  args: {
    roomId: v.id("gameRooms"),
  },

  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room", (q) =>
        q.eq("roomId", args.roomId)
      )
      .collect();

      players.sort(
  (a, b) =>
    a.joinedAt -
    b.joinedAt
);

    const result = await Promise.all(
      players.map(async (player) => {
        const user = await ctx.db.get(
          player.userId
        );

        if (!user || user.isDeleted) {
          return null;
        }

        return {
          id: player._id,
          userId: user._id,

          name: user.username,

          avatar: user.image,

          isHost: player.isHost,

          isReady: player.isReady,

          isConnected:
            player.isConnected,

          isSpeaking: false,

          isAlive: player.isAlive,

        };
      })
    );

    return result.filter(
      (player): player is NonNullable<typeof player> =>
        player !== null
    );
  },
});

export const getCurrentPlayer = query({
  args: {
    roomId: v.id("gameRooms"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    // Your app stores the Clerk user ID in `clerkId`.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .first();

    if (!user) {
      return null;
    }

    const player = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room_user", (q) =>
        q
          .eq("roomId", args.roomId)
          .eq("userId", user._id)
      )
      .first();

    if (!player) {
      return null;
    }

    return {
      playerId: player._id,
      userId: player.userId,
      isHost: player.isHost,
      isReady: player.isReady,
      isConnected: player.isConnected,
    };
  },
});

/* =========================
   🏠 CREATE ROOM
========================= */

export const createRoom =
  mutation({
    args: {
      gameMode:
        v.union(
          v.literal("spy"),
          v.literal("wordless"),
          v.literal("master"),
          v.literal("y2")
        ),

      maxPlayers:
        v.number(),

      passwordEnabled:
        v.boolean(),
    },

    handler: async (
      ctx,
      args
    ) => {
      /* =========================
         🔐 AUTH
      ========================= */

      const user =
        await getAuthenticatedUser(
          ctx
        );

      /* =========================
         🔢 PLAYER LIMIT
      ========================= */

      if (
        args.maxPlayers <
          MIN_PLAYERS ||
        args.maxPlayers >
          MAX_PLAYERS
      ) {
        throw new Error(
          `Players must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`
        );
      }

      /* =========================
         🔢 UNIQUE 4-DIGIT CODE
      ========================= */

      let roomCode = "";
      let attempts = 0;

      while (attempts < 20) {
        const candidate =
          generateRoomCode();

        const existingRoom =
          await ctx.db
            .query("gameRooms")
            .withIndex(
              "by_room_code",
              (q) =>
                q.eq(
                  "roomCode",
                  candidate
                )
            )
            .first();

        if (!existingRoom) {
          roomCode =
            candidate;
          break;
        }

        attempts++;
      }
if (!roomCode) {
  return {
    success: false,
    reason: "ROOM_CODE_GENERATION_FAILED" as const,
  };
}
      

      /* =========================
         ⏱️ TIMESTAMP
      ========================= */

      const now =
        Date.now();

      /* =========================
         🏠 CREATE ROOM
      ========================= */

      const roomId =
        await ctx.db.insert(
          "gameRooms",
          {
            roomCode,

            hostId:
              user._id,

            gameMode:
              args.gameMode,

            maxPlayers:
              args.maxPlayers,

            passwordEnabled:
              args.passwordEnabled,

            passwordHash:
              undefined,

            status:
              "lobby",

            playerListLocked:
              false,

            createdAt:
              now,

            updatedAt:
              now,
          }
        );

      /* =========================
         👑 ADD HOST
      ========================= */

      const playerId =
        await ctx.db.insert(
          "gameRoomPlayers",
          {
            roomId,

            userId:
              user._id,

            isHost:
              true,

            isReady:
              true,

            isConnected:
              true,

            lastActiveAt:
              now,

            isAlive:
              true,

            joinedAt:
              now,
          }
        );

      return {
        success: true,

        roomId,

        playerId,

        roomCode,

        maxPlayers:
          args.maxPlayers,

        playerCount:
          1,
      };
    },
  });


/* =========================
   🚪 JOIN ROOM
========================= */

export const joinRoom =
  mutation({
    args: {
      roomCode:
        v.string(),
    },

    handler: async (
      ctx,
      args
    ) => {
      /* =========================
         🔐 AUTH
      ========================= */

      const user =
        await getAuthenticatedUser(
          ctx
        );

      const roomCode =
        args.roomCode.trim();

      if (
        !/^\d{4}$/.test(
          roomCode
        )
      ) {
        return {
          success: false as const,
          reason:
            "INVALID_ROOM_CODE" as const,
        };
      }

      const now =
        Date.now();

      /* =========================
         🔒 JOIN ATTEMPT RECORD
      ========================= */

      let attempt =
        await ctx.db
          .query(
            "gameRoomJoinAttempts"
          )
          .withIndex(
            "by_user_room_code",
            (q) =>
              q
                .eq(
                  "userId",
                  user._id
                )
                .eq(
                  "roomCode",
                  roomCode
                )
          )
          .unique();

      /* =========================
         ⏳ CHECK 15 MIN LOCK
      ========================= */

      if (
        attempt?.lockedUntil &&
        attempt.lockedUntil >
          now
      ) {
        const remainingMinutes =
          Math.max(
            1,
            Math.ceil(
              (
                attempt.lockedUntil -
                now
              ) /
                60000
            )
          );

        throw new Error(
          `Too many failed attempts. Try again in ${remainingMinutes} minute(s).`
        );
      }

      /* =========================
         🔎 FIND ROOM
      ========================= */

      const room =
        await ctx.db
          .query(
            "gameRooms"
          )
          .withIndex(
            "by_room_code",
            (q) =>
              q.eq(
                "roomCode",
                roomCode
              )
          )
          .first();

      /* =========================
         ❌ ROOM NOT FOUND
      ========================= */

      if (!room) {
        const failedAttempts =
          (attempt?.failedAttempts ??
            0) + 1;

        const shouldLock =
          failedAttempts >= 20;

        if (attempt) {
          await ctx.db.patch(
            attempt._id,
            {
              failedAttempts:
                shouldLock
                  ? 0
                  : failedAttempts,

              lockedUntil:
                shouldLock
                  ? now +
                    15 *
                      60 *
                      1000
                  : undefined,

              updatedAt:
                now,
            }
          );
        } else {
          await ctx.db.insert(
            "gameRoomJoinAttempts",
            {
              userId:
                user._id,

              roomCode,

              failedAttempts:
                shouldLock
                  ? 0
                  : failedAttempts,

              lockedUntil:
                shouldLock
                  ? now +
                    15 *
                      60 *
                      1000
                  : undefined,

              updatedAt:
                now,
            }
          );
        }

     if (shouldLock) {
  return {
    success: false as const,
    reason: "TOO_MANY_ATTEMPTS" as const,
  };
}

        return {
          success: false as const,
          reason:
            "ROOM_NOT_FOUND" as const,
        };
      }

      /* =========================
         🔒 ROOM STATUS
      ========================= */

      if (
        room.status !==
        "lobby"
      ) {
        return {
          success: false as const,
          reason:
            "ROOM_NOT_JOINABLE" as const,
        };
      }
if (room.playerListLocked) {
  return {
    success: false,
    reason: "PLAYER_LIST_LOCKED" as const,
  };
}
      /* =========================
         🔐 PLAYER LIST LOCK
      ========================= */

      if (
        room.playerListLocked
      ) {
        return {
          success: false as const,
          reason:
            "ROOM_NOT_JOINABLE" as const,
        };
      }

      /* =========================
         👥 GET PLAYERS
      ========================= */

      const players =
        await ctx.db
          .query(
            "gameRoomPlayers"
          )
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                room._id
              )
          )
          .collect();

      /* =========================
         👤 ALREADY JOINED
      ========================= */

      const existingPlayer =
        players.find(
          (player) =>
            player.userId ===
            user._id
        );

      if (
        existingPlayer
      ) {
        return {
          success: true as const,

          alreadyJoined:
            true,

          roomId:
            room._id,

          playerId:
            existingPlayer._id,

          roomCode:
            room.roomCode,

          maxPlayers:
            room.maxPlayers,

          playerCount:
            players.length,
        };
      }

      /* =========================
         🚫 ROOM FULL
      ========================= */

      if (
        players.length >=
        room.maxPlayers
      ) {
        return {
          success: false as const,
          reason:
            "ROOM_FULL" as const,
        };
      }

      /* =========================
         👤 ADD PLAYER
      ========================= */

      const playerId =
        await ctx.db.insert(
          "gameRoomPlayers",
          {
            roomId:
              room._id,

            userId:
              user._id,

            isHost:
              false,

            isReady:
              false,

            isConnected:
              true,

            lastActiveAt:
              now,

            isAlive:
              true,

            joinedAt:
              now,
          }
        );

      /* =========================
         🧹 RESET FAILED ATTEMPTS
      ========================= */

      if (attempt) {
        await ctx.db.patch(
          attempt._id,
          {
            failedAttempts:
              0,

            lockedUntil:
              undefined,

            updatedAt:
              now,
          }
        );
      }

      /* =========================
         🕒 UPDATE ROOM
      ========================= */

      await ctx.db.patch(
        room._id,
        {
          updatedAt:
            now,
        }
      );

      /* =========================
         📦 SUCCESS
      ========================= */

      return {
        success: true as const,

        alreadyJoined:
          false,

        roomId:
          room._id,

        playerId,

        roomCode:
          room.roomCode,

        maxPlayers:
          room.maxPlayers,

        playerCount:
          players.length + 1,
      };
    },
  });


  export const setPlayerReady = mutation({
  args: {
    roomId: v.id("gameRooms"),
    isReady: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const room = await ctx.db.get(args.roomId);

    if (!room) {
      return {
        success: false,
        reason: "ROOM_NOT_FOUND" as const,
      };
    }

    if (room.status !== "lobby") {
      return {
        success: false,
        reason: "ROOM_NOT_JOINABLE" as const,
      };
    }

    const player = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room_user", (q) =>
        q
          .eq("roomId", args.roomId)
          .eq("userId", user._id)
      )
      .first();

    if (!player) {
      return {
        success: false,
        reason: "NOT_IN_ROOM" as const,
      };
    }

    await ctx.db.patch(player._id, {
      isReady: args.isReady,
      isConnected: true,
      lastActiveAt: Date.now(),
    });

    return {
      success: true,
      isReady: args.isReady,
    };
  },
});




/* =========================
   ▶️ START GAME
========================= */

export const startGame =
  mutation({
    args: {
      roomId:
        v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      /* =========================
         🔐 AUTH
      ========================= */

      const user =
        await getAuthenticatedUser(
          ctx
        );

      /* =========================
         🏠 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          args.roomId
        );

    if (!room) {
  return {
    success: false as const,
    reason: "ROOM_NOT_FOUND" as const,
  };
}

      /* =========================
         👑 HOST ONLY
      ========================= */

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can start the game"
        );
      }

      /* =========================
         🎮 ROOM STATE
      ========================= */

if (room.status !== "lobby") {
  return {
    success: false as const,
    reason: "ROOM_NOT_JOINABLE" as const,
  };
}

if (room.playerListLocked) {
  return {
    success: false as const,
    reason: "PLAYER_LIST_LOCKED" as const,
  };
}
      /* =========================
         👥 PLAYERS
      ========================= */

      const players =
        await ctx.db
          .query(
            "gameRoomPlayers"
          )
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                room._id
              )
          )
          .collect();

      /* =========================
         👥 PLAYER COUNT
      ========================= */

      if (
        players.length <
        MIN_PLAYERS
      ) {
        throw new Error(
          `At least ${MIN_PLAYERS} players are required`
        );
      }

      if (
        players.length >
        room.maxPlayers
      ) {
        throw new Error(
          "Room has too many players"
        );
      }

      /* =========================
         ✅ READY CHECK
      ========================= */

      const allReady =
        players.every(
          (player) =>
            player.isReady
        );

      if (!allReady) {
        throw new Error(
          "All players must be ready"
        );
      }

/* =========================
   🚀 MOVE ROOM TO STARTING
========================= */

const now =
  Date.now();

await ctx.db.patch(
  room._id,
  {
    status:
      "starting",

    // Keep unlocked while the
    // category-selection state is created.
    playerListLocked:
      false,

    updatedAt:
      now,
  }
);

/* =========================
   🗂️ CATEGORY SELECTION
========================= */

const result =
  await startCategorySelectionInternal(
    ctx,
    room._id
  );

      return {
        success: true,

        roomId:
          room._id,

        status:
          "starting",

        playerCount:
          players.length,

        categoryOptions:
          result.categoryOptions,

        categorySelectionEndsAt:
          result.categorySelectionEndsAt,
      };
    },
  });