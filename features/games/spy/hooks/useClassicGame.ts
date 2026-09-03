import {
    useCallback,
    useMemo,
    useState,
} from "react";

import type {
    ClassicGameState,
} from "../types/classicGame";

type UseClassicGameArgs = {
  roomId: string;

  currentUserId: string;

  isHost: boolean;

  categoryOptions: string[];

  selectedCategory?: string;

  categorySelectionEndsAt?: number;

  hasVotedCategory?: boolean;

  categoryVotes?: Record<
    string,
    number
  >;

  onCategoryVote?: (
    category: string
  ) => Promise<void> | void;

  onFinalizeCategory?: () =>
    Promise<void> | void;
};

export function useClassicGame({
  roomId,
  currentUserId,
  isHost,
  categoryOptions,
  selectedCategory,
  categorySelectionEndsAt,
  hasVotedCategory =
    false,
  categoryVotes = {},
  onCategoryVote,
  onFinalizeCategory,
}: UseClassicGameArgs) {
  const [
    voting,
    setVoting,
  ] = useState(false);

  const [
    finalizing,
    setFinalizing,
  ] = useState(false);

  const voteCategory =
    useCallback(
      async (
        category: string
      ) => {
        if (
          voting ||
          hasVotedCategory
        ) {
          return;
        }

        setVoting(true);

        try {
          await onCategoryVote?.(
            category
          );
        } finally {
          setVoting(false);
        }
      },
      [
        voting,
        hasVotedCategory,
        onCategoryVote,
      ]
    );

  const finalizeCategory =
    useCallback(
      async () => {
        if (
          finalizing ||
          !isHost
        ) {
          return;
        }

        setFinalizing(true);

        try {
          await onFinalizeCategory?.();
        } finally {
          setFinalizing(false);
        }
      },
      [
        finalizing,
        isHost,
        onFinalizeCategory,
      ]
    );

  const state =
    useMemo<ClassicGameState>(
      () => ({
        phase:
          selectedCategory
            ? "speaking"
            : "category",

        roomId,

        categoryOptions:
          categoryOptions.map(
            (label) => ({
              id: label,
              label,
            })
          ),

        selectedCategory,

        categorySelectionEndsAt,

        isHost,

        currentUserId,

        hasVotedCategory,

        categoryVotes,
      }),
      [
        roomId,
        categoryOptions,
        selectedCategory,
        categorySelectionEndsAt,
        isHost,
        currentUserId,
        hasVotedCategory,
        categoryVotes,
      ]
    );

  return {
    state,

    voting,

    finalizing,

    voteCategory,

    finalizeCategory,
  };
}