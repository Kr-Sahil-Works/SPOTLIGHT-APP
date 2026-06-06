import { CHAT_PATTERN_THEMES } from "./chatPatterns";
import { DARK_THEMES } from "./dark";
import { DREAMSCAPE_THEMES } from "./dreamscape";
import { FEATURED_THEMES } from "./featured";
import { GRADIENT_THEMES } from "./gradientThemes";
import { HEART_THEMES } from "./hearts";
import { LANDSCAPE_THEMES } from "./landscapes";
import { LUNAR_THEMES } from "./lunar";
import { NATURE_THEMES } from "./nature";
import { PIXEL_ART_THEMES } from "./pixelArt";
import { SOLID_THEMES } from "./solidThemes";
import { TOGETHER_THEMES } from "./together";

export * from "./types";
export * from "./wallpapers";

export const CHAT_THEMES = [
  ...SOLID_THEMES,

  ...FEATURED_THEMES,

  ...CHAT_PATTERN_THEMES,

  ...DARK_THEMES,

  ...DREAMSCAPE_THEMES,

  ...HEART_THEMES,

  ...LANDSCAPE_THEMES,

  ...LUNAR_THEMES,

  ...NATURE_THEMES,

  ...PIXEL_ART_THEMES,

  ...TOGETHER_THEMES,

  ...GRADIENT_THEMES,
];