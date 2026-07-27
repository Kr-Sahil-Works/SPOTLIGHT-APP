import { ImageSourcePropType } from "react-native";

export type QuickTool = {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  route: string;
};

export const QUICK_TOOLS: QuickTool[] = [
  {
    id: "notes",
    title: "Notes",
    icon: require("@/assets/images/icons/MagicLever_Icons/notes.png"),
    route: "/(tools)/notespage",
  },

  {
    id: "calculator",
    title: "Calculator",
    icon: require("@/assets/images/icons/MagicLever_Icons/calculator.png"),
    route: "/(tools)/calculator",
  },

  {
    id: "moments",
    title: "Moments",
    icon: require("@/assets/images/icons/MagicLever_Icons/moments_icon.png"),
    // Change this when you create a dedicated Moments page
    route: "/collections",
  },

  {
    id: "bookmarks",
    title: "Bookmarks",
    icon: require("@/assets/images/icons/MagicLever_Icons/bookmark.png"),
    route: "/(tabs)/bookmarks",
  },

  {
    id: "settings",
    title: "Settings",
    icon: require("@/assets/images/icons/MagicLever_Icons/settings.png"),
    route: "/(settings)/settings",
  },
];