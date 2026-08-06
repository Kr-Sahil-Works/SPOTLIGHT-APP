import spyImage from "@/assets/images/games/spy/rules/spy.webp";
import villagerImage from "@/assets/images/games/spy/rules/villager_girl.webp";

import masterModeImage from "@/assets/images/games/spy/rules/master_mode.webp";
import classicModeImage from "@/assets/images/games/spy/rules/spy_mode.webp";
import wordlessModeImage from "@/assets/images/games/spy/rules/wordless_mode.webp";

import {
  Character,
  GameMode,
  HowToPlayStep,
} from "../types";

export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: "Villager",

    goal: "",

    description:
       "Receives the same secret word. Work together to find the Spy.",

    image: villagerImage,
  },

  {
    id: 2,
    name: "Spy",

    goal: "",

    description:
       "Receives no word. Stay hidden and guess the word if caught.",

    image: spyImage,
  },
];

export const HOW_TO_PLAY: HowToPlayStep[] = [
  {
    id: 1,
    title: "Get Your Role",
    description: "Villagers receive the word. The Spy gets a different word or nothing.",
  },
  {
    id: 2,
    title: "Give a Clue/ Hint",
    description: "Describe the word without saying it.",
  },
  {
    id: 3,
    title: "Vote",
    description: "Discuss and vote for the Spy.",
  },
  {
    id: 4,
    title: "Spy's Chance",
    description: "If caught, the Spy tries to guesses the word to win.",
  },
];


export const GAME_MODES: GameMode[] = [
  {
    id: 1,

    title: "Who's the Spy?",

    description:
      "Classic mode with one hidden Spy.",

    image: classicModeImage,
  },

  {
    id: 2,

    title: "Wordless Spy",

    description:
      "A harder mode where spy gets no word.",

    image: wordlessModeImage,
  },
    {
    id: 3,

    title: "Master's of Spy",

    description:
      "A mode where there are 2 spy & complex gameplay.",

    image: masterModeImage,
  },
];