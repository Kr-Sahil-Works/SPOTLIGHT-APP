import {
    Easing,
} from "react-native-reanimated";

export const messageSpring =
  {
    damping: 18,

    stiffness: 180,
  };

export const highlightTiming =
  {
    duration: 220,

    easing: Easing.out(
      Easing.ease
    ),
  };

export const reactionScale =
  {
    damping: 12,

    stiffness: 220,
  };