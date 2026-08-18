import {
  mutation,
  query,
  type QueryCtx,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

import {
  selectClassicWordPair,
} from "./utils/pairSelector";

import {
  assignClassicRoles,
} from "./utils/roleAssigner";

/* =========================
   🎮 CONSTANTS
========================= */

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 8;

const MAX_ROUNDS = 10;

const SPEAKING_SECONDS = 30;

/* =========================
   🔐 QUERY AUTH
========================= */

const getAuthenticatedUserForQuery =
  async (ctx: QueryCtx) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        "Not authenticated"
      );
    }

    const user =
      await ctx.db
        .query("users")
        .withIndex(
          "by_clerk_id",
          (q) =>
            q.eq(
              "clerkId",
              identity.subject
            )
        )
        .unique();

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (user.isDeleted) {
      throw new Error(
        "User account is deleted"
      );
    }

    if (user.isBanned) {
      throw new Error(
        "User account is banned"
      );
    }

    return user;
  };

/* =========================
   🚀 START CLASSIC GAME
========================= */

export const startClassicGame =
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
         🔎 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          args.roomId
        );
                /* =========================
   🔒 HOST VALIDATION
========================= */

if (!room) {
  throw new Error(
    "Room not found"
  );
}

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      /* =========================
         👑 HOST
      ========================= */

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can start the Classic game"
        );
      }

      /* =========================
         🎮 GAME MODE
      ========================= */

      if (
        room.gameMode !==
        "spy"
      ) {
        throw new Error(
          "Classic game is only available in Spy mode"
        );
      }

      /* =========================
         🎮 ROOM STATE
      ========================= */

      if (
        room.status !==
        "starting"
      ) {
        throw new Error(
          "Room is not ready to start"
        );
      }

      /* =========================
         🔒 PLAYER LIST
      ========================= */

      if (
        !room.playerListLocked
      ) {
        throw new Error(
          "Player list must be locked before starting the game"
        );
      }

      /* =========================
         🗂️ CATEGORY
      ========================= */

      if (
        !room.selectedCategory
      ) {
        throw new Error(
          "A category must be selected first"
        );
      }

      /* =========================
         👥 ROOM PLAYERS
      ========================= */

      const roomPlayers =
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
        roomPlayers.length <
        MIN_PLAYERS
      ) {
        throw new Error(
          `At least ${MIN_PLAYERS} players are required`
        );
      }

      if (
        roomPlayers.length >
        MAX_PLAYERS
      ) {
        throw new Error(
          `Maximum ${MAX_PLAYERS} players are allowed`
        );
      }

      if (
        roomPlayers.length >
        room.maxPlayers
      ) {
        throw new Error(
          "Room has more players than its configured limit"
        );
      }

      /* =========================
         🌐 CONNECTION CHECK
      ========================= */

      const disconnectedPlayer =
        roomPlayers.find(
          (player) =>
            !player.isConnected
        );

      if (
        disconnectedPlayer
      ) {
        throw new Error(
          "All players must be connected before the game starts"
        );
      }

      /* =========================
         🎮 CHECK EXISTING MATCH
      ========================= */

      const existingMatch =
        await ctx.db
          .query(
            "gameMatches"
          )
          .withIndex(
            "by_room_status",
            (q) =>
              q
                .eq(
                  "roomId",
                  room._id
                )
                .eq(
                  "status",
                  "playing"
                )
          )
          .first();

      if (existingMatch) {
        throw new Error(
          "A Classic game is already running in this room"
        );
      }

      /* =========================
         🎲 SELECT WORD PAIR
      ========================= */

      const selectedPair =
        selectClassicWordPair(
          room.selectedCategory
        );

      /* =========================
         🔄 50% WORD SWAP
      ========================= */

      /*
       * Normal:
       *
       * Villagers → villagerWord
       * Spy       → spyWord
       *
       * Swapped:
       *
       * Villagers → spyWord
       * Spy       → villagerWord
       */

      /* =========================
         🎭 ASSIGN ROLES
      ========================= */

      const assignedPlayers =
        assignClassicRoles(
          roomPlayers.map(
            (player) => ({
              userId:
                player.userId,
            })
          ),
          selectedPair.villagerWord,
          selectedPair.spyWord
        );

      /* =========================
         🔎 FIND SPY
      ========================= */

      const spyAssignment =
        assignedPlayers.find(
          (player) =>
            player.role ===
            "spy"
        );

      if (!spyAssignment) {
        throw new Error(
          "Failed to assign the spy"
        );
      }

      /* =========================
         🗂️ SPEAKING ORDER
      ========================= */

      const orderedPlayers =
        [...assignedPlayers]
          .sort(
            (a, b) =>
              a.speakingOrder -
              b.speakingOrder
          );

      if (
        orderedPlayers.length ===
        0
      ) {
        throw new Error(
          "Unable to create speaking order"
        );
      }

      /* =========================
         🎤 FIRST SPEAKER
      ========================= */

      const firstSpeaker =
        orderedPlayers[0];

      /* =========================
         ⏱️ MATCH START
      ========================= */

      const now =
        Date.now();

      const turnEndsAt =
        now +
        SPEAKING_SECONDS *
          1000;

      /* =========================
         🎮 CREATE MATCH
      ========================= */

      const matchId =
        await ctx.db.insert(
          "gameMatches",
          {
            roomId:
              room._id,

            gameMode:
              "spy",

            category:
              room.selectedCategory,

            status:
              "playing",

            currentRound:
              1,

            maxRounds:
              MAX_ROUNDS,

            winner:
              undefined,

            startedAt:
              now,

            finishedAt:
              undefined,

            wordPairId:
              selectedPair.pair.id,

            spyPlayerId:
              roomPlayers.find(
                (player) =>
                  player.userId ===
                  spyAssignment.userId
              )?._id,

            createdAt:
              now,

            updatedAt:
              now,
          }
        );

      /* =========================
         🔐 CREATE PRIVATE SECRETS
      ========================= */

      for (
        const player of
        assignedPlayers
      ) {
        const roomPlayer =
          roomPlayers.find(
            (roomPlayer) =>
              roomPlayer.userId ===
              player.userId
          );

        if (!roomPlayer) {
          throw new Error(
            "Room player not found while creating secret"
          );
        }

        await ctx.db.insert(
          "gamePlayerSecrets",
          {
            roomId:
              room._id,

            playerId:
              roomPlayer._id,

            userId:
              roomPlayer.userId,

            role:
              player.role,

            word:
              player.word,

            createdAt:
              now,
          }
        );

        /* =========================
           ❤️ RESET ALIVE STATE
        ========================= */

        await ctx.db.patch(
          roomPlayer._id,
          {
            isAlive:
              true,

            eliminatedAt:
              undefined,
          }
        );
      }

      /* =========================
         🎮 CREATE ROUND 1
      ========================= */

      const speakerOrder =
        orderedPlayers.map(
          (player) => {
            const roomPlayer =
              roomPlayers.find(
                (roomPlayer) =>
                  roomPlayer.userId ===
                  player.userId
              );

            if (!roomPlayer) {
              throw new Error(
                "Room player missing from speaking order"
              );
            }

            return roomPlayer._id;
          }
        );

      const roundId =
        await ctx.db.insert(
          "gameRounds",
          {
            roomId:
              room._id,

            roundNumber:
              1,

            phase:
              "speaking",

            speakerOrder,

            currentSpeakerIndex:
              0,

            speakersCompleted:
              0,

            turnEndsAt,

            votingEndsAt:
              undefined,

            isTieBreak:
              false,

            tieBreakOrder:
              undefined,

            tieBreakSpeakerIndex:
              undefined,

            eliminatedPlayerId:
              undefined,

            createdAt:
              now,

            updatedAt:
              now,
          }
        );

      /* =========================
         🏠 UPDATE ROOM
      ========================= */

      await ctx.db.patch(
        room._id,
        {
          status:
            "playing",

          updatedAt:
            now,
        }
      );

      /* =========================
         📦 RETURN
      ========================= */

      return {
        success: true,

        matchId,

        roundId,

        category:
          room.selectedCategory,

        roundNumber:
          1,

        phase:
          "speaking",

        currentSpeakerUserId:
          firstSpeaker.userId,

        turnStartedAt:
          now,

        turnEndsAt,

        wordsSwapped:
          selectedPair.wordsSwapped,
      };
    },
  });

