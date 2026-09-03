export type ClassicPhase =
  | "category"
  | "speaking"
  | "voting"
  | "tieBreak"
  | "result"
  | "finished";

export type CategoryOption = {
  id: string;
  label: string;
};

export type ClassicGameState = {
  phase: ClassicPhase;

  roomId: string;

  categoryOptions: CategoryOption[];

  selectedCategory?: string;

  categorySelectionEndsAt?: number;

  isHost: boolean;

  currentUserId: string;

  hasVotedCategory: boolean;

  categoryVotes: Record<string, number>;
};