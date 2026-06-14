import { DARK_THEMES } from "./dark";
import { DREAMSCAPE_THEMES } from "./dreamscape";
import { FEATURED_THEMES } from "./featured";
import { GRADIENT_THEMES } from "./gradientThemes";
import { HEART_THEMES } from "./hearts";
import { LANDSCAPE_THEMES } from "./landscapes";
import { NATURE_THEMES } from "./nature";
import { SOLID_THEMES } from "./solidThemes";
import { SPECIAL_THEMES } from "./special";


export * from "./types";
export * from "./wallpapers";

export const CHAT_THEMES = [
  ...SOLID_THEMES,

  ...FEATURED_THEMES,

  ...DARK_THEMES,

  ...DREAMSCAPE_THEMES,

  ...HEART_THEMES,

  ...LANDSCAPE_THEMES,

  ...NATURE_THEMES,

  ...SPECIAL_THEMES,

  ...GRADIENT_THEMES,
];