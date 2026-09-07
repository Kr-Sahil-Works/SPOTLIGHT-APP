import { v } from "convex/values";
import { Id } from "../../../_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "../../../_generated/server";
import { getAuthenticatedUser } from "../../../users/users.core";

const MAX_TIE_ROUNDS = 15;

/* =========================
   🔁 START TIE-BREAK
========================= */

export const transitionToTieBreak =
  async (
    ctx: MutationCtx,
    round: {
      _id: Id<"gameRounds">;
      roomId: Id<"gameRooms">;
    },
    match: {
      _id: Id<"gameMatches">;
      tieRoundCount: number;
    },
    leaders: Id<"gameRoomPlayers">[],
  ) => {
    const now = Date.now();

    const nextTieRoundCount =
      match.tieRoundCount + 1;

   /* =========================
   ☠️ 16TH TIE → SPY WINS
========================= */

if (
  nextTieRoundCount >
  MAX_TIE_ROUNDS
) {
  /*
   * Do NOT finish the match here.
   *
   * result.ts is the single authority
   * responsible for closing the game.
   *
   * We only move this round into the
   * result phase with the special
   * tie-limit resolution.
   */

  await ctx.db.patch(
    match._id,
    {
      tieRoundCount:
        nextTieRoundCount,

      updatedAt:
        now,
    }
  );

  await ctx.db.patch(
    round._id,
    {
      phase:
        "result",

      resolution:
        "tie_limit_reached",

      tiedPlayerIds:
        leaders,

      eliminatedPlayerId:
        undefined,

      votingEndsAt:
        undefined,

      turnEndsAt:
        undefined,

      updatedAt:
        now,
    }
  );

  return {
    result:
      "tie_limit_reached" as const,

    winner:
      "spy" as const,

    tieRoundCount:
      nextTieRoundCount,

    gameFinished:
      true,
  };
}

    /* =========================
       🎲 RANDOMIZE TIE-BREAK ORDER
    ========================= */

    const randomizedTieBreakOrder =
      [...leaders];

    for (
      let i =
        randomizedTieBreakOrder.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        randomizedTieBreakOrder[i],
        randomizedTieBreakOrder[j],
      ] = [
        randomizedTieBreakOrder[j],
        randomizedTieBreakOrder[i],
      ];
    }

    /* =========================
       🔢 COUNT TIE ROUND
    ========================= */

    await ctx.db.patch(
      match._id,
      {
        tieRoundCount:
          nextTieRoundCount,

        updatedAt:
          now,
      }
    );

    /* =========================
       🔁 ENTER TIE-BREAK
    ========================= */

    await ctx.db.patch(
      round._id,
      {
        phase:
          "tieBreak",

        resolution:
          "tie_break",

        tiedPlayerIds:
          randomizedTieBreakOrder,

        tieRoundCount:
          nextTieRoundCount,

        isTieBreak:
          true,

        tieBreakOrder:
          randomizedTieBreakOrder,

        tieBreakSpeakerIndex:
          undefined,

        votingEndsAt:
          undefined,

        turnEndsAt:
          undefined,

        updatedAt:
          now,
      }
    );

    return {
      result:
        "tie_break" as const,

      tiedPlayerIds:
        randomizedTieBreakOrder,

      shouldStartTieBreak:
        true,

      tieRoundCount:
        nextTieRoundCount,
    };
  };

