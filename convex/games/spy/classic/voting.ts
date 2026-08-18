import {
  MutationCtx,
} from "../../../_generated/server";

import {
  Id,
} from "../../../_generated/dataModel";

import {
  mutation,
} from "../../../_generated/server";

import {
  v,
} from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

import {
  getRandomClassicCategories,
} from "./categories";

/* =========================
   🎮 CLASSIC CONSTANTS
========================= */

const CATEGORY_SELECTION_SECONDS = 10;

const MIN_PLAYERS = 4;

/* =========================
   🎲 START CATEGORY SELECTION
   INTERNAL HELPER
========================= */

export const startCategorySelectionInternal =
  async (
    ctx: MutationCtx,
    roomId: Id<"gameRooms">
  ) => {
    const room =
      await ctx.db.get(roomId);

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    if (
      room.gameMode !== "spy"
    ) {
      throw new Error(
        "Category selection is only available for Classic Spy mode"
      );
    }

    if (
      room.status !== "starting"
    ) {
      throw new Error(
        "Room is not starting"
      );
    }

    if (
      room.selectedCategory !==
      undefined
    ) {
      throw new Error(
        "Category already selected"
      );
    }

    if (
      room.categorySelectionEndsAt !==
      undefined
    ) {
      throw new Error(
        "Category selection has already started"
      );
    }

    const players =
      await ctx.db
        .query("gameRoomPlayers")
        .withIndex(
          "by_room",
          (q) =>
            q.eq(
              "roomId",
              roomId
            )
        )
        .collect();

    if (
      players.length <
      MIN_PLAYERS
    ) {
      throw new Error(
        `At least ${MIN_PLAYERS} players are required`
      );
    }

    if (
      room.playerListLocked
    ) {
      throw new Error(
        "Player list is already locked"
      );
    }

    /* =========================
       🎲 RANDOM 8 OF 12
    ========================= */

    const selectedCategories =
      getRandomClassicCategories();

    const categoryOptions =
      selectedCategories.map(
        (category) =>
          category.id
      );

    /* =========================
       ⏱️ SERVER TIMER
    ========================= */

    const now =
      Date.now();

    const categorySelectionEndsAt =
      now +
      CATEGORY_SELECTION_SECONDS *
        1000;

    /* =========================
       🔒 LOCK MATCH
    ========================= */

    await ctx.db.patch(
      roomId,
      {
        status: "starting",

        playerListLocked: true,

        categoryOptions,

        selectedCategory:
          undefined,

        categorySelectionEndsAt,

        updatedAt: now,
      }
    );

    return {
      categoryOptions,

      categorySelectionEndsAt,
    };
  };

/* =========================
   🚀 START CATEGORY SELECTION
========================= */

export const startCategorySelection =
  mutation({
    args: {
      roomId: v.id("gameRooms"),
    },

    handler: async (
      ctx,
      args
    ) => {
      const user =
        await getAuthenticatedUser(ctx);

      const room =
        await ctx.db.get(
          args.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can start category selection"
        );
      }

      return await startCategorySelectionInternal(
        ctx,
        args.roomId
      );
    },
  });

/* =========================
   🏁 FINALIZE CATEGORY
   INTERNAL
========================= */

export const finalizeCategorySelection =
  async (
    ctx: MutationCtx,
    roomId: Id<"gameRooms">
  ) => {
    const room =
      await ctx.db.get(roomId);

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    /* =========================
       ✅ ALREADY FINALIZED
    ========================= */

    if (
      room.selectedCategory !==
      undefined
    ) {
      return room.selectedCategory;
    }

    if (
      room.status !==
        "starting" ||
      !room.categoryOptions ||
      room.categoryOptions.length ===
        0
    ) {
      throw new Error(
        "Category selection is not active"
      );
    }

    /* =========================
       🗳️ GET VOTES
    ========================= */

    const votes =
      await ctx.db
        .query(
          "gameCategoryVotes"
        )
        .withIndex(
          "by_room",
          (q) =>
            q.eq(
              "roomId",
              roomId
            )
        )
        .collect();

    let selectedCategory:
      string;

    /* =========================
       🎲 NO VOTES
    ========================= */

    if (
      votes.length === 0
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
            room
              .categoryOptions
              .length
        );

      selectedCategory =
        room.categoryOptions[
          randomIndex
        ];
    } else {
      /* =========================
         📊 COUNT VOTES
      ========================= */

      const voteCounts =
        new Map<
          string,
          number
        >();

      for (
        const category of
        room.categoryOptions
      ) {
        voteCounts.set(
          category,
          0
        );
      }

      for (
        const vote of votes
      ) {
        const current =
          voteCounts.get(
            vote.category
          ) ?? 0;

        voteCounts.set(
          vote.category,
          current + 1
        );
      }

      const highestVoteCount =
        Math.max(
          ...Array.from(
            voteCounts.values()
          )
        );

      const tiedCategories =
        Array.from(
          voteCounts.entries()
        )
          .filter(
            ([, count]) =>
              count ===
              highestVoteCount
          )
          .map(
            ([category]) =>
              category
          );

      /* =========================
         🏆 WINNER / TIE
      ========================= */

      if (
        tiedCategories.length ===
        1
      ) {
        selectedCategory =
          tiedCategories[0];
      } else {
        const randomIndex =
          Math.floor(
            Math.random() *
              tiedCategories.length
          );

        selectedCategory =
          tiedCategories[
            randomIndex
          ];
      }
    }

    /* =========================
       🔒 SAVE RESULT
    ========================= */

    const now =
      Date.now();

    await ctx.db.patch(
      roomId,
      {
        selectedCategory,

        categorySelectionEndsAt:
          undefined,

        updatedAt: now,
      }
    );

    return selectedCategory;
  };

