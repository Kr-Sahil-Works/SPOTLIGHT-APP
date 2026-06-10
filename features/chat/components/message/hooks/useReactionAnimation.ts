import {
    useRef,
} from "react";

import {
    Animated,
} from "react-native";

export default function useReactionAnimation() {
  const scale =
    useRef(
      new Animated.Value(1)
    ).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 1.45,

      useNativeDriver: true,

      friction: 4,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,

      useNativeDriver: true,

      friction: 5,
    }).start();
  };

  return {
    scale,

    animateIn,

    animateOut,
  };
}