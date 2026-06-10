import * as Haptics from "expo-haptics";

import { useMemo, useRef } from "react";

import {
  Animated,
  PanResponder,
} from "react-native";

type Props<T> = {
  item: T;

  onReply?: (msg: T) => void;
};

export default function useMessageGestures<
  T,
>({
  item,
  onReply,
}: Props<T>) {
  const panX = useRef(
    new Animated.Value(0)
  ).current;

const resetPosition = useMemo(
  () => () => {
    Animated.spring(panX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
    }).start();
  },
  [panX]
);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder:
          (_, g) => {
            return (
              Math.abs(g.dx) > 18 &&
              Math.abs(g.dx) >
                Math.abs(g.dy)
            );
          },

        onPanResponderMove: (
          _,
          g
        ) => {
          if (
        g.dx <= 0 ||
Math.abs(g.dy) >
  Math.abs(g.dx) ||
Math.abs(g.vy) > 0.55
          ) {
            return;
          }

          const limitedDx =
            g.dx > 90
              ? 90 +
                (g.dx - 90) * 0.18
              : g.dx;

          panX.setValue(
            Math.max(0, limitedDx)
          );
        },

    onPanResponderRelease:
  (_, g) => {
    if (
      g.dx > 75
    ) {
      Haptics.impactAsync(
        Haptics
          .ImpactFeedbackStyle
          .Medium
      );

      onReply?.(item);
    }

    resetPosition();
  },

        onPanResponderTerminate:
          resetPosition,
      }),
    [item, onReply]
  );

  const arrowOpacity =
    panX.interpolate({
      inputRange: [20, 70],

      outputRange: [0, 1],

      extrapolate: "clamp",
    });

  return {
    panX,

    arrowOpacity,

    panResponder,
  };
}