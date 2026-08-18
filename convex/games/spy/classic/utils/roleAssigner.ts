import { Id } from "../../../../_generated/dataModel";


export type AssignedClassicRole = {
  userId: Id<"users">;

  role: "villager" | "spy";

  word: string;

  speakingOrder: number;
};

type RoleAssignmentPlayer = {
  userId: Id<"users">;
};

export const assignClassicRoles = (
  players: RoleAssignmentPlayer[],
  villagerWord: string,
  spyWord: string
): AssignedClassicRole[] => {
  if (players.length < 4) {
    throw new Error(
      "At least 4 players are required"
    );
  }

  /* =========================
     🎭 SELECT EXACTLY ONE SPY
  ========================= */

  const spyIndex =
    Math.floor(
      Math.random() * players.length
    );

  const spyUserId =
    players[spyIndex].userId;

  /* =========================
     🔀 RANDOMIZE SPEAKING ORDER
  ========================= */

  const shuffledPlayers = [
    ...players,
  ];

  for (
    let i = shuffledPlayers.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      shuffledPlayers[i],
      shuffledPlayers[j],
    ] = [
      shuffledPlayers[j],
      shuffledPlayers[i],
    ];
  }

  /* =========================
     🎮 ASSIGN ROLES
  ========================= */

  return shuffledPlayers.map(
    (player, index) => {
      const isSpy =
        player.userId ===
        spyUserId;

      return {
        userId:
          player.userId,

        role:
          isSpy
            ? "spy"
            : "villager",

        word:
          isSpy
            ? spyWord
            : villagerWord,

        speakingOrder:
          index,
      };
    }
  );
};