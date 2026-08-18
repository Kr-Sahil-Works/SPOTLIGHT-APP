export const GAME_STATES = {
  LOBBY: "lobby",
  STARTING: "starting",
  ROLE_REVEAL: "role_reveal",
  DISCUSSION: "discussion",
  VOTING: "voting",
  VOTE_RESULT: "vote_result",
  SPY_GUESS: "spy_guess",
  ROUND_RESULT: "round_result",
  GAME_FINISHED: "game_finished",
} as const;

export type GameState =
  (typeof GAME_STATES)[keyof typeof GAME_STATES];