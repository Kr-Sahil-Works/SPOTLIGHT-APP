import {
  query,
} from "../../../_generated/server";

import { v } from "convex/values";

import type {
  QueryCtx,
} from "../../../_generated/server";

/* =========================
   🔐 CURRENT USER
========================= */

const getCurrentUser =
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
   🎮 GET CLASSIC GAME STATE
========================= */

export const getClassicGameState =
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
        await getCurrentUser(
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
        throw new Error(
          "Room not found"
        );
      }

      /* =========================
         👤 MY PLAYER
      ========================= */

      const myPlayer =
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

      if (!myPlayer) {
        throw new Error(
          "You are not a player in this room"
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

      /* =========================
         🎯 CURRENT ROUND
      ========================= */

      const round =
        match
          ? await ctx.db
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
                      match.currentRound
                    )
              )
              .first()
          : null;

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
         👤 SAFE PLAYER DATA
      ========================= */

 const safePlayers =
  players.map(
    (player) => ({
      playerId:
        player._id,

      userId:
        player.userId,

      isHost:
        player.isHost,

      isAlive:
        player.isAlive,

      isConnected:
        player.isConnected,

      joinedAt:
        player.joinedAt,
    })
  );

      /* =========================
         🎤 CURRENT SPEAKER
      ========================= */

      let currentSpeaker =
        null;

      if (
        round &&
        round.phase ===
          "speaking"
      ) {
        const speakerId =
          round.speakerOrder[
            round.currentSpeakerIndex
          ];

        if (speakerId) {
          const speaker =
            await ctx.db.get(
              speakerId
            );

          if (speaker) {
            currentSpeaker = {
              playerId:
                speaker._id,

              userId:
                speaker.userId,
            };
          }
        }
      }

      /* =========================
         🔐 MY SECRET
      ========================= */

      const mySecret =
        match
          ? await ctx.db
              .query(
                "gamePlayerSecrets"
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
              .first()
          : null;

      /* =========================
         🗳️ MY VOTE STATUS
      ========================= */

      let hasVoted =
        false;

    if (
  round &&
  (
    round.phase ===
      "voting" ||
    round.phase ===
      "tieBreak"
  )
) {
        if (
          round.isTieBreak
        ) {
          const vote =
            await ctx.db
              .query(
                "gameTieBreakVotes"
              )
              .withIndex(
                "by_round_voter",
                (q) =>
                  q
                    .eq(
                      "roundId",
                      round._id
                    )
                    .eq(
                      "voterId",
                      myPlayer._id
                    )
              )
              .first();

          hasVoted =
            vote !== null;
        } else {
          const vote =
            await ctx.db
              .query(
                "gameRoundVotes"
              )
              .withIndex(
                "by_round_voter",
                (q) =>
                  q
                    .eq(
                      "roundId",
                      round._id
                    )
                    .eq(
                      "voterId",
                      myPlayer._id
                    )
              )
              .first();

          hasVoted =
            vote !== null;
        }
      }

      /* =========================
         ⚖️ TIE-BREAK PLAYERS
      ========================= */

   const tieBreakPlayers =
  round?.isTieBreak
    ? round.tieBreakOrder ??
      []
    : [];


        
      /* =========================
         📦 RETURN
      ========================= */

      return {
        room: {
          roomId:
            room._id,

          status:
            room.status,

          category:
            room.selectedCategory,

          categoryOptions:
            room.categoryOptions,

          categorySelectionEndsAt:
            room.categorySelectionEndsAt,
        },

        match: match
          ? {
              matchId:
                match._id,

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

              startedAt:
                match.startedAt,

              finishedAt:
                match.finishedAt,
            }
          : null,

        round: round
          ? {
              roundId:
                round._id,

              roundNumber:
                round.roundNumber,

              phase:
                round.phase,

                roundIntroEndsAt:
  round.roundIntroEndsAt,
  
              speakerOrder:
                round.speakerOrder,

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

              tieBreakOrder:
                round.tieBreakOrder,

              tieBreakSpeakerIndex:
                round.tieBreakSpeakerIndex,

              eliminatedPlayerId:
                round.eliminatedPlayerId,
            }
          : null,

        currentSpeaker,

        players:
          safePlayers,

        myPlayer: {
          playerId:
            myPlayer._id,

          userId:
            myPlayer.userId,

          isHost:
            myPlayer.isHost,

          isAlive:
            myPlayer.isAlive,
        },

        mySecret,

        hasVoted,

        tieBreakPlayers,
      };
    },
  });

/* =========================
   🗳️ GET VOTING STATE
========================= */

export const getClassicVotingState =
  query({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getCurrentUser(
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
         👤 MY PLAYER
      ========================= */

      const voter =
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

      if (!voter) {
        throw new Error(
          "Player not found"
        );
      }

      /* =========================
         🗳️ VOTES
      ========================= */

      const votes =
        round.isTieBreak
          ? await ctx.db
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
              .collect()
          : await ctx.db
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

      /* =========================
         📊 VOTE COUNTS
      ========================= */

      const voteCounts =
        new Map<
          string,
          number
        >();

      for (
        const vote of votes
      ) {
        if (
          vote.skipped
        ) {
          continue;
        }

        if (
          !vote.targetId
        ) {
          continue;
        }

        const key =
          vote.targetId.toString();

        voteCounts.set(
          key,
          (
            voteCounts.get(
              key
            ) ?? 0
          ) + 1
        );
      }

      /* =========================
         🏁 RETURN
      ========================= */

      return {
        roundId:
          round._id,

        phase:
          round.phase,

        isTieBreak:
          round.isTieBreak,

        votingEndsAt:
          round.votingEndsAt,

        voterId:
          voter._id,

        votes,

        voteCounts:
          Object.fromEntries(
            voteCounts
          ),
      };
    },
  });