import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

import {
  selectClassicWordPair,
} from "./utils/pairSelector";

import { Id } from "../../../_generated/dataModel";
import {
  assignClassicRoles,
} from "./utils/roleAssigner";

/* =========================
   🎮 CONSTANTS
========================= */

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 8;

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
   INTERNAL HELPER
========================= */

export const startClassicGameInternal =
  async (
    ctx: MutationCtx,
    roomId: Id<"gameRooms">
  ) => {
    /* =========================
       🔎 ROOM
    ========================= */

    const room =
      await ctx.db.get(roomId);

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    /* =========================
       🎮 ROOM STATE
    ========================= */

    if (
      room.status !== "starting"
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
   🎲 RANDOM ROUND-1 SPEAKER
========================= */

const randomStartIndex =
  Math.floor(
    Math.random() *
      orderedPlayers.length
  );

const randomizedOrderedPlayers = [
  ...orderedPlayers.slice(
    randomStartIndex
  ),
  ...orderedPlayers.slice(
    0,
    randomStartIndex
  ),
];

/* =========================
   🎤 FIRST SPEAKER
========================= */

const firstSpeaker =
  randomizedOrderedPlayers[0];
    /* =========================
       ⏱️ MATCH START
    ========================= */

   const now = Date.now();

const ROUND_1_PRE_INTRO_SECONDS = 9.2;
const ROUND_1_INTRO_SECONDS = 3;

const roundIntroEndsAt =
  now +
  (ROUND_1_PRE_INTRO_SECONDS +
    ROUND_1_INTRO_SECONDS) *
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

        tieRoundCount:
            0,

          winner:
            undefined,

          startedAt:
            now,

          finishedAt:
            undefined,
wordPairId:
  selectedPair.pair.id,

/* 👥 ACTUAL WORDS ASSIGNED */
villagerWord:
  selectedPair.villagerWord,

spyWord:
  selectedPair.spyWord,

/* 🎯 SPY */
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
  randomizedOrderedPlayers.map(
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
  "roundIntro",

          speakerOrder,

          currentSpeakerIndex:
            0,

          speakersCompleted:
            0,

         turnEndsAt:
  undefined,

roundIntroEndsAt,

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
  "roundIntro",

      currentSpeakerUserId:
        firstSpeaker.userId,

      turnStartedAt:
        now,

     roundIntroEndsAt,

turnEndsAt:
  undefined,

votingEndsAt:
  undefined,

      wordsSwapped:
        selectedPair.wordsSwapped,
    };
  };


/* =========================
   🚀 HOST START CLASSIC GAME
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

      return await startClassicGameInternal(
        ctx,
        args.roomId
      );
    },
  });


  /* =========================
   🧪 DEV RESTART CLASSIC GAME
========================= */

export const restartClassicGame =
  mutation({
    args: {
      roomId:
        v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getAuthenticatedUser(
          ctx
        );

      const room =
        await ctx.db.get(
          args.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      /* 👑 HOST ONLY */
      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can restart the game"
        );
      }

      if (
        room.status !==
        "finished"
      ) {
        throw new Error(
          "Only a finished game can be restarted"
        );
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
         🎮 FINISHED MATCH
      ========================= */

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
                  room._id
                )
                .eq(
                  "status",
                  "finished"
                )
          )
          .order("desc")
          .first();

      if (!match) {
        throw new Error(
          "Finished Classic match not found"
        );
      }

      if (
        !match.winner ||
        !match.finishedAt
      ) {
        throw new Error(
          "Finished match is missing final result"
        );
      }

      /* =========================
         📊 BUILD MATCH HISTORY
      ========================= */

      const historyPlayers =
        await Promise.all(
          players.map(
            async (player) => {
              const secret =
                await ctx.db
                  .query(
                    "gamePlayerSecrets"
                  )
                  .withIndex(
                    "by_player",
                    (q) =>
                      q.eq(
                        "playerId",
                        player._id
                      )
                  )
                  .first();

              /*
               * Find the round in which
               * this player was eliminated.
               */
              const rounds =
                await ctx.db
                  .query(
                    "gameRounds"
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

              const eliminatedRound =
                player.eliminatedAt
                  ? rounds
                      .filter(
                        (round) =>
                          round.eliminatedPlayerId ===
                          player._id
                      )
                      .sort(
                        (a, b) =>
                          a.roundNumber -
                          b.roundNumber
                      )[0]
                      ?.roundNumber
                  : undefined;

              return {
                playerId:
                  player._id,

                userId:
                  player.userId,

                role:
                  secret?.role ??
                  (
                    match.spyPlayerId ===
                    player._id
                      ? "spy"
                      : "villager"
                  ),

                isAlive:
                  player.isAlive,

                eliminatedRound,

                eliminatedAt:
                  player.eliminatedAt,
              };
            }
          )
        );

      /* =========================
         💾 SAVE COMPLETE MATCH
      ========================= */

      await ctx.db.insert(
        "gameMatchHistory",
        {
          matchId:
            match._id,

          roomId:
            room._id,

          gameMode:
            match.gameMode,

          category:
            match.category,

          winner:
            match.winner,

          villagerWord:
            match.villagerWord ??
            "",

          spyWord:
            match.spyWord ??
            "",

          spyPlayerId:
            match.spyPlayerId!,

          currentRound:
            match.currentRound,

          tieRoundCount:
            match.tieRoundCount,

          completedAt:
            match.finishedAt,

          players:
            historyPlayers,
        }
      );

      /* =========================
         🗑️ DELETE OLD ROUNDS
         ONLY EPHEMERAL DATA
      ========================= */

      const rounds =
        await ctx.db
          .query(
            "gameRounds"
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

      for (
        const round of rounds
      ) {
        const votes =
          await ctx.db
            .query(
              "gameRoundVotes"
            )
            .withIndex(
              "by_round",
              (q) =>
                q.eq(
                  "roundId",
                  round._id
                )
            )
            .collect();

        for (
          const vote of votes
        ) {
          await ctx.db.delete(
            vote._id
          );
        }

        const tieVotes =
          await ctx.db
            .query(
              "gameTieBreakVotes"
            )
            .withIndex(
              "by_round",
              (q) =>
                q.eq(
                  "roundId",
                  round._id
                )
            )
            .collect();

        for (
          const vote of tieVotes
        ) {
          await ctx.db.delete(
            vote._id
          );
        }

        await ctx.db.delete(
          round._id
        );
      }

      /* =========================
         🔐 DELETE OLD SECRETS
      ========================= */

      const secrets =
        await ctx.db
          .query(
            "gamePlayerSecrets"
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

      for (
        const secret of secrets
      ) {
        await ctx.db.delete(
          secret._id
        );
      }

      /* =========================
         🗂️ DELETE OLD CATEGORY VOTES
      ========================= */

      const categoryVotes =
        await ctx.db
          .query(
            "gameClassicCategoryVotes"
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

      for (
        const vote of categoryVotes
      ) {
        await ctx.db.delete(
          vote._id
        );
      }

      /*
       * IMPORTANT:
       *
       * DO NOT DELETE gameMatches.
       *
       * Finished matches are now permanent
       * match records. The next game gets a
       * completely new matchId.
       */

      /* =========================
         ❤️ RESET PLAYERS
      ========================= */

      for (
        const player of players
      ) {
        await ctx.db.patch(
          player._id,
          {
            isAlive: true,

            eliminatedAt:
              undefined,
          }
        );
      }

      /* =========================
         🏠 RESET ROOM
      ========================= */

      const now =
        Date.now();

      await ctx.db.patch(
        room._id,
        {
          status:
            "lobby",

          playerListLocked:
            false,

          selectedCategory:
            undefined,

          categoryOptions:
            undefined,

          categorySelectionEndsAt:
            undefined,

          updatedAt:
            now,
        }
      );

      return {
        success: true,

        roomId:
          room._id,

        previousMatchId:
          match._id,

        historySaved:
          true,

        playerCount:
          players.length,
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

  /* =========================
   🏁 GET FINISHED CLASSIC GAME
========================= */

export const getFinishedClassicGame =
  query({
    args: {
      roomId:
        v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      await getAuthenticatedUserForQuery(
        ctx
      );

      const match =
        await ctx.db
          .query("gameMatches")
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
                  "finished"
                )
          )
          .order("desc")
          .first();

      if (!match) {
        return null;
      }

      const players =
        await ctx.db
          .query("gameRoomPlayers")
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                args.roomId
              )
          )
          .collect();

      const resultPlayers =
        await Promise.all(
          players.map(
            async (player) => {
              const user =
                await ctx.db.get(
                  player.userId
                );

              const secret =
                await ctx.db
                  .query(
                    "gamePlayerSecrets"
                  )
                  .withIndex(
                    "by_room",
                    (q) =>
                      q.eq(
                        "roomId",
                        args.roomId
                      )
                  )
                  .filter(
                    (q) =>
                      q.eq(
                        q.field(
                          "playerId"
                        ),
                        player._id
                      )
                  )
                  .first();

              return {
                playerId:
                  player._id,

                userId:
                  player.userId,

                name:
                  user?.username ??
                  "Unknown",

                avatar:
                  user?.image,

                isAlive:
                  player.isAlive,

                role:
                  secret?.role,
              };
            }
          )
        );

    return {
  matchId:
    match._id,

  roomId:
    match.roomId,

  category:
    match.category,

  winner:
    match.winner,

  villagerWord:
    match.villagerWord,

  spyWord:
    match.spyWord,

  currentRound:
    match.currentRound,

  tieRoundCount:
    match.tieRoundCount,

  finishedAt:
    match.finishedAt,

  players:
    resultPlayers,
};
    },
  });

/* =========================
   🔐 MY PRIVATE WORD
========================= */

export const getMyPrivateWord =
  query({
    args: {
      roomId:
        v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
    const user =
  await getAuthenticatedUserForQuery(
    ctx
  );
      const room =
        await ctx.db.get(
          args.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

   const match =
  await ctx.db
    .query("gameMatches")
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

      if (!match) {
        return null;
      }

      const player =
        await ctx.db
          .query(
            "gameRoomPlayers"
          )
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
          .unique();

      if (!player) {
        return null;
      }

      const isSpy =
        match.spyPlayerId ===
        player._id;

      return {
        role: isSpy
          ? "spy"
          : "villager",

        word: isSpy
          ? match.spyWord
          : match.villagerWord,

        matchId:
          match._id,
      };
    },
  });