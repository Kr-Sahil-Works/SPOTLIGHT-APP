import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";
import { getAuthenticatedUser } from "../../users/users.core";
import {
  startCategorySelectionInternal,
} from "./classic/voting";

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 8;

const generateRoomCode = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return code;
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
      _id: room._id,
      roomCode: room.roomCode,
      hostId: room.hostId,
      gameMode: room.gameMode,
      maxPlayers: room.maxPlayers,
      passwordEnabled: room.passwordEnabled,
      status: room.status,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
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


export const createRoom = mutation({
  args: {
    gameMode: v.union(
      v.literal("spy"),
      v.literal("wordless"),
      v.literal("master"),
      v.literal("y2")
    ),

    maxPlayers: v.number(),

    passwordEnabled: v.boolean(),
  },

  handler: async (ctx, args) => {
    /* =========================
       🔐 AUTH
    ========================= */

    const user = await getAuthenticatedUser(ctx);

    /* =========================
       👥 PLAYER LIMIT
    ========================= */

    if (
      args.maxPlayers < MIN_PLAYERS ||
      args.maxPlayers > MAX_PLAYERS
    ) {
      throw new Error(
        `Players must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`
      );
    }

    /* =========================
       🔑 UNIQUE ROOM CODE
    ========================= */

    let roomCode: string | null = null;

    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateRoomCode();

      const existing = await ctx.db
        .query("gameRooms")
        .withIndex("by_room_code", (q) =>
          q.eq("roomCode", candidate)
        )
        .first();

      if (!existing) {
        roomCode = candidate;
        break;
      }
    }

    if (!roomCode) {
      throw new Error(
        "Unable to generate a unique room code. Please try again."
      );
    }

    /* =========================
       ⏱️ TIMESTAMP
    ========================= */

    const now = Date.now();

    /* =========================
       🏠 CREATE ROOM
    ========================= */

    const roomId = await ctx.db.insert(
      "gameRooms",
      {
        roomCode,

        hostId: user._id,

        gameMode: args.gameMode,

        maxPlayers: args.maxPlayers,

        passwordEnabled:
          args.passwordEnabled,

        // Password handling will be
        // added before enabling
        // password-protected rooms.
        passwordHash: undefined,

     status: "lobby",

playerListLocked: false,

createdAt: now,

updatedAt: now,
      }
    );

    /* =========================
       👑 ADD HOST
    ========================= */

    const playerId = await ctx.db.insert(
      "gameRoomPlayers",
      {
        roomId,

        userId: user._id,

        isHost: true,

        // Host is automatically ready.
        isReady: true,

        isConnected: true,

        lastActiveAt: now,

        isAlive: true,

        joinedAt: now,
      }
    );

    /* =========================
       📦 RETURN
    ========================= */

    return {
      roomId,
      playerId,
      roomCode,
    };
  },
});


/* =========================
   ▶️ START GAME
========================= */

export const startGame = mutation({
  args: {
    roomId: v.id("gameRooms"),
  },

  handler: async (ctx, args) => {
    /* =========================
       🔐 AUTH
    ========================= */

    const user = await getAuthenticatedUser(ctx);

    /* =========================
       🔎 FIND ROOM
    ========================= */

    const room = await ctx.db.get(args.roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    /* =========================
       👑 VERIFY HOST
    ========================= */

    if (room.hostId !== user._id) {
      throw new Error(
        "Only the host can start the game"
      );
    }

    /* =========================
       🎮 ROOM STATE
    ========================= */

    if (room.status !== "lobby") {
      throw new Error(
        "This game cannot be started now"
      );
    }

    /* =========================
       👥 GET PLAYERS
    ========================= */

    const players = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room", (q) =>
        q.eq("roomId", room._id)
      )
      .collect();

    /* =========================
       👥 MINIMUM PLAYERS
    ========================= */

    if (players.length < MIN_PLAYERS) {
      throw new Error(
        `At least ${MIN_PLAYERS} players are required`
      );
    }

    /* =========================
       👥 MAXIMUM PLAYERS
    ========================= */

    if (players.length > room.maxPlayers) {
      throw new Error(
        "Room has too many players"
      );
    }

    /* =========================
       🟢 CONNECTION CHECK
    ========================= */

    const disconnectedPlayer =
      players.find(
        (player) =>
          !player.isConnected
      );

    if (disconnectedPlayer) {
      throw new Error(
        "All players must be connected"
      );
    }

    /* =========================
       ✅ READY CHECK
    ========================= */

    const unreadyPlayer =
      players.find(
        (player) =>
          !player.isReady
      );

    if (unreadyPlayer) {
      throw new Error(
        "All players must be ready"
      );
    }

    /* =========================
       ⏳ STARTING
    ========================= */

const result =
  await startCategorySelectionInternal(
    ctx,
    room._id
  );

return {
  success: true,

  roomId: room._id,

  status: "starting",

  playerCount:
    players.length,

  categoryOptions:
    result.categoryOptions,

  categorySelectionEndsAt:
    result.categorySelectionEndsAt,
};
  },
});