/* =========================
   🗳️ SELECT CATEGORY
========================= */

export const selectCategory =
  mutation({
    args: {
      roomId:
        v.id("gameRooms"),

      category:
        v.string(),
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

      if (
        room.gameMode !==
        "spy"
      ) {
        throw new Error(
          "Category selection is only available for Classic Spy mode"
        );
      }

      if (
        room.status !==
        "starting"
      ) {
        throw new Error(
          "Category selection is not active"
        );
      }

      if (
        room.selectedCategory !==
        undefined
      ) {
        throw new Error(
          "Category has already been selected"
        );
      }

      if (
        room.categorySelectionEndsAt ===
        undefined
      ) {
        throw new Error(
          "Category selection has not started"
        );
      }

      /* =========================
         ⏱️ SERVER DEADLINE
      ========================= */

      const now =
        Date.now();

      if (
        now >=
        room.categorySelectionEndsAt
      ) {
        throw new Error(
          "Category selection time has expired"
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
          .first();

      if (!player) {
        throw new Error(
          "You are not a player in this room"
        );
      }

      /* =========================
         🗳️ ONE VOTE
      ========================= */

      const existingVote =
        await ctx.db
          .query(
            "gameCategoryVotes"
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
          .first();

      if (existingVote) {
        throw new Error(
          "You have already selected a category"
        );
      }

      /* =========================
         ✅ VALID CATEGORY
      ========================= */

      const categoryIsAvailable =
        room.categoryOptions?.includes(
          args.category
        ) ?? false;

      if (
        !categoryIsAvailable
      ) {
        throw new Error(
          "Invalid category"
        );
      }

      /* =========================
         💾 SAVE VOTE
      ========================= */

      await ctx.db.insert(
        "gameCategoryVotes",
        {
          roomId:
            room._id,

          userId:
            user._id,

          category:
            args.category,

          createdAt:
            now,
        }
      );

      /* =========================
         👥 CHECK EVERYONE
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

      const activePlayers =
        players.filter(
          (p) =>
            p.isAlive &&
            !p.eliminatedAt
        );

      const votes =
        await ctx.db
          .query(
            "gameCategoryVotes"
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

      const allPlayersVoted =
        votes.length >=
        activePlayers.length;

      /* =========================
         ⚡ FINISH EARLY
      ========================= */

      if (
        allPlayersVoted
      ) {
        const selectedCategory =
          await finalizeCategorySelection(
            ctx,
            room._id
          );

        return {
          success: true,

          category:
            args.category,

          voteCount:
            votes.length,

          playerCount:
            activePlayers.length,

          allPlayersVoted: true,

          finalized: true,

          selectedCategory,
        };
      }

      return {
        success: true,

        category:
          args.category,

        voteCount:
          votes.length,

        playerCount:
          activePlayers.length,

        allPlayersVoted: false,

        finalized: false,
      };
    },
  });

/* =========================
   ⏰ FINALIZE CATEGORY
========================= */

export const finalizeCategory =
  mutation({
    args: {
      roomId:
        v.id("gameRooms"),
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

      if (
        room.gameMode !==
        "spy"
      ) {
        throw new Error(
          "Category selection is not available for this mode"
        );
      }

      if (
        room.status !==
        "starting"
      ) {
        throw new Error(
          "Category selection is not active"
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
          .first();

      if (!player) {
        throw new Error(
          "You are not a player in this room"
        );
      }

      /* =========================
         ✅ ALREADY FINALIZED
      ========================= */

      if (
        room.selectedCategory !==
        undefined
      ) {
        return {
          success: true,

          finalized: true,

          selectedCategory:
            room.selectedCategory,
        };
      }

      if (
        room.categorySelectionEndsAt ===
        undefined
      ) {
        throw new Error(
          "Category selection deadline is missing"
        );
      }

      /* =========================
         ⏱️ SERVER TIMER
      ========================= */

      const now =
        Date.now();

      if (
        now <
        room.categorySelectionEndsAt
      ) {
        throw new Error(
          "Category selection is still active"
        );
      }

      const selectedCategory =
        await finalizeCategorySelection(
          ctx,
          room._id
        );

      return {
        success: true,

        finalized: true,

        selectedCategory,
      };
    },
  });