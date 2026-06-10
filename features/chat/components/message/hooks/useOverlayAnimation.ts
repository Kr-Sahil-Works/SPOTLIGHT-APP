import {
    useEffect,
    useRef,
} from "react";

import {
    Animated,
} from "react-native";

export default function useOverlayAnimation(
  visible: boolean
) {
  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.92)
    ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(
          opacity,
          {
            toValue: 1,

            duration: 140,

            useNativeDriver: true,
          }
        ),

        Animated.spring(scale, {
          toValue: 1,

          friction: 7,

          tension: 90,

          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    opacity.setValue(0);

    scale.setValue(0.92);
  }, [
    opacity,
    scale,
    visible,
  ]);

  return {
    opacity,

    scale,
  };
}