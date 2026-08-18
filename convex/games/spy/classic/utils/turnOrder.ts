export const getNextSpeakingOrder = (
  currentOrder: number,
  playerCount: number
): number => {
  if (playerCount <= 0) {
    throw new Error(
      "Player count must be greater than 0"
    );
  }

  return (
    (currentOrder + 1) %
    playerCount
  );
};