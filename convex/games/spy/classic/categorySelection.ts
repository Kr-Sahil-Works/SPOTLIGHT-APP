import {
  mutation,
  query
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

import {
  CLASSIC_CATEGORIES,
} from "./categories";

import {
  startClassicGameInternal,
} from "./game";

const MIN_PLAYERS = 4;

/* =========================
   🔎 VALID CATEGORY
========================= */

const isValidCategory = (
  categoryId: string
): boolean => {
  return CLASSIC_CATEGORIES.some(
    (category) =>
      category.id === categoryId
  );
};

/* =========================
   🗳️ CAST CATEGORY VOTE
========================= */

export const castCategoryVote =
  mutation({
    args: {
      roomId: v.id("gameRooms"),

      categoryId: v.string(),
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
         🎮 CLASSIC ONLY
      ========================= */

      if (
        room.gameMode !== "spy"
      ) {
        throw new Error(
          "Category selection is only available in Classic Spy"
        );
      }

      /* =========================
         🎮 STATE
      ========================= */
/* =========================
   ✅ ALREADY FINALIZED
========================= */

/*
 * Another player/device may have already
 * finalized the category.
 *
 * Return the existing result instead of
 * throwing an error.
 */
if (
  room.selectedCategory !==
  undefined
) {
  return {
    success: true,

    selectedCategory:
      room.selectedCategory,

    alreadyFinalized:
      true,
  };
}

/* =========================
   🎮 CATEGORY SELECTION STATE
========================= */

if (
  room.status !==
  "starting"
) {
  throw new Error(
    "Category selection is not active"
  );
}

      /* =========================
         ⏱️ DEADLINE
      ========================= */

  if (
  room.categorySelectionEndsAt ===
  undefined
) {
  throw new Error(
    "Category selection has not started"
  );
}

const now =
  Date.now();

if (
  now >=
  room.categorySelectionEndsAt
) {
  throw new Error(
    "Category selection has ended"
  );
}


      /* =========================
         👤 VERIFY PLAYER
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

      /* =========================
         🔒 PLAYER LIST
      ========================= */

      if (
        !room.playerListLocked
      ) {
        throw new Error(
          "Player list is not locked"
        );
      }

      /* =========================
         🗂️ CATEGORY VALIDATION
      ========================= */

      const categoryIsAvailable =
        room.categoryOptions?.includes(
          args.categoryId
        );

      if (
        !categoryIsAvailable ||
        !isValidCategory(
          args.categoryId
        )
      ) {
        throw new Error(
          "Invalid category selection"
        );
      }

      /* =========================
         🗳️ CHECK EXISTING VOTE
      ========================= */

      const existingVote =
        await ctx.db
          .query(
            "gameClassicCategoryVotes"
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

      /*
       * A player may select only
       * one category.
       *
       * No changing votes.
       */

    if (existingVote) {
  return {
    success: true,

    alreadyVoted: true,

    categorySelected: true,

    selectedCategory:
      existingVote.categoryId,

    voteCount: undefined,

    playerCount: undefined,
  };
}
      /* =========================
         💾 SAVE VOTE
      ========================= */

      await ctx.db.insert(
        "gameClassicCategoryVotes",
        {
          roomId:
            room._id,

          userId:
            user._id,

          categoryId:
            args.categoryId,

          createdAt:
            now,

          updatedAt:
            now,
        }
      );

      /* =========================
         👥 CHECK ALL PLAYERS
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

      if (
        players.length <
        MIN_PLAYERS
      ) {
        throw new Error(
          "At least 4 players are required"
        );
      }

      const votes =
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

      /*
       * Everyone voted.
       *
       * We don't start the actual
       * game here yet.
       *
       * We only finalize the category.
       */

if (
  votes.length ===
  players.length
) {
  const selectedCategory =
    selectWinningCategory(
      room.categoryOptions ?? [],
      votes
    );

  await ctx.db.patch(
    room._id,
    {
      selectedCategory,

      categorySelectionEndsAt:
        now,

      updatedAt:
        now,
    }
  );

  return await startClassicGameInternal(
    ctx,
    room._id
  );
}

      return {
        success: true,

        categorySelected: false,

        selectedCategory:
          undefined,

        voteCount:
          votes.length,

        playerCount:
          players.length,
      };
    },
  });


/* =========================
   👥 GET CATEGORY VOTERS
========================= */

export const getCategoryVotes =
  query({
    args: {
      roomId: v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const votes =
        await ctx.db
          .query(
            "gameClassicCategoryVotes"
          )
          .withIndex(
            "by_room",
            (q) =>
              q.eq(
                "roomId",
                args.roomId
              )
          )
          .collect();

      const result = [];

      for (const vote of votes) {
        const user =
          await ctx.db.get(
            vote.userId
          );

        result.push({
          userId: vote.userId,

          categoryId:
            vote.categoryId,

          // Your users table uses `image`
          avatar:
            user?.image ?? "",
        });
      }

      return result;
    },
  });

/* =========================
   🏆 SELECT WINNING CATEGORY
========================= */

const selectWinningCategory = (
  categoryOptions: string[],
  votes: {
    categoryId: string;
  }[]
): string => {
  if (
    categoryOptions.length === 0
  ) {
    throw new Error(
      "No category options available"
    );
  }

  /* =========================
     📊 COUNT VOTES
  ========================= */

  const voteCounts =
    new Map<string, number>();

  for (
    const categoryId of
    categoryOptions
  ) {
    voteCounts.set(
      categoryId,
      0
    );
  }

  for (
    const vote of votes
  ) {
    const current =
      voteCounts.get(
        vote.categoryId
      ) ?? 0;

    voteCounts.set(
      vote.categoryId,
      current + 1
    );
  }

  /* =========================
     🏆 FIND MAX
  ========================= */

  let maxVotes = 0;

  for (
    const count of
    voteCounts.values()
  ) {
    if (
      count > maxVotes
    ) {
      maxVotes = count;
    }
  }

  /* =========================
     🎲 TIED CATEGORIES
  ========================= */

  const tiedCategories =
    categoryOptions.filter(
      (categoryId) =>
        (
          voteCounts.get(
            categoryId
          ) ?? 0
        ) === maxVotes
    );

  /* =========================
     🎲 RANDOM TIE BREAK
  ========================= */

  const randomIndex =
    Math.floor(
      Math.random() *
        tiedCategories.length
    );

  return tiedCategories[
    randomIndex
  ];
};

export const finalizeCategorySelection =
  mutation({
    args: {
      roomId: v.id("gameRooms"),
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
/*
 * Another player/device may already have
 * finalized the category and started the game.
 *
 * Treat that as success instead of throwing.
 */

if (
  room.selectedCategory !==
  undefined
) {
  return {
    success: true,

    selectedCategory:
      room.selectedCategory,

    alreadyFinalized:
      true,
  };
}

if (
  room.status !==
  "starting"
) {
  return {
    success: true,

    alreadyFinalized:
      true,
  };
}
      if (
        room.categorySelectionEndsAt ===
        undefined
      ) {
        throw new Error(
          "Category selection has not started"
        );
      }

      const now =
        Date.now();

   /*
 * The client only calls this after its
 * countdown reaches zero.
 *
 * Convex may receive the request slightly
 * before the exact server deadline, so
 * allow the finalization request instead
 * of throwing a timing error.
 */
      const votes =
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

      const categoryOptions =
        room.categoryOptions ?? [];

      if (
        categoryOptions.length ===
        0
      ) {
        throw new Error(
          "No category options available"
        );
      }

      let selectedCategory: string;

      /*
       * Nobody voted.
       *
       * Completely random.
       */

      if (
        votes.length === 0
      ) {
        const randomIndex =
          Math.floor(
            Math.random() *
              categoryOptions.length
          );

        selectedCategory =
          categoryOptions[
            randomIndex
          ];
      } else {
        /*
         * Some or all players voted.
         *
         * Highest vote wins.
         * Tied highest categories are
         * randomly selected.
         */

        selectedCategory =
          selectWinningCategory(
            categoryOptions,
            votes
          );
      }

    await ctx.db.patch(
  room._id,
  {
    selectedCategory,

    categorySelectionEndsAt:
      now,

    updatedAt:
      now,
  }
);

/*
 * Timer expired.
 *
 * Automatically start the Classic game.
 * No host START ROUND action is required.
 */

return await startClassicGameInternal(
  ctx,
  room._id
);
    },
  });