const getAuthenticatedUserForQuery =
  async (ctx: QueryCtx) => {
    const identity =
      await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
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
      throw new Error("User not found");
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
   🗳️ CAST TIE-BREAK VOTE
========================= */

export const castTieBreakVote =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),

      targetPlayerId:
        v.optional(
          v.id("gameRoomPlayers")
        ),

      skipped:
        v.boolean(),
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

      /* =========================
         🔒 TIE-BREAK ONLY
      ========================= */

      if (
        round.phase !== "voting" ||
        !round.isTieBreak
      ) {
        throw new Error(
          "Tie-break voting is not active"
        );
      }

      if (
        round.tieBreakSpeakerIndex !==
        undefined
      ) {
        throw new Error(
          "Tie-break speaking is still active"
        );
      }

      if (
        round.votingEndsAt ===
        undefined
      ) {
        throw new Error(
          "Tie-break voting has not started"
        );
      }

      const now = Date.now();

      if (
        now >= round.votingEndsAt
      ) {
        throw new Error(
          "Tie-break voting time has ended"
        );
      }

      /* =========================
         👤 VOTER
      ========================= */

      const voter =
        await ctx.db
          .query("gameRoomPlayers")
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
          "You are not a player in this room"
        );
      }

      if (!voter.isAlive) {
        throw new Error(
          "Eliminated players cannot vote"
        );
      }

      /* =========================
         🎯 TIED PLAYERS
      ========================= */

      const tieBreakOrder =
        round.tieBreakOrder ?? [];

      if (
        tieBreakOrder.length < 2
      ) {
        throw new Error(
          "Tie-break players are missing"
        );
      }

      const isTiedPlayer =
        tieBreakOrder.some(
          (playerId) =>
            playerId === voter._id
        );

      if (isTiedPlayer) {
        throw new Error(
          "Tied players cannot vote in the tie-break"
        );
      }

      /* =========================
         🔒 ONE VOTE
      ========================= */

      const existingVote =
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
                  voter._id
                )
          )
          .unique();

      if (existingVote) {
        return {
          success: true,
          alreadyVoted: true,
          skipped:
            existingVote.skipped,
          targetPlayerId:
            existingVote.targetId,
          allPlayersVoted: false,
          shouldFinalize: false,
        };
      }

      /* =========================
         ⏭️ SKIP
      ========================= */

      if (args.skipped) {
        await ctx.db.insert(
          "gameTieBreakVotes",
          {
            roundId:
              round._id,

            roomId:
              round.roomId,

            voterId:
              voter._id,

            targetId:
              undefined,

            skipped:
              true,

            createdAt:
              now,
          }
        );
      } else {
        /* =========================
           🎯 TARGET REQUIRED
        ========================= */

        if (
          !args.targetPlayerId
        ) {
          throw new Error(
            "Select a tied player or skip"
          );
        }

        if (
          args.targetPlayerId ===
          voter._id
        ) {
          throw new Error(
            "You cannot vote for yourself"
          );
        }

        /* =========================
           🎯 ONLY TIED TARGETS
        ========================= */

        const validTarget =
          tieBreakOrder.some(
            (playerId) =>
              playerId ===
              args.targetPlayerId
          );

        if (!validTarget) {
          throw new Error(
            "You can only vote for a tied player"
          );
        }

        const target =
          await ctx.db.get(
            args.targetPlayerId
          );

        if (!target) {
          throw new Error(
            "Target player not found"
          );
        }

        if (
          target.roomId !==
          round.roomId
        ) {
          throw new Error(
            "Target player is not in this room"
          );
        }

        if (!target.isAlive) {
          throw new Error(
            "You cannot vote for an eliminated player"
          );
        }

        await ctx.db.insert(
          "gameTieBreakVotes",
          {
            roundId:
              round._id,

            roomId:
              round.roomId,

            voterId:
              voter._id,

            targetId:
              target._id,

            skipped:
              false,

            createdAt:
              now,
          }
        );
      }

      /* =========================
         🗳️ COMPLETION
      ========================= */

      const alivePlayers =
        await ctx.db
          .query("gameRoomPlayers")
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                round.roomId
              )
          )
          .collect();

      const eligibleVoters =
        alivePlayers.filter(
          (player) =>
            player.isAlive &&
            !tieBreakOrder.some(
              (tiedPlayerId) =>
                tiedPlayerId ===
                player._id
            )
        );

      const votes =
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

      const votedPlayers =
        new Set(
          votes.map(
            (vote) =>
              vote.voterId.toString()
          )
        );

      const allPlayersVoted =
        eligibleVoters.every(
          (player) =>
            votedPlayers.has(
              player._id.toString()
            )
        );

      return {
        success: true,
        skipped:
          args.skipped,
        targetPlayerId:
          args.targetPlayerId,
        allPlayersVoted,
        shouldFinalize:
          allPlayersVoted,
      };
    },
  });

/* =========================
   📊 MY TIE-BREAK VOTE
========================= */

export const getMyTieBreakVote =
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
        await getAuthenticatedUserForQuery(
          ctx
        );

      const round =
        await ctx.db.get(
          args.roundId
        );

      if (!round) {
        return null;
      }

      if (
        !round.isTieBreak
      ) {
        return null;
      }

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
        return null;
      }

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
                  voter._id
                )
          )
          .unique();

      if (!vote) {
        return {
          hasVoted: false,
          skipped: false,
          targetPlayerId:
            undefined,
        };
      }

      return {
        hasVoted: true,
        skipped:
          vote.skipped,
        targetPlayerId:
          vote.targetId,
      };
    },
  });

/* =========================
   🏁 FINALIZE TIE-BREAK
========================= */

