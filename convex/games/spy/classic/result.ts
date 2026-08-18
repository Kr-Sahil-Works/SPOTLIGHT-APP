import {
  mutation,
} from "../../../_generated/server";

import { v } from "convex/values";

import {
  getAuthenticatedUser,
} from "../../../users/users.core";

/* =========================
   🏁 PROCESS ROUND RESULT
========================= */

export const processRoundResult =
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
   🔒 RESULT PROCESSING
========================= */

if (
  round.phase ===
  "finished"
) {
  return {
    success: true,

    alreadyProcessed:
      true,
  };
}
      if (
        round.phase !==
        "result"
      ) {
        throw new Error(
          "Round is not in result phase"
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
         👑 HOST ONLY
      ========================= */

      if (
        room.hostId !==
        user._id
      ) {
        throw new Error(
          "Only the host can process the round result"
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
          "Active game match not found"
        );
      }

      /* =========================
         👥 ALL PLAYERS
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
         ❤️ ALIVE PLAYERS
      ========================= */

      const alivePlayers =
        players.filter(
          (player) =>
            player.isAlive
        );

      /* =========================
         🎭 GET SECRETS
      ========================= */

      const secrets =
        await ctx.db
          .query(
            "gamePlayerSecrets"
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
         🕵️ FIND SPY
      ========================= */

      const spySecret =
        secrets.find(
          (secret) =>
            secret.role ===
            "spy"
        );

      if (!spySecret) {
        throw new Error(
          "Spy secret not found"
        );
      }

      const spyPlayer =
        players.find(
          (player) =>
            player._id ===
            spySecret.playerId
        );

      if (!spyPlayer) {
        throw new Error(
          "Spy player not found"
        );
      }

      /* =========================
         🏆 ELIMINATED PLAYER
      ========================= */

      let eliminatedRole:
        | "spy"
        | "villager"
        | undefined =
        undefined;

      if (
        round.eliminatedPlayerId
      ) {
        const eliminatedSecret =
          secrets.find(
            (secret) =>
              secret.playerId ===
              round.eliminatedPlayerId
          );

        if (
          !eliminatedSecret
        ) {
          throw new Error(
            "Eliminated player's secret not found"
          );
        }

        eliminatedRole =
          eliminatedSecret.role;
      }

      /* =========================
         🏆 SPY ELIMINATED
      ========================= */

      if (
        eliminatedRole ===
        "spy"
      ) {
        const now =
          Date.now();

        await ctx.db.patch(
          match._id,
          {
            status:
              "finished",

            winner:
              "villagers",

            finishedAt:
              now,

            updatedAt:
              now,
          }
        );

        await ctx.db.patch(
          room._id,
          {
            status:
              "finished",

            updatedAt:
              now,
          }
        );
        await ctx.db.patch(
  round._id,
  {
    phase:
      "finished",

    updatedAt:
      now,
  }
);

        return {
          success: true,

          gameFinished:
            true,

          winner:
            "villagers",

          eliminatedPlayerId:
            round.eliminatedPlayerId,

          eliminatedRole:
            "spy",
        };
      }

      /* =========================
         🕵️ SPY STILL ALIVE
      ========================= */

      const aliveSpy =
        spyPlayer.isAlive;

      if (!aliveSpy) {
        const now =
          Date.now();

        await ctx.db.patch(
          match._id,
          {
            status:
              "finished",

            winner:
              "villagers",

            finishedAt:
              now,

            updatedAt:
              now,
          }
        );

        await ctx.db.patch(
          room._id,
          {
            status:
              "finished",

            updatedAt:
              now,
          }
        );
        await ctx.db.patch(
  round._id,
  {
    phase:
      "finished",

    updatedAt:
      now,
  }
);

        return {
          success: true,

          gameFinished:
            true,

          winner:
            "villagers",
        };
      }

      /* =========================
         👥 COUNT ALIVE ROLES
      ========================= */

      let aliveSpies =
        0;

      let aliveVillagers =
        0;

      for (
        const player of
        alivePlayers
      ) {
        const secret =
          secrets.find(
            (item) =>
              item.playerId ===
              player._id
          );

        if (!secret) {
          continue;
        }

        if (
          secret.role ===
          "spy"
        ) {
          aliveSpies++;
        } else {
          aliveVillagers++;
        }
      }

      /* =========================
         🕵️ SPY PARITY WIN
      ========================= */

      if (
        aliveSpies >=
        aliveVillagers
      ) {
        const now =
          Date.now();

        await ctx.db.patch(
          match._id,
          {
            status:
              "finished",

            winner:
              "spy",

            finishedAt:
              now,

            updatedAt:
              now,
          }
        );

        await ctx.db.patch(
          room._id,
          {
            status:
              "finished",

            updatedAt:
              now,
          }
        );
          await ctx.db.patch(
  round._id,
  {
    phase:
      "finished",

    updatedAt:
      now,
  }
);
        return {
          success: true,

          gameFinished:
            true,

          winner:
            "spy",

          aliveSpies,

          aliveVillagers,
        };
      }

/* =========================
   🔢 MAX ROUND CHECK
========================= */

if (
  round.roundNumber >=
  match.maxRounds
) {
  const now =
    Date.now();

  /*
   * If maximum rounds are reached
   * while the spy is still alive,
   * villagers did not eliminate the
   * spy in time.
   *
   * Spy wins.
   */

  await ctx.db.patch(
    match._id,
    {
      status:
        "finished",

      winner:
        "spy",

      finishedAt:
        now,

      updatedAt:
        now,
    }
  );
await ctx.db.patch(
  round._id,
  {
    phase:
      "finished",

    updatedAt:
      now,
  }
);
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

    gameFinished:
      true,

    winner:
      "spy",

    reason:
      "max_rounds_reached",

    roundNumber:
      round.roundNumber,

    aliveSpies,

    aliveVillagers,
  };
}

/* =========================
   🎮 GAME CONTINUES
========================= */

return {
  success: true,

  gameFinished:
    false,

  winner:
    undefined,

  eliminatedPlayerId:
    round.eliminatedPlayerId,

  eliminatedRole,

  aliveSpies,

  aliveVillagers,

  alivePlayers:
    alivePlayers.length,
};
    },
  });