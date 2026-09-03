/* =========================
   🗂️ CLASSIC SPY CATEGORIES
========================= */

export const CLASSIC_CATEGORIES = [
  {
    id: "food",
    name: "Food",
  },
  {
    id: "places",
    name: "Places",
  },
  {
    id: "animals",
    name: "Animals",
  },
  {
    id: "objects",
    name: "Objects",
  },
  {
    id: "sports",
    name: "Sports",
  },
  {
    id: "movies",
    name: "Movies",
  },
  {
    id: "nature",
    name: "Nature",
  },
  {
    id: "technology",
    name: "Technology",
  },
{
  id: "names",
  name: "Names",
},
  {
    id: "professions",
    name: "Professions",
  },
  {
    id: "entertainment",
    name: "Entertainment",
  },
  {
    id: "everyday",
    name: "Everyday Life",
  },
] as const;

export type ClassicCategory =
  (typeof CLASSIC_CATEGORIES)[number];

export type ClassicCategoryId =
  ClassicCategory["id"];

/* =========================
   🎲 RANDOM 8 OF 12
========================= */

export function getRandomClassicCategories() {
  const shuffled = [
    ...CLASSIC_CATEGORIES,
  ];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[j],
    ] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled.slice(0, 8);
}