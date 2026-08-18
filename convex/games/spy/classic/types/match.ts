export type ClassicMatchPhase =
  | "category"
  | "speaking"
  | "voting"
  | "tieBreak"
  | "finished";

export type ClassicWinner =
  | "villagers"
  | "spy"
  | undefined;

export type ClassicMatchStatus =
  | "active"
  | "finished";

export type ClassicMatch = {
  roomId: string;

  category: string;

  wordPairId: string;

  wordsSwapped: boolean;

  roundNumber: number;

  maxRounds: number;

  phase: ClassicMatchPhase;

  currentSpeakerUserId?: string;

  turnStartedAt?: number;

  turnEndsAt?: number;

  winner?: ClassicWinner;

  status: ClassicMatchStatus;

  createdAt: number;

  updatedAt: number;
};