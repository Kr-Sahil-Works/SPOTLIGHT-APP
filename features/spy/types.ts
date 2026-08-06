export type Character = {
  id: number;
  name: string;
  goal: string;
  description: string;
  image: any;
};

export type HowToPlayStep = {
  id: number;
  title: string;
  description: string;
};

export type GameMode = {
  id: number;
  title: string;
  description: string;
  image: any;
};