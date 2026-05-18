import React from "react";

import {
  Animated,
  Text,
  View,
} from "react-native";

type Props = {
  arrowOpacity: Animated.AnimatedInterpolation<
    string | number
  >;

  color: string;
};

export default function SwipeReply({
  arrowOpacity,
  color,
}: Props) {
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        opacity: arrowOpacity,

        position: "absolute",

        left: -42,

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 28,

          height: 28,

          borderRadius: 14,

          backgroundColor: color,

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#000",

            fontSize: 14,

            fontWeight: "700",
          }}
        >
          ↩
        </Text>
      </View>
    </Animated.View>
  );
}