export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image?: any;
};

export const onboardingData: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Welcome to MilesSpot",
    description:
      "A place to stay connected and never miss the moments that matter.",
  },
  {
    id: "miles",
    title: "Your conversations have a story",
    description:
      "Miles helps you discover the journey behind your conversations.",
  },
  {
    id: "memories",
    title: "Keep your memories close",
    description:
      "Photos, messages, moments and memories — all in one place.",
  },
];