export const finalizeTieBreakVoting =
  mutation({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
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
        round.phase !== "voting" ||
        !round.isTieBreak
      ) {
        return {
          success: false,
          alreadyFinalized: true,
          reason:
            "TIE_BREAK_VOTING_NOT_ACTIVE",
        };
      }

      if (
        round.votingEndsAt ===
        undefined
      ) {
        return {
          success: false,
          alreadyFinalized: true,
          reason:
            "TIE_BREAK_VOTING_NOT_STARTED",
        };
      }

      const now = Date.now();

      const match =
        await ctx.db
          .query("gameMatches")
          .withIndex(
            "by_room_status",
            (q) =>
              q
                .eq(
                  "roomId",
                  round.roomId
                )
                .eq(
                  "status",
                  "playing"
                )
          )
          .first();

      if (!match) {
        throw new Error(
          "Active Classic match not found"
        );
      }

      const alivePlayers =
        await ctx.db
          .query("gameRoomPlayers")
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                round.roomId
              )
          )
          .collect();

      const eligibleVoters =
        alivePlayers.filter(
          (player) =>
            player.isAlive &&
            !round.tieBreakOrder?.some(
              (tiedPlayerId) =>
                tiedPlayerId ===
                player._id
            )
        );

      const votes =
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

      const allPlayersVoted =
        eligibleVoters.every(
          (player) =>
            votes.some(
              (vote) =>
                vote.voterId ===
                player._id
            )
        );

      const timerExpired =
        now >=
        round.votingEndsAt;

      if (
        !allPlayersVoted &&
        !timerExpired
      ) {
        throw new Error(
          "Tie-break voting is still active"
        );
      }

      /* =========================
         📊 COUNT
      ========================= */

      const voteCounts =
        new Map<string, number>();

      for (
        const vote of votes
      ) {
        if (
          vote.skipped ||
          !vote.targetId
        ) {
          continue;
        }

        const key =
          vote.targetId.toString();

        voteCounts.set(
          key,
          (
            voteCounts.get(key) ??
            0
          ) + 1
        );
      }

      /* =========================
         ⏭️ ALL SKIP
      ========================= */

      if (
        voteCounts.size === 0
      ) {
        await ctx.db.patch(
          round._id,
          {
            phase: "result",
            resolution:
              "tie_break_no_elimination",
            eliminatedPlayerId:
              undefined,
            votingEndsAt:
              undefined,
            turnEndsAt:
              undefined,
            updatedAt: now,
          }
        );

        return {
          success: true,
          result:
            "tie_break_no_elimination",
        };
      }

      const highest =
        Math.max(
          ...voteCounts.values()
        );

      const leaders =
        Array.from(
          voteCounts.entries()
        )
          .filter(
            ([, count]) =>
              count === highest
          )
          .map(
            ([playerId]) =>
              playerId
          );

      /* =========================
         ⚖️ STILL TIED
      ========================= */

      if (
        leaders.length > 1
      ) {
      const tiedPlayerIds =
  leaders.map(
    (id) =>
      id as Id<"gameRoomPlayers">
  );

        await ctx.db.patch(
          round._id,
          {
            phase: "result",
            resolution:
              "tie_break_no_elimination",
            tiedPlayerIds,
            eliminatedPlayerId:
              undefined,
            votingEndsAt:
              undefined,
            turnEndsAt:
              undefined,
            updatedAt: now,
          }
        );

        return {
          success: true,
          result:
            "tie_break_no_elimination",
          tiedPlayerIds,
        };
      }

      /* =========================
         🎯 ELIMINATE
      ========================= */

   const eliminatedId =
  leaders[0] as Id<"gameRoomPlayers">;

      const eliminatedPlayer =
        await ctx.db.get(
          eliminatedId
        );

      if (!eliminatedPlayer) {
        throw new Error(
          "Eliminated player not found"
        );
      }

      if (
        !eliminatedPlayer.isAlive
      ) {
        throw new Error(
          "Player has already been eliminated"
        );
      }

      await ctx.db.patch(
        eliminatedPlayer._id,
        {
          isAlive: false,
          eliminatedAt: now,
        }
      );

      const remainingAlivePlayers =
        alivePlayers.filter(
          (player) =>
            player.isAlive &&
            player._id !==
              eliminatedPlayer._id
        );

      const spyEliminated =
        match.spyPlayerId ===
        eliminatedPlayer._id;

      const gameOver =
        spyEliminated ||
        remainingAlivePlayers.length <= 2;

   if (gameOver) {
  /*
   * Do not finish the match here.
   *
   * The eliminated player is recorded on
   * the round, then result.ts decides the
   * actual winner and closes the match.
   */

  await ctx.db.patch(
    round._id,
    {
      phase:
        "result",

      resolution:
        "game_over",

      eliminatedPlayerId:
        eliminatedPlayer._id,

      votingEndsAt:
        undefined,

      turnEndsAt:
        undefined,

      updatedAt:
        now,
    }
  );

  return {
    success: true,

    result:
      "game_over",

    winner:
      spyEliminated
        ? "villagers"
        : "spy",

    eliminatedPlayerId:
      eliminatedPlayer._id,

    gameFinished:
      true,
  };
}

      await ctx.db.patch(
        round._id,
        {
          phase: "result",
          resolution:
            "eliminated",
          eliminatedPlayerId:
            eliminatedPlayer._id,
          votingEndsAt:
            undefined,
          turnEndsAt:
            undefined,
          updatedAt: now,
        }
      );

      return {
        success: true,
        result: "eliminated",
        eliminatedPlayerId:
          eliminatedPlayer._id,
      };
    },
  });