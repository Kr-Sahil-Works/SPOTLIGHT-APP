import { ClassicWordPair } from "../types/wordPair";

import { ANIMAL_WORD_PAIRS } from "./animals";
import { CITY_WORD_PAIRS } from "./city";
import { ENTERTAINMENT_WORD_PAIRS } from "./entertainment";
import { EVERYDAY_WORD_PAIRS } from "./everyday";
import { FOOD_WORD_PAIRS } from "./food";
import { MOVIE_WORD_PAIRS } from "./movies";
import { NATURE_WORD_PAIRS } from "./nature";
import { OBJECT_WORD_PAIRS } from "./objects";
import { PLACE_WORD_PAIRS } from "./places";
import { PROFESSION_WORD_PAIRS } from "./professions";
import { SPORTS_WORD_PAIRS } from "./sports";
import { TECHNOLOGY_WORD_PAIRS } from "./technology";

/* =========================
   🗂️ ALL CLASSIC WORD PAIRS
========================= */

export const CLASSIC_WORD_PAIRS: ClassicWordPair[] = [
  ...ANIMAL_WORD_PAIRS,
  ...CITY_WORD_PAIRS,
  ...ENTERTAINMENT_WORD_PAIRS,
  ...EVERYDAY_WORD_PAIRS,
  ...FOOD_WORD_PAIRS,
  ...MOVIE_WORD_PAIRS,
  ...NATURE_WORD_PAIRS,
  ...OBJECT_WORD_PAIRS,
  ...PLACE_WORD_PAIRS,
  ...PROFESSION_WORD_PAIRS,
  ...SPORTS_WORD_PAIRS,
  ...TECHNOLOGY_WORD_PAIRS,
];

/* =========================
   🗂️ PAIRS BY CATEGORY
========================= */

export const CLASSIC_WORD_PAIRS_BY_CATEGORY: Record<
  string,
  ClassicWordPair[]
> = {
  Animals: ANIMAL_WORD_PAIRS,
  Cities: CITY_WORD_PAIRS,
  Entertainment: ENTERTAINMENT_WORD_PAIRS,
  Everyday: EVERYDAY_WORD_PAIRS,
  Food: FOOD_WORD_PAIRS,
  Movies: MOVIE_WORD_PAIRS,
  Nature: NATURE_WORD_PAIRS,
  Objects: OBJECT_WORD_PAIRS,
  Places: PLACE_WORD_PAIRS,
  Professions: PROFESSION_WORD_PAIRS,
  Sports: SPORTS_WORD_PAIRS,
  Technology: TECHNOLOGY_WORD_PAIRS,
};

/* =========================
   🔎 GET PAIRS
========================= */

export const getClassicWordPairs = (
  category: string
): ClassicWordPair[] => {
  return CLASSIC_WORD_PAIRS_BY_CATEGORY[category] ?? [];
};