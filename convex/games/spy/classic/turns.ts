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

  force:
    v.optional(v.boolean()),
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
  return {
    success: false,
    advanced: false,
    reason:
      "ROUND_NOT_SPEAKING",
  };
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

      const isHost =
  room.hostId ===
  user._id;

const isCurrentSpeaker =
  currentPlayer.userId ===
  user._id;

if (
  args.force &&
  !isCurrentSpeaker
) {
  throw new Error(
    "Only the current speaker can skip their turn"
  );
}

/* =========================
   ⏱️ TIMER
========================= */

const now =
  Date.now();

if (
  !args.force &&
  round.turnEndsAt !==
    undefined &&
  now <
    round.turnEndsAt
) {
  return {
    success: false,
    advanced: false,
    reason: "TURN_NOT_EXPIRED",
  };
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


  export const startClassicSpeaking =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
      await getAuthenticatedUser(ctx);

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
        "roundIntro"
      ) {
        return {
          success: false,
          advanced: false,
          reason:
            "ROUND_NOT_INTRO",
        };
      }

      const now =
        Date.now();

      if (
        round.roundIntroEndsAt !==
          undefined &&
        now <
          round.roundIntroEndsAt
      ) {
        return {
          success: false,
          advanced: false,
          reason:
            "INTRO_NOT_EXPIRED",
        };
      }

      /* Find first alive speaker */

      let speakerIndex =
        -1;

      for (
        let i = 0;
        i <
          round.speakerOrder.length;
        i++
      ) {
        const player =
          await ctx.db.get(
            round.speakerOrder[i]
          );

        if (
          player &&
          player.isAlive
        ) {
          speakerIndex = i;
          break;
        }
      }

      if (speakerIndex === -1) {
        throw new Error(
          "No alive speaker found"
        );
      }

      const turnEndsAt =
        now +
        SPEAKING_SECONDS *
          1000;

      await ctx.db.patch(
        round._id,
        {
          phase: "speaking",

          currentSpeakerIndex:
            speakerIndex,

          speakersCompleted: 0,

          turnEndsAt,

          roundIntroEndsAt:
            undefined,

          updatedAt: now,
        }
      );

      return {
        success: true,
        phase: "speaking",
        currentSpeakerId:
          round.speakerOrder[
            speakerIndex
          ],
        turnEndsAt,
      };
    },
  });