/* =========================
   🔐 GET MY SECRET
========================= */

export const getMyClassicSecret =
  query({
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
        await getAuthenticatedUserForQuery(
          ctx
        );

      /* =========================
         🔎 SECRET
      ========================= */

      const secret =
        await ctx.db
          .query(
            "gamePlayerSecrets"
          )
          .withIndex(
            "by_room_user",
            (q) =>
              q
                .eq(
                  "roomId",
                  args.roomId
                )
                .eq(
                  "userId",
                  user._id
                )
          )
          .unique();

      if (!secret) {
        return null;
      }

      /* =========================
         🔐 RETURN ONLY MY DATA
      ========================= */

      return {
        role:
          secret.role,

        word:
          secret.word,
      };
    },
  });

/* =========================
   🎮 GET ACTIVE MATCH
========================= */

export const getActiveClassicMatch =
  query({
    args: {
      roomId:
        v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const match =
        await ctx.db
          .query(
            "gameMatches"
          )
          .withIndex(
            "by_room_status",
            (q) =>
              q
                .eq(
                  "roomId",
                  args.roomId
                )
                .eq(
                  "status",
                  "playing"
                )
          )
          .first();

      if (!match) {
        return null;
      }

      const round =
        await ctx.db
          .query(
            "gameRounds"
          )
          .withIndex(
            "by_room_round",
            (q) =>
              q
                .eq(
                  "roomId",
                  args.roomId
                )
                .eq(
                  "roundNumber",
                  match.currentRound
                )
          )
          .first();

      return {
        matchId:
          match._id,

        roomId:
          match.roomId,

        category:
          match.category,

        status:
          match.status,

        currentRound:
          match.currentRound,

        maxRounds:
          match.maxRounds,

        winner:
          match.winner,

        round:
          round
            ? {
                roundId:
                  round._id,

                roundNumber:
                  round.roundNumber,

                phase:
                  round.phase,

                currentSpeakerIndex:
                  round.currentSpeakerIndex,

                speakersCompleted:
                  round.speakersCompleted,

                turnEndsAt:
                  round.turnEndsAt,

                votingEndsAt:
                  round.votingEndsAt,

                isTieBreak:
                  round.isTieBreak,

                tieBreakSpeakerIndex:
                  round.tieBreakSpeakerIndex,

                eliminatedPlayerId:
                  round.eliminatedPlayerId,
              }
            : null,
      };
    },
  });