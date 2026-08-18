export type ClassicPlayerRole =
  | "villager"
  | "spy";

export type ClassicPlayer = {
  matchId: string;

  userId: string;

  role: ClassicPlayerRole;

  word: string;

  isAlive: boolean;

  speakingOrder: number;

  eliminatedAt?: number;

  joinedAt: number;
};