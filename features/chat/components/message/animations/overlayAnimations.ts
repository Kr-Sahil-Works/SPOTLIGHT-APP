import {
    Easing,
} from "react-native-reanimated";

export const overlayFade =
  {
    duration: 160,

    easing: Easing.out(
      Easing.ease
    ),
  };

export const overlayScale =
  {
    damping: 15,

    stiffness: 180,
  };

export const overlayBlur =
  {
    duration: 120,
  };