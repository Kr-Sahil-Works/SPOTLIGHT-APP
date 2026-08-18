import {
  mutation,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

const SPEAKING_SECONDS = 30;
const VOTING_SECONDS = 20;

/* =========================
   🎤 ADVANCE SPEAKING TURN
========================= */

export const advanceClassicTurn =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),
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

      /* =========================
         🎮 PHASE
      ========================= */

      if (
        round.phase !==
        "speaking"
      ) {
        throw new Error(
          "Round is not in speaking phase"
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
         👤 CURRENT SPEAKER
      ========================= */

      const currentPlayerId =
        round.speakerOrder[
          round.currentSpeakerIndex
        ];

      if (!currentPlayerId) {
        throw new Error(
          "Current speaker not found"
        );
      }

      const currentPlayer =
        await ctx.db.get(
          currentPlayerId
        );

      if (!currentPlayer) {
        throw new Error(
          "Current speaker not found"
        );
      }

      /* =========================
         👑 AUTHORIZATION
      ========================= */

 const isHost =
  room.hostId ===
  user._id;

const isCurrentSpeaker =
  currentPlayer.userId ===
  user._id;

if (
  !currentPlayer.isAlive
) {
  throw new Error(
    "Eliminated players cannot speak"
  );
}

if (
  !isHost &&
  !isCurrentSpeaker
) {
  throw new Error(
    "Only the current speaker or host can advance the turn"
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
          "Current speaking time has not ended"
        );
      }

      /* =========================
         👥 GET ALIVE PLAYERS
      ========================= */

      const alivePlayers = [];

      for (
        const playerId of
        round.speakerOrder
      ) {
        const player =
          await ctx.db.get(
            playerId
          );

        if (
          player &&
          player.isAlive
        ) {
          alivePlayers.push(
            player
          );
        }
      }

      if (
        alivePlayers.length < 2
      ) {
        throw new Error(
          "Not enough alive players"
        );
      }

      /* =========================
         🔢 COMPLETE CURRENT SPEAKER
      ========================= */

      const speakersCompleted =
        round.speakersCompleted + 1;

      /* =========================
         🗳️ SPEAKING ROUND COMPLETE
      ========================= */

      /*
       * When every alive player has
       * spoken once, immediately move
       * to voting.
       */

      if (
        speakersCompleted >=
        alivePlayers.length
      ) {
        const votingEndsAt =
          now +
          VOTING_SECONDS *
            1000;

        await ctx.db.patch(
          round._id,
          {
            phase:
              "voting",

            speakersCompleted,

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

          roundId:
            round._id,

          roundNumber:
            round.roundNumber,

          votingEndsAt,
        };
      }

      /* =========================
         🔎 FIND NEXT ALIVE PLAYER
      ========================= */

      let nextIndex =
        round.currentSpeakerIndex;

      let nextPlayerId =
        undefined;

      for (
        let step = 1;
        step <=
          round.speakerOrder.length;
        step++
      ) {
        const index =
          (
            round.currentSpeakerIndex +
            step
          ) %
          round.speakerOrder.length;

        const candidateId =
          round.speakerOrder[
            index
          ];

        const candidate =
          await ctx.db.get(
            candidateId
          );

        if (
          candidate &&
          candidate.isAlive
        ) {
          nextIndex =
            index;

          nextPlayerId =
            candidateId;

          break;
        }
      }

      if (
        !nextPlayerId
      ) {
        throw new Error(
          "Unable to determine next speaker"
        );
      }

      /* =========================
         🎤 NEXT SPEAKER TIMER
      ========================= */

      const turnEndsAt =
        now +
        SPEAKING_SECONDS *
          1000;

      await ctx.db.patch(
        round._id,
        {
          currentSpeakerIndex:
            nextIndex,

          speakersCompleted,

          turnEndsAt,

          updatedAt:
            now,
        }
      );

      return {
        success: true,

        phase:
          "speaking",

        roundId:
          round._id,

        roundNumber:
          round.roundNumber,

        currentSpeakerId:
          nextPlayerId,

        turnStartedAt:
          now,

        turnEndsAt,
      };
    },
  });