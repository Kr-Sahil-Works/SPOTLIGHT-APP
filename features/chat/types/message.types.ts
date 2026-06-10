export type MessageLayout = {
  x: number;

  y: number;

  width: number;

  height: number;
};

export type OverlayType =
  | "menu"
  | "reaction"
  | "delete"
  | null;