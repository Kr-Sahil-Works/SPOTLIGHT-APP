import {
  mutation,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";


/* =========================
   🎮 START NEXT ROUND
========================= */

export const startNextRound =
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
         🔎 CURRENT ROUND
      ========================= */

      const currentRound =
        await ctx.db.get(
          args.roundId
        );

      if (!currentRound) {
        throw new Error(
          "Round not found"
        );
      }

      if (
        currentRound.phase !==
        "result"
      ) {
        throw new Error(
          "Current round is not finished"
        );
      }

      /* =========================
         🏠 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          currentRound.roomId
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
          "Only the host can start the next round"
        );
      }

      /* =========================
         🎮 ACTIVE MATCH
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
                  "playing"
                )
          )
          .first();

if (!match) {
  throw new Error(
    "Active match not found"
  );
}

if (
  match.status !==
  "playing"
) {
  throw new Error(
    "Game has already finished"
  );
}
      /* =========================
         🔢 MAX ROUNDS
      ========================= */

      if (
        match.currentRound >=
        match.maxRounds
      ) {
        throw new Error(
          "Maximum rounds reached"
        );
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
         ❤️ ALIVE PLAYERS ONLY
      ========================= */

      const alivePlayers =
        players.filter(
          (player) =>
            player.isAlive
        );

      if (
        alivePlayers.length <
        2
      ) {
        throw new Error(
          "Not enough alive players for another round"
        );
      }

      /* =========================
         🗑️ PREVENT DUPLICATE ROUND
      ========================= */

      const existingRound =
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
                  room._id
                )
                .eq(
                  "roundNumber",
                  match.currentRound + 1
                )
          )
          .first();

      if (existingRound) {
        throw new Error(
          "Next round already exists"
        );
      }

      /* =========================
         🔀 CREATE SPEAKING ORDER
      ========================= */

      /*
       * Keep the original room
       * order but remove eliminated
       * players.
       */

      const aliveIds =
        new Set(
          alivePlayers.map(
            (player) =>
              player._id.toString()
          )
        );

      const previousOrder =
        currentRound.speakerOrder;

      const nextSpeakerOrder =
        previousOrder.filter(
          (playerId) =>
            aliveIds.has(
              playerId.toString()
            )
        );

      /*
       * Safety:
       * Any alive player missing
       * from the previous order is
       * appended.
       */

      for (
        const player of
        alivePlayers
      ) {
        const alreadyIncluded =
          nextSpeakerOrder.some(
            (playerId) =>
              playerId ===
              player._id
          );

        if (
          !alreadyIncluded
        ) {
          nextSpeakerOrder.push(
            player._id
          );
        }
      }

      if (
        nextSpeakerOrder.length <
        2
      ) {
        throw new Error(
          "Unable to create speaking order"
        );
      }

      /* =========================
         🎲 ROTATE ORDER
      ========================= */

      /*
       * Start from the player
       * after the previous round's
       * first speaker.
       */

      const previousFirst =
        currentRound
          .speakerOrder[0];

      const previousFirstIndex =
        nextSpeakerOrder.findIndex(
          (playerId) =>
            playerId ===
            previousFirst
        );

      let finalSpeakerOrder =
        nextSpeakerOrder;

      if (
        previousFirstIndex !==
        -1
      ) {
        const rotateBy =
          (
            previousFirstIndex +
            1
          ) %
          nextSpeakerOrder.length;

        finalSpeakerOrder = [
          ...nextSpeakerOrder.slice(
            rotateBy
          ),
          ...nextSpeakerOrder.slice(
            0,
            rotateBy
          ),
        ];
      }

      /* =========================
         🎤 FIRST SPEAKER
      ========================= */

      const firstSpeakerId =
        finalSpeakerOrder[0];

      const firstSpeaker =
        await ctx.db.get(
          firstSpeakerId
        );

      if (!firstSpeaker) {
        throw new Error(
          "First speaker not found"
        );
      }

/* =========================
   ⏱️ ROUND INTRO TIMER
========================= */

const now =
  Date.now();

const ROUND_INTRO_SECONDS = 8;

const roundIntroEndsAt =
  now +
  ROUND_INTRO_SECONDS * 1000;

const nextRoundNumber =
  match.currentRound + 1;
      /* =========================
         🎮 CREATE ROUND
      ========================= */

      const nextRoundId =
        await ctx.db.insert(
          "gameRounds",
          {
            roomId:
              room._id,

            roundNumber:
              nextRoundNumber,

           phase:
  "roundIntro",

            speakerOrder:
              finalSpeakerOrder,

            currentSpeakerIndex:
              0,

            speakersCompleted:
              0,

         roundIntroEndsAt,

turnEndsAt:
  undefined,

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
         🎮 UPDATE MATCH
      ========================= */

      await ctx.db.patch(
        match._id,
        {
          currentRound:
            nextRoundNumber,

          updatedAt:
            now,
        }
      );

   return {
  success: true,

  roundId:
    nextRoundId,

  roundNumber:
    nextRoundNumber,

  phase:
    "roundIntro",

  currentSpeakerUserId:
    firstSpeaker.userId,

  turnStartedAt:
    undefined,

  roundIntroEndsAt,

  turnEndsAt:
    undefined,

  votingEndsAt:
    undefined,

  alivePlayerCount:
    alivePlayers.length,
};
    },
  });