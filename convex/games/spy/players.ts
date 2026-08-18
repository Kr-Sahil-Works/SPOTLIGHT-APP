import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { getAuthenticatedUser } from "../../users/users.core";

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 8;

export const joinRoom = mutation({
  args: {
    roomCode: v.string(),
  },

  handler: async (ctx, args) => {
    /* =========================
       🔐 AUTH
    ========================= */

    const user = await getAuthenticatedUser(ctx);

    /* =========================
       🔑 NORMALIZE ROOM CODE
    ========================= */

    const roomCode = args.roomCode
      .trim()
      .toUpperCase();

    if (!roomCode) {
      throw new Error(
        "Room code is required"
      );
    }

    /* =========================
       🔎 FIND ROOM
    ========================= */

    const room = await ctx.db
      .query("gameRooms")
      .withIndex("by_room_code", (q) =>
        q.eq("roomCode", roomCode)
      )
      .first();

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    /* =========================
       🎮 ROOM STATE
    ========================= */

    if (room.status !== "lobby") {
      throw new Error(
        "This game has already started"
      );
    }

    /* =========================
       👥 PLAYER LIMIT
    ========================= */

    if (
      room.maxPlayers < MIN_PLAYERS ||
      room.maxPlayers > MAX_PLAYERS
    ) {
      throw new Error(
        "Invalid room player limit"
      );
    }

    /* =========================
       👤 CHECK EXISTING MEMBERSHIP
    ========================= */

    const existingPlayer =
      await ctx.db
        .query("gameRoomPlayers")
        .withIndex(
          "by_room_user",
          (q) =>
            q
              .eq(
                "roomId",
                room._id
              )
              .eq(
                "userId",
                user._id
              )
        )
        .first();

    /* =========================
       🔄 ALREADY IN THIS ROOM
    ========================= */

    if (existingPlayer) {
      const now = Date.now();

      await ctx.db.patch(
        existingPlayer._id,
        {
          isConnected: true,
          lastActiveAt: now,
        }
      );

      return {
        roomId: room._id,
        playerId:
          existingPlayer._id,
        roomCode: room.roomCode,
        alreadyJoined: true,
      };
    }

    /* =========================
       🚫 CHECK OTHER ACTIVE ROOMS
    ========================= */

    const userRooms =
      await ctx.db
        .query("gameRoomPlayers")
        .withIndex(
          "by_user",
          (q) =>
            q.eq(
              "userId",
              user._id
            )
        )
        .collect();

    for (const player of userRooms) {
      if (
        player.roomId === room._id
      ) {
        continue;
      }

      const otherRoom =
        await ctx.db.get(
          player.roomId
        );

      if (
        otherRoom &&
        (
          otherRoom.status ===
            "lobby" ||
          otherRoom.status ===
            "starting" ||
          otherRoom.status ===
            "playing"
        )
      ) {
        throw new Error(
          "You are already in another active room"
        );
      }
    }

    /* =========================
       👥 CURRENT PLAYER COUNT
    ========================= */

    const players =
      await ctx.db
        .query("gameRoomPlayers")
        .withIndex(
          "by_room",
          (q) =>
            q.eq(
              "roomId",
              room._id
            )
        )
        .collect();

    if (
      players.length >=
      room.maxPlayers
    ) {
      throw new Error(
        "Room is full"
      );
    }

    /* =========================
       👤 ADD PLAYER
    ========================= */

    const now = Date.now();

    const playerId =
      await ctx.db.insert(
        "gameRoomPlayers",
        {
          roomId: room._id,

          userId: user._id,

          isHost: false,

          isReady: false,

          isConnected: true,

          lastActiveAt: now,

          isAlive: true,

          joinedAt: now,
        }
      );

    /* =========================
       🕐 UPDATE ROOM
    ========================= */

    await ctx.db.patch(
      room._id,
      {
        updatedAt: now,
      }
    );

    /* =========================
       📦 RETURN
    ========================= */

    return {
      roomId: room._id,

      playerId,

      roomCode:
        room.roomCode,

      alreadyJoined: false,
    };
  },
});

/* =========================
   🚪 LEAVE ROOM
========================= */

