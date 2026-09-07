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


const isCurrentSpeaker =
  currentPlayer.userId ===
  user._id;

if (
  args.force &&
  !isCurrentSpeaker
) {
  return {
    success: false,
    advanced: false,
    reason:
      "NOT_CURRENT_SPEAKER",
  };
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


  /* =========================
   ⚖️ START TIE-BREAK SPEAKING
========================= */

export const startTieBreakSpeaking =
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
        return {
          success: false,
          started: false,
          reason:
            "ROUND_NOT_TIE_BREAK",
        };
      }

      if (
        !round.isTieBreak
      ) {
        throw new Error(
          "Round is not marked as tie-break"
        );
      }

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
            round.roomId
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

/* =========================
   👑 HOST / FIRST SPEAKER
========================= */

const isHost =
(
  await ctx.db.get(
    round.roomId
  )
)?.hostId === user._id;

const firstTieBreakPlayerId =
  round.tieBreakOrder[0];

const isFirstTieBreakSpeaker =
  player._id ===
  firstTieBreakPlayerId;

/*
 * The host is allowed to coordinate
 * the start even if the host was
 * eliminated in an earlier round.
 *
 * A non-host must be the first tied
 * speaker and therefore must be alive.
 */
if (
  !isHost &&
  (
    !player.isAlive ||
    !isFirstTieBreakSpeaker
  )
) {
  return {
    success: false,
    started: false,
    reason:
      "NOT_AUTHORIZED",
  };
}

/*
 * The first tied speaker must always
 * be alive.
 */
const firstTieBreakPlayer =
  await ctx.db.get(
    firstTieBreakPlayerId
  );

if (
  !firstTieBreakPlayer ||
  !firstTieBreakPlayer.isAlive
) {
  throw new Error(
    "Tie-break player is not alive"
  );
}

/* =========================
   🔒 ALREADY STARTED
========================= */

if (
  round.tieBreakSpeakerIndex !==
  undefined
) {
  return {
    success: false,
    started: false,
    reason:
      "TIE_BREAK_ALREADY_STARTED",
  };
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

      const now =
        Date.now();

      const turnEndsAt =
        now +
        SPEAKING_SECONDS *
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
   ⚖️ ADVANCE TIE-BREAK TURN
========================= */

export const advanceTieBreakTurn =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),

      force:
        v.optional(
          v.boolean()
        ),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getAuthenticatedUser(
          ctx
        );

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
        return {
          success: false,
          advanced: false,
          reason:
            "ROUND_NOT_TIE_BREAK",
        };
      }

      if (
        !round.isTieBreak ||
        !round.tieBreakOrder
      ) {
        throw new Error(
          "Tie-break state is invalid"
        );
      }

      if (
        round.tieBreakSpeakerIndex ===
        undefined
      ) {
        throw new Error(
          "Tie-break speaking has not started"
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
          "Current tie-break speaker not found"
        );
      }

      /* =========================
         👑 AUTHORIZATION
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
        return {
          success: false,
          advanced: false,
          reason:
            "NOT_AUTHORIZED",
        };
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
          reason:
            "TURN_NOT_EXPIRED",
        };
      }

      /* =========================
         ➡️ NEXT SPEAKER
      ========================= */

      const nextIndex =
        round.tieBreakSpeakerIndex +
        1;

      /* =========================
         🗳️ ALL TIED PLAYERS SPOKE
      ========================= */

      if (
        nextIndex >=
        round.tieBreakOrder.length
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

isTieBreak:
  true,

tieBreakSpeakerIndex:
  undefined,

turnEndsAt:
  undefined,

votingEndsAt,

            updatedAt:
              now,
          }
        );

        return {
          success: true,

          advanced: true,

          phase:
            "voting",

          isTieBreak:
            true,

          votingEndsAt,
        };
      }

      /* =========================
         🎤 NEXT TIED PLAYER
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

      if (
        !nextPlayer.isAlive
      ) {
        throw new Error(
          "Next tie-break player is eliminated"
        );
      }

      const turnEndsAt =
        now +
        SPEAKING_SECONDS *
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

        advanced: true,

        phase:
          "tieBreak",

        isTieBreak:
          true,

       currentSpeakerId:
  nextPlayer._id,

        tieBreakSpeakerIndex:
          nextIndex,

        turnStartedAt:
          now,

        turnEndsAt,
      };
    },
  });

