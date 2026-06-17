export const WALLPAPERS = {
  // ======================
  // DARK
  // ======================

  Cherry: require("@/assets/images/ThemeWalls/Dark/Cherry.webp"),
  HeartOutline: require("@/assets/images/ThemeWalls/Dark/HeartOutline.webp"),
  MidnightBloom: require("@/assets/images/ThemeWalls/Dark/MidnightBloom.webp"),
  NightFlower: require("@/assets/images/ThemeWalls/Dark/NightFolwer.webp"),
  Rose: require("@/assets/images/ThemeWalls/Dark/Rose.webp"),
  Space: require("@/assets/images/ThemeWalls/Dark/Space.webp"),
  Stars: require("@/assets/images/ThemeWalls/Dark/stars.webp"),
  WhitePetals: require("@/assets/images/ThemeWalls/Dark/WhitePetals.webp"),

  // ======================
  // DREAMSCAPE
  // ======================

  Bridge: require("@/assets/images/ThemeWalls/Dreamscape/Bridge.webp"),
  CandyClouds: require("@/assets/images/ThemeWalls/Dreamscape/CandyClouds.webp"),
  Clouds: require("@/assets/images/ThemeWalls/Dreamscape/Clouds.webp"),
  Dreamy: require("@/assets/images/ThemeWalls/Dreamscape/Dreamy.webp"),
  FallenStar: require("@/assets/images/ThemeWalls/Dreamscape/FallenStar.webp"),
  IntoClouds: require("@/assets/images/ThemeWalls/Dreamscape/IntoClouds.webp"),
  LampLight: require("@/assets/images/ThemeWalls/Dreamscape/LampLight.webp"),
  RoadsideDream: require("@/assets/images/ThemeWalls/Dreamscape/RoadsideDream.webp"),


  // ======================
  // FEATURED
  // ======================

  BlueSolar: require("@/assets/images/ThemeWalls/Featured/BlueSolar.webp"),
  DreamSky: require("@/assets/images/ThemeWalls/Featured/DreamSky.webp"),
  Earth: require("@/assets/images/ThemeWalls/Featured/Earth.webp"),
  CuteGhosts: require("@/assets/images/ThemeWalls/Featured/Ghost.webp"),
  Hands: require("@/assets/images/ThemeWalls/Featured/Hands.webp"),
  LateDream: require("@/assets/images/ThemeWalls/Featured/LateDream.webp"),
  Lake: require("@/assets/images/ThemeWalls/Featured/Lake.webp"),
  MoonLight: require("@/assets/images/ThemeWalls/Featured/MoonLight.webp"),
  PickMoon: require("@/assets/images/ThemeWalls/Featured/PickMoon.webp"),
  PinkSky: require("@/assets/images/ThemeWalls/Featured/PinkSky.webp"),
  PinkTree: require("@/assets/images/ThemeWalls/Featured/PinkTree.webp"),
  Rocket: require("@/assets/images/ThemeWalls/Featured/Rocket.webp"),
  Roses: require("@/assets/images/ThemeWalls/Featured/Roses.webp"),
  She: require("@/assets/images/ThemeWalls/Featured/She.webp"),


  // ======================
  // HEARTS
  // ======================


  ILoveYou: require("@/assets/images/ThemeWalls/Hearts/ILoveYou.webp"),
  HeartPot: require("@/assets/images/ThemeWalls/Hearts/Pot.webp"),
  LoveWaves: require("@/assets/images/ThemeWalls/Hearts/Lovewaves.webp"),
  Promise: require("@/assets/images/ThemeWalls/Hearts/Promise.webp"),
  RedNotes: require("@/assets/images/ThemeWalls/Hearts/RedNotes.webp"),
  SweetHearts: require("@/assets/images/ThemeWalls/Hearts/SweetHearts.webp"),

  // ======================
  // LANDSCAPES
  // ======================
  Away: require("@/assets/images/ThemeWalls/Landscapes/Away.webp"),
  BlueMoon: require("@/assets/images/ThemeWalls/Landscapes/BlueMoon.webp"),
  Home: require("@/assets/images/ThemeWalls/Landscapes/Home.webp"),
  Night: require("@/assets/images/ThemeWalls/Landscapes/Night.webp"),
  PurpleForest: require("@/assets/images/ThemeWalls/Landscapes/PurpleForest.webp"),
  Valley: require("@/assets/images/ThemeWalls/Landscapes/Valley.webp"),



  // ======================
  // NATURE
  // ======================

  AboveTrees: require("@/assets/images/ThemeWalls/Nature/AboveTrees.webp"),
  BlueNight: require("@/assets/images/ThemeWalls/Nature/BlueNight.webp"),
  FarmHouse: require("@/assets/images/ThemeWalls/Nature/FarmHouse.webp"),
  GreenNight: require("@/assets/images/ThemeWalls/Nature/GreenNight.webp"),
  Scene: require("@/assets/images/ThemeWalls/Nature/Scene.webp"),
  ValleyView: require("@/assets/images/ThemeWalls/Nature/ValleyView.webp"),


  // ======================
  // Special
  // ======================
  Eternal: require("@/assets/images/ThemeWalls/Special/Eternal.webp"),
  Hold: require("@/assets/images/ThemeWalls/Special/Hold.webp"),
  TogetherLateNights: require("@/assets/images/ThemeWalls/Special/LateNights.webp"),
  OnRoof: require("@/assets/images/ThemeWalls/Special/OnRoof.webp"),
  Vintage: require("@/assets/images/ThemeWalls/Special/Vintage.webp"),
  Where: require("@/assets/images/ThemeWalls/Special/Where.webp"),
} as const;



export type WallpaperId = keyof typeof WALLPAPERS;