export const leaveRoom = mutation({
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
       👤 FIND PLAYER
    ========================= */

    const player = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room_user", (q) =>
        q
          .eq("roomId", room._id)
          .eq("userId", user._id)
      )
      .first();

    if (!player) {
      return {
        success: true,
        roomDeleted: false,
      };
    }

    /* =========================
       🎮 LOBBY ONLY FOR NOW
    ========================= */

    if (room.status !== "lobby") {
      throw new Error(
        "You cannot leave the game this way after it has started"
      );
    }

    /* =========================
       👥 GET REMAINING PLAYERS
    ========================= */

    const players = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room", (q) =>
        q.eq("roomId", room._id)
      )
      .collect();

    const remainingPlayers = players.filter(
      (item) => item._id !== player._id
    );

    /* =========================
       🗑️ LAST PLAYER
    ========================= */

    if (remainingPlayers.length === 0) {
      await ctx.db.delete(player._id);
      await ctx.db.delete(room._id);

      return {
        success: true,
        roomDeleted: true,
      };
    }

    /* =========================
       👑 HOST LEAVING
    ========================= */

    if (player.isHost) {
      const nextHost = [...remainingPlayers].sort(
        (a, b) => a.joinedAt - b.joinedAt
      )[0];

      await ctx.db.patch(nextHost._id, {
        isHost: true,
      });

      await ctx.db.patch(room._id, {
        hostId: nextHost.userId,
        updatedAt: Date.now(),
      });
    } else {
      /* =========================
         🕐 NORMAL PLAYER
      ========================= */

      await ctx.db.patch(room._id, {
        updatedAt: Date.now(),
      });
    }

    /* =========================
       🗑️ REMOVE PLAYER
    ========================= */

    await ctx.db.delete(player._id);

    /* =========================
       📦 RETURN
    ========================= */

    return {
      success: true,
      roomDeleted: false,
      newHostId: player.isHost
        ? remainingPlayers.sort(
            (a, b) => a.joinedAt - b.joinedAt
          )[0].userId
        : undefined,
    };
  },
});


/* =========================
   ✅ READY / UNREADY
========================= */

export const setReady = mutation({
  args: {
    roomId: v.id("gameRooms"),
    isReady: v.boolean(),
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
       🎮 LOBBY ONLY
    ========================= */

    if (room.status !== "lobby") {
      throw new Error(
        "You cannot change ready status now"
      );
    }

    /* =========================
       👤 FIND PLAYER
    ========================= */

    const player = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room_user", (q) =>
        q
          .eq("roomId", room._id)
          .eq("userId", user._id)
      )
      .first();

    if (!player) {
      throw new Error(
        "You are not in this room"
      );
    }

    /* =========================
       🔄 UPDATE READY
    ========================= */

    await ctx.db.patch(player._id, {
      isReady: args.isReady,
      lastActiveAt: Date.now(),
    });

    await ctx.db.patch(room._id, {
      updatedAt: Date.now(),
    });

    return {
      success: true,
      isReady: args.isReady,
    };
  },
});

/* =========================
   🟢 PLAYER PRESENCE
========================= */

export const updatePresence = mutation({
  args: {
    roomId: v.id("gameRooms"),
    isConnected: v.boolean(),
  },

  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const room = await ctx.db.get(args.roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const player = await ctx.db
      .query("gameRoomPlayers")
      .withIndex("by_room_user", (q) =>
        q
          .eq("roomId", room._id)
          .eq("userId", user._id)
      )
      .first();

    if (!player) {
      throw new Error(
        "You are not in this room"
      );
    }

    const now = Date.now();

    await ctx.db.patch(player._id, {
      isConnected: args.isConnected,
      lastActiveAt: now,
    });

    await ctx.db.patch(room._id, {
      updatedAt: now,
    });

    return {
      success: true,
      isConnected: args.isConnected,
      lastActiveAt: now,
    };
  },
});


/* =========================
   👢 KICK PLAYER
========================= */

export const kickPlayer = mutation({
  args: {
    roomId: v.id("gameRooms"),
    playerId: v.id("gameRoomPlayers"),
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
       🎮 LOBBY ONLY
    ========================= */

    if (room.status !== "lobby") {
      throw new Error(
        "Players cannot be kicked now"
      );
    }

    /* =========================
       👑 VERIFY HOST
    ========================= */

    if (room.hostId !== user._id) {
      throw new Error(
        "Only the host can kick players"
      );
    }

    /* =========================
       👤 FIND TARGET
    ========================= */

    const targetPlayer = await ctx.db.get(
      args.playerId
    );

    if (!targetPlayer) {
      throw new Error(
        "Player not found"
      );
    }

    /* =========================
       🔒 VERIFY SAME ROOM
    ========================= */

    if (
      targetPlayer.roomId !== room._id
    ) {
      throw new Error(
        "Player is not in this room"
      );
    }

    /* =========================
       🚫 HOST CANNOT KICK SELF
    ========================= */

    if (
      targetPlayer.userId === user._id
    ) {
      throw new Error(
        "Host cannot kick themselves"
      );
    }

    /* =========================
       🗑️ REMOVE PLAYER
    ========================= */

    await ctx.db.delete(
      targetPlayer._id
    );

    /* =========================
       🕐 UPDATE ROOM
    ========================= */

    await ctx.db.patch(room._id, {
      updatedAt: Date.now(),
    });

    return {
      success: true,
      kickedPlayerId:
        targetPlayer._id,
      kickedUserId:
        targetPlayer.userId,
    };
  },
});