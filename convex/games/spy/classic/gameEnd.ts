import {
    mutation,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
    getAuthenticatedUser,
} from "../../../users/users.core";

/* =========================
   🏁 FINISH CLASSIC GAME
========================= */

export const finishClassicGame =
  mutation({
    args: {
      matchId:
        v.id("gameMatches"),

      winner:
        v.union(
          v.literal("spy"),
          v.literal("villagers")
        ),
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
         🎮 MATCH
      ========================= */

      const match =
        await ctx.db.get(
          args.matchId
        );

      if (!match) {
        throw new Error(
          "Match not found"
        );
      }

      if (
        match.status ===
        "finished"
      ) {
        return {
          success: true,
          alreadyFinished: true,
          winner:
            match.winner,
        };
      }

      /* =========================
         🏠 ROOM
      ========================= */

      const room =
        await ctx.db.get(
          match.roomId
        );

      if (!room) {
        throw new Error(
          "Room not found"
        );
      }

      /* =========================
         👑 HOST ONLY
      ========================= */

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can finish the game"
        );
      }

      /* =========================
         ⏱️ FINISH
      ========================= */

      const now =
        Date.now();

      await ctx.db.patch(
        match._id,
        {
          status:
            "finished",

          winner:
            args.winner,

          finishedAt:
            now,

          updatedAt:
            now,
        }
      );

      /* =========================
         🏠 FINISH ROOM
      ========================= */

      await ctx.db.patch(
        room._id,
        {
          status:
            "finished",

          updatedAt:
            now,
        }
      );

      return {
        success: true,

        alreadyFinished:
          false,

        winner:
          args.winner,

        finishedAt:
          now,
      };
    },
  });