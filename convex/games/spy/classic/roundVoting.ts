import {
  mutation,
  query,
  type QueryCtx
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
  round.phase !== "voting" &&
  round.phase !== "tieBreak"
) {
  throw new Error(
    "Voting is not active"
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
        round.phase !== "voting" &&
        round.phase !== "tieBreak"
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
         ⏭️ SAVE SKIP
      ========================= */

      if (
        args.skipped
      ) {
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
      } else {
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

        if (
          !target.isAlive
        ) {
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
      }

      /* =========================
         🗳️ CHECK IF EVERYONE VOTED
      ========================= */

      const alivePlayers =
        await ctx.db
          .query(
            "gameRoomPlayers"
          )
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
            player.isAlive
        );

      /* =========================
         📊 GET CURRENT VOTES
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

      /* =========================
         ✅ RETURN COMPLETION STATE
      ========================= */

      return {
        success: true,

        skipped:
          args.skipped,

        isTieBreak:
          round.isTieBreak,

        targetPlayerId:
          args.targetPlayerId,

        allPlayersVoted,

        shouldFinalize:
          allPlayersVoted,
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
  round.isTieBreak
    ? await ctx.db
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
        .unique()
    : await ctx.db
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
  round.phase !== "voting" &&
  round.phase !== "tieBreak"
) {
  return {
    success: false,
    alreadyFinalized: true,
    reason: "VOTING_NOT_ACTIVE",
  };
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

/* =========================
   🗳️ CHECK VOTING COMPLETION
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
      player.isAlive
  );

/* =========================
   🗳️ GET VOTES
========================= */

const votes =
  round.isTieBreak
    ? await ctx.db
        .query("gameTieBreakVotes")
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
        .query("gameRoundVotes")
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
  eligibleVoters.every((player) =>
    votes.some(
      (vote) =>
        vote.voterId === player._id
    )
  );

const timerExpired =
  now >= round.votingEndsAt;

/*
 * Voting completes when:
 * 1. Every alive player voted/skipped
 * OR
 * 2. Timer expired
 */

if (
  !allPlayersVoted &&
  !timerExpired
) {
  throw new Error(
    "Voting is still active"
  );
}

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

      const votersByTarget =
  new Map<
    string,
    Id<"gameRoomPlayers">[]
  >();

for (const vote of votes) {
  if (
    vote.skipped ||
    !vote.targetId
  ) {
    continue;
  }

  const key =
    vote.targetId.toString();

  const existing =
    votersByTarget.get(key) ?? [];

  existing.push(
    vote.voterId
  );

  votersByTarget.set(
    key,
    existing
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

   const highest =
  Math.max(
    ...voteCounts.values()
  );

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

if (leaders.length > 1) {
  /* =========================
     👥 CHECK ALL-PLAYER TIE
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

  const alivePlayerIds =
    alivePlayers
      .filter(
        (player) =>
          player.isAlive
      )
      .map(
        (player) =>
          player._id.toString()
      );

  const allAlivePlayersTied =
    alivePlayerIds.length ===
      leaders.length &&
    leaders.every(
      (playerId) =>
        alivePlayerIds.includes(
          playerId.toString()
        )
    );

  /* =========================
     ⏭️ ALL PLAYERS TIED
     
     No tie-break.
     Nobody is eliminated.
  ========================= */

  if (
    allAlivePlayersTied
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

        turnEndsAt:
          undefined,

        updatedAt:
          now,
      }
    );

    return {
      success: true,

      result:
        "all_players_tied",

      isTieBreak:
        round.isTieBreak,

      eliminatedPlayerId:
        undefined,

      tiedPlayerIds:
        leaders,
    };
  }

  /* =========================
     🔁 NORMAL TIE → TIE-BREAK
  ========================= */

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
  now +
  VOTING_SECONDS * 1000,

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

    eliminatedPlayerId:
      undefined,

    tiedPlayerIds:
      leaders,
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
   📊 VOTING RESULT
========================= */

export const getRoundVotingResult =
  query({
    args: {
      roundId:
        v.id("gameRounds"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const round =
        await ctx.db.get(
          args.roundId
        );

      if (!round) {
        return null;
      }

      if (
        round.phase !==
        "result"
      ) {
        return null;
      }

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

      const voteCounts =
        new Map<
          string,
          number
        >();

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
            voteCounts.get(
              key
            ) ?? 0
          ) + 1
        );
      }

        const votersByTarget =
  new Map<
    string,
    Id<"gameRoomPlayers">[]
  >();

for (const vote of votes) {
  if (
    vote.skipped ||
    !vote.targetId
  ) {
    continue;
  }

  const key =
    vote.targetId.toString();

  const existing =
    votersByTarget.get(key) ?? [];

  existing.push(
    vote.voterId
  );

  votersByTarget.set(
    key,
    existing
  );
}

const eliminatedPlayer =
  round.eliminatedPlayerId
    ? await ctx.db.get(
        round.eliminatedPlayerId
      )
    : null;

if (!eliminatedPlayer) {
 return {
  roundId: round._id,
  eliminatedPlayer: null,
  voteCount: 0,
  role: undefined,
};
}

/* =========================
   👤 GET USER PROFILE
========================= */

const eliminatedUser =
  await ctx.db.get(
    eliminatedPlayer.userId
  );

if (
  !eliminatedUser ||
  eliminatedUser.isDeleted
) {
  return {
    roundId: round._id,
    eliminatedPlayer: null,
    voteCount: 0,
    role: undefined,
  };
}

/* =========================
   🕵️ ROLE
========================= */

const eliminatedSecret =
  await ctx.db
    .query("gamePlayerSecrets")
    .withIndex(
      "by_room",
      (q) =>
        q.eq(
          "roomId",
          round.roomId
        )
    )
    .filter(
      (q) =>
        q.eq(
          q.field("playerId"),
          eliminatedPlayer._id
        )
    )
    .first();

const role =
  eliminatedSecret?.role;

return {
  roundId:
    round._id,

  eliminatedPlayer: {
    id:
      eliminatedPlayer._id,

    userId:
      eliminatedPlayer.userId,

    name:
      eliminatedUser.username,

    avatar:
      eliminatedUser.image,
  },

voteCount:
  voteCounts.get(
    eliminatedPlayer._id.toString()
  ) ?? 0,

voterIds:
  votersByTarget.get(
    eliminatedPlayer._id.toString()
  ) ?? [],

role,
};}
  });