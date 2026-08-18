import {
    CLASSIC_WORD_PAIRS_BY_CATEGORY,
} from "../words";

import {
    ClassicWordPair,
} from "../types/wordPair";

export type SelectedClassicPair = {
  pair: ClassicWordPair;

  wordsSwapped: boolean;

  villagerWord: string;

  spyWord: string;
};

export const selectClassicWordPair = (
  category: string
): SelectedClassicPair => {
  const pairs =
    CLASSIC_WORD_PAIRS_BY_CATEGORY[
      category
    ];

  if (!pairs || pairs.length === 0) {
    throw new Error(
      `No word pairs available for category: ${category}`
    );
  }

  const randomIndex =
    Math.floor(
      Math.random() * pairs.length
    );

  const pair =
    pairs[randomIndex];

  /*
   * 50% chance to swap
   *
   * Normal:
   * Villager → pair.villager
   * Spy      → pair.spy
   *
   * Swapped:
   * Villager → pair.spy
   * Spy      → pair.villager
   */

  const wordsSwapped =
    Math.random() < 0.5;

  return {
    pair,

    wordsSwapped,

    villagerWord:
      wordsSwapped
        ? pair.spy
        : pair.villager,

    spyWord:
      wordsSwapped
        ? pair.villager
        : pair.spy,
  };
};