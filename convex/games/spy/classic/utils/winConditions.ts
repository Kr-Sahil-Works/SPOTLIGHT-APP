export type WinCheckPlayer = {
  role: "villager" | "spy";

  isAlive: boolean;
};

export type ClassicWinResult = {
  finished: boolean;

  winner?: "villagers" | "spy";
};

export const checkClassicWinCondition = (
  players: WinCheckPlayer[]
): ClassicWinResult => {
  const alivePlayers =
    players.filter(
      (player) =>
        player.isAlive
    );

  const aliveSpy =
    alivePlayers.filter(
      (player) =>
        player.role === "spy"
    );

  const aliveVillagers =
    alivePlayers.filter(
      (player) =>
        player.role === "villager"
    );

  /*
   * Spy has been eliminated.
   */

  if (aliveSpy.length === 0) {
    return {
      finished: true,
      winner: "villagers",
    };
  }

  /*
   * Spy has reached the final
   * villager.
   */

  if (
    aliveSpy.length >= 1 &&
    aliveVillagers.length <= 1
  ) {
    return {
      finished: true,
      winner: "spy",
    };
  }

  return {
    finished: false,
  };
};