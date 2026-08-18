import {
  mutation,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

const TIE_BREAK_SPEAKING_SECONDS = 30;

/* =========================
   ⚖️ START TIE-BREAK
========================= */

export const startTieBreak =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getAuthenticatedUser(
          ctx
        );

      /* =========================
         🔎 ROUND
      ========================= */

      const round =
        await ctx.db.get(
          args.roundId
        );

      if (!round) {
        throw new Error(
          "Round not found"
        );
      }

      if (
        round.phase !==
        "tieBreak"
      ) {
        throw new Error(
          "Round is not in tie-break phase"
        );
      }

      /* =========================
         🏠 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          round.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      /* =========================
         👤 PLAYER
      ========================= */

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
        throw new Error(
          "You are not a player in this room"
        );
      }

      if (!player.isAlive) {
        throw new Error(
          "Eliminated players cannot start a tie-break"
        );
      }

      /* =========================
         🔒 ALREADY STARTED
      ========================= */

      if (
        round.tieBreakSpeakerIndex !==
        undefined
      ) {
        throw new Error(
          "Tie-break has already started"
        );
      }

      /* =========================
         🎯 TIED PLAYERS
      ========================= */

      if (
        !round.tieBreakOrder ||
        round.tieBreakOrder.length <
          2
      ) {
        throw new Error(
          "Tie-break players are missing"
        );
      }

      /* =========================
         👥 VERIFY TIED PLAYERS
      ========================= */

      const validTiedPlayers = [];

      for (
        const playerId of
        round.tieBreakOrder
      ) {
        const tiedPlayer =
          await ctx.db.get(
            playerId
          );

        if (
          tiedPlayer &&
          tiedPlayer.isAlive
        ) {
          validTiedPlayers.push(
            tiedPlayer._id
          );
        }
      }

      if (
        validTiedPlayers.length <
        2
      ) {
        throw new Error(
          "Not enough alive players for tie-break"
        );
      }

      /* =========================
         ⏱️ FIRST TIE-BREAK TURN
      ========================= */

      const now =
        Date.now();

      const turnEndsAt =
        now +
        TIE_BREAK_SPEAKING_SECONDS *
          1000;

      await ctx.db.patch(
        round._id,
        {
          phase:
            "tieBreak",

          isTieBreak:
            true,

          tieBreakOrder:
            validTiedPlayers,

          tieBreakSpeakerIndex:
            0,

          turnEndsAt,

          votingEndsAt:
            undefined,

          updatedAt:
            now,
        }
      );

      return {
        success: true,

        phase:
          "tieBreak",

        tieBreakOrder:
          validTiedPlayers,

        tieBreakSpeakerIndex:
          0,

        currentSpeakerId:
          validTiedPlayers[0],

        turnStartedAt:
          now,

        turnEndsAt,
      };
    },
  });

/* =========================
   🎤 ADVANCE TIE-BREAK TURN
========================= */

export const advanceTieBreakTurn =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getAuthenticatedUser(
          ctx
        );

      /* =========================
         🔎 ROUND
      ========================= */

      const round =
        await ctx.db.get(
          args.roundId
        );

      if (!round) {
        throw new Error(
          "Round not found"
        );
      }

      if (
        round.phase !==
        "tieBreak"
      ) {
        throw new Error(
          "Round is not in tie-break phase"
        );
      }

      if (
        !round.tieBreakOrder
      ) {
        throw new Error(
          "Tie-break order is missing"
        );
      }

      if (
        round.tieBreakSpeakerIndex ===
        undefined
      ) {
        throw new Error(
          "Tie-break has not started"
        );
      }

      /* =========================
         👤 CURRENT SPEAKER
      ========================= */

      const currentPlayerId =
        round.tieBreakOrder[
          round.tieBreakSpeakerIndex
        ];

      if (!currentPlayerId) {
        throw new Error(
          "Current tie-break speaker not found"
        );
      }

      const currentPlayer =
        await ctx.db.get(
          currentPlayerId
        );

      if (!currentPlayer) {
        throw new Error(
          "Current tie-break player not found"
        );
      }

      /* =========================
         🏠 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          round.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      /* =========================
         👤 AUTHORIZATION
      ========================= */

      const isHost =
        room.hostId ===
        user._id;

      const isCurrentSpeaker =
        currentPlayer.userId ===
        user._id;

      if (
        !isHost &&
        !isCurrentSpeaker
      ) {
        throw new Error(
          "Only the current speaker or host can advance the tie-break"
        );
      }

      /* =========================
         ⏱️ TIMER
      ========================= */

      const now =
        Date.now();

      if (
        round.turnEndsAt !==
          undefined &&
        now <
          round.turnEndsAt
      ) {
        throw new Error(
          "Current tie-break speaking time has not ended"
        );
      }

      /* =========================
         ➡️ NEXT INDEX
      ========================= */

      const nextIndex =
        round.tieBreakSpeakerIndex +
        1;

      /* =========================
         🗳️ SPEAKING COMPLETE
      ========================= */

      if (
        nextIndex >=
        round.tieBreakOrder.length
      ) {
        const votingEndsAt =
          now + 20_000;

        await ctx.db.patch(
          round._id,
          {
            phase:
              "voting",

            isTieBreak:
              true,

            turnEndsAt:
              undefined,

            votingEndsAt,

            updatedAt:
              now,
          }
        );

        return {
          success: true,

          phase:
            "voting",

          isTieBreak:
            true,

          votingEndsAt,
        };
      }

      /* =========================
         🎤 NEXT SPEAKER
      ========================= */

      const nextPlayerId =
        round.tieBreakOrder[
          nextIndex
        ];

      const nextPlayer =
        await ctx.db.get(
          nextPlayerId
        );

      if (!nextPlayer) {
        throw new Error(
          "Next tie-break player not found"
        );
      }

      const turnEndsAt =
        now +
        TIE_BREAK_SPEAKING_SECONDS *
          1000;

      await ctx.db.patch(
        round._id,
        {
          tieBreakSpeakerIndex:
            nextIndex,

          turnEndsAt,

          updatedAt:
            now,
        }
      );

      return {
        success: true,

        phase:
          "tieBreak",

        isTieBreak:
          true,

        currentSpeakerId:
          nextPlayer.userId,

        tieBreakSpeakerIndex:
          nextIndex,

        turnStartedAt:
          now,

        turnEndsAt,
      };
    },
  });