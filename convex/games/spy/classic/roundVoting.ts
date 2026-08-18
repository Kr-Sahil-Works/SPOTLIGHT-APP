import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "../../../_generated/server";

import { v } from "convex/values";

import { Id } from "../../../_generated/dataModel";
import { getAuthenticatedUser } from "../../../users/users.core";

const VOTING_SECONDS = 20;

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
   🔎 GET ROUND
========================= */

const getRound = async (
  ctx: MutationCtx,
  roundId: Parameters<
    typeof ctx.db.get
  >[0]
) => {
  return await ctx.db.get(
    roundId as any
  );
};

/* =========================
   🚀 START VOTING
========================= */

export const startRoundVoting =
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
        "voting"
      ) {
        throw new Error(
          "Round is not ready for voting"
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
         👑 HOST
      ========================= */

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can start voting"
        );
      }

      /* =========================
         ⏱️ ALREADY STARTED
      ========================= */

      if (
        round.votingEndsAt !==
        undefined
      ) {
        throw new Error(
          "Voting has already started"
        );
      }

      const now =
        Date.now();

      const votingEndsAt =
        now +
        VOTING_SECONDS *
          1000;

      await ctx.db.patch(
        round._id,
        {
          votingEndsAt,
          updatedAt: now,
        }
      );

      return {
        success: true,
        votingEndsAt,
      };
    },
  });

/* =========================
   🗳️ CAST VOTE
========================= */

export const castRoundVote =
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
        "voting"
      ) {
        throw new Error(
          "Voting is not active"
        );
      }

      if (
        round.votingEndsAt ===
        undefined
      ) {
        throw new Error(
          "Voting has not started"
        );
      }

      const now =
        Date.now();

      if (
        now >=
        round.votingEndsAt
      ) {
        throw new Error(
          "Voting time has ended"
        );
      }

      /* =========================
         👤 VOTER
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
          "You are not a player in this room"
        );
      }

      if (!voter.isAlive) {
        throw new Error(
          "Eliminated players cannot vote"
        );
      }

      /* =========================
         🎯 TIE-BREAK TARGETS
      ========================= */

      let allowedTargetIds:
        string[] | undefined =
        undefined;

      if (
        round.isTieBreak
      ) {
        if (
          !round.tieBreakOrder
        ) {
          throw new Error(
            "Tie-break players are missing"
          );
        }

        allowedTargetIds =
          round.tieBreakOrder.map(
            (id) =>
              id.toString()
          );

        /*
         * During tie-break only
         * tied players can be voted.
         */
      }

      /* =========================
         🔒 ONE VOTE
      ========================= */

      if (
        round.isTieBreak
      ) {
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
          throw new Error(
            "You have already voted in the tie-break"
          );
        }
      } else {
        const existingVote =
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
                    voter._id
                  )
            )
            .unique();

        if (existingVote) {
          throw new Error(
            "You have already voted"
          );
        }
      }

      /* =========================
         ⏭️ SKIP
      ========================= */

      if (args.skipped) {
        if (
          round.isTieBreak
        ) {
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
          await ctx.db.insert(
            "gameRoundVotes",
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
        }

        return {
          success: true,
          skipped: true,
          isTieBreak:
            round.isTieBreak,
        };
      }

      /* =========================
         🎯 TARGET REQUIRED
      ========================= */

      if (
        !args.targetPlayerId
      ) {
        throw new Error(
          "Select a player or skip"
        );
      }

      /* =========================
         🚫 SELF VOTE
      ========================= */

      if (
        args.targetPlayerId ===
        voter._id
      ) {
        throw new Error(
          "You cannot vote for yourself"
        );
      }

      /* =========================
         🎯 TIE-BREAK RESTRICTION
      ========================= */

      if (
        round.isTieBreak &&
        allowedTargetIds &&
        !allowedTargetIds.includes(
          args.targetPlayerId.toString()
        )
      ) {
        throw new Error(
          "You can only vote for a tied player"
        );
      }

      /* =========================
         👤 FIND TARGET
      ========================= */

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

      /* =========================
         💾 SAVE VOTE
      ========================= */

      if (
        round.isTieBreak
      ) {
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
      } else {
        await ctx.db.insert(
          "gameRoundVotes",
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

      return {
        success: true,

        skipped: false,

        isTieBreak:
          round.isTieBreak,

        targetPlayerId:
          target._id,
      };
    },
  });

/* =========================
   📊 MY VOTE
========================= */

export const getMyRoundVote =
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
   🏁 FINALIZE VOTING
========================= */

export const finalizeRoundVoting =
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
        "voting"
      ) {
        throw new Error(
          "Voting is not active"
        );
      }

      if (
        round.votingEndsAt ===
        undefined
      ) {
        throw new Error(
          "Voting has not started"
        );
      }

      const now =
        Date.now();

      if (
        now <
        round.votingEndsAt
      ) {
        throw new Error(
          "Voting is still active"
        );
      }

      /* =========================
         👤 VERIFY PLAYER
      ========================= */

      const caller =
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

      if (!caller) {
        throw new Error(
          "You are not a player in this room"
        );
      }

      /* =========================
         🗳️ GET VOTES
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
         📊 COUNT VOTES
      ========================= */

      const voteCounts =
        new Map<
          string,
          number
        >();

      for (
        const vote of
        votes
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
            voteCounts.get(
              key
            ) ?? 0
          ) + 1
        );
      }

      /* =========================
         ⏭️ NO TARGET
      ========================= */

      if (
        voteCounts.size === 0
      ) {
        await ctx.db.patch(
          round._id,
          {
            phase:
              "result",

            eliminatedPlayerId:
              undefined,

            votingEndsAt:
              undefined,

            updatedAt:
              now,
          }
        );

        return {
          success: true,

          result:
            "no_elimination",

          isTieBreak:
            round.isTieBreak,
        };
      }

      /* =========================
         🏆 HIGHEST COUNT
      ========================= */

      let highest =
        0;

      for (
        const count of
        voteCounts.values()
      ) {
        if (
          count >
          highest
        ) {
          highest =
            count;
        }
      }

    /* =========================
   🏆 GET LEADERS
========================= */

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
        playerId as Id<"gameRoomPlayers">
    );

/* =========================
   ⚖️ TIE
========================= */

if (
  leaders.length > 1
) {
  /*
   * Normal voting tie:
   * enter tie-break.
   *
   * Tie-break tie:
   * nobody is eliminated.
   */

  if (
    !round.isTieBreak
  ) {
    await ctx.db.patch(
      round._id,
      {
        phase:
          "tieBreak",

        isTieBreak:
          true,

        tieBreakOrder:
          leaders,

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
      success: true,

      result:
        "tie_break",

      tiedPlayerIds:
        leaders,
    };
  }

  /* =========================
     ⚖️ TIE-BREAK STILL TIED
  ========================= */

  await ctx.db.patch(
    round._id,
    {
      phase:
        "result",

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
    success: true,

    result:
      "tie_break_no_elimination",

    isTieBreak:
      true,
  };
}

/* =========================
   🎯 CLEAR WINNER
========================= */

const eliminatedId =
  leaders[0];

if (!eliminatedId) {
  throw new Error(
    "No elimination target found"
  );
}

/* =========================
   👤 GET PLAYER
========================= */

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
  eliminatedPlayer.roomId !==
  round.roomId
) {
  throw new Error(
    "Eliminated player is not in this room"
  );
}

if (
  !eliminatedPlayer.isAlive
) {
  throw new Error(
    "Player has already been eliminated"
  );
}

/* =========================
   ❌ ELIMINATE
========================= */

await ctx.db.patch(
  eliminatedPlayer._id,
  {
    isAlive:
      false,

    eliminatedAt:
      now,
  }
);

/* =========================
   🏁 ROUND RESULT
========================= */

await ctx.db.patch(
  round._id,
  {
    phase:
      "result",

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
    "eliminated",

  isTieBreak:
    round.isTieBreak,

  eliminatedPlayerId:
    eliminatedPlayer._id,
};
    }});

/* =========================
   🔀 SHUFFLE
========================= */

const shuffleIds = (
  ids: Id<"gameRoomPlayers">[]
): Id<"gameRoomPlayers">[] => {
  const result =
    [...ids];

  for (
    let i =
      result.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
};