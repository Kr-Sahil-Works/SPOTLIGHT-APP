import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View
} from "react-native";

export default function TypingDots({
  avatar,
  typing,
}: {
  avatar?: string;
  typing: boolean;
}) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const fade = useRef(new Animated.Value(0)).current;

  // 🔥 fade in/out
  useEffect(() => {
    Animated.timing(fade, {
      toValue: typing ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [typing]);

  const createAnimation = (dot: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 320,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    createAnimation(dot1, 0).start();
    createAnimation(dot2, 120).start();
    createAnimation(dot3, 240).start();
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [2, -3],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1.1],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
  <Animated.View
  style={{
    opacity: fade,
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 14,
    marginBottom: 2,
    minHeight: 40, // ✅ ADD THIS
  }}
>
      {/* AVATAR */}
      <Image
        source={
          avatar
            ? { uri: avatar }
            : require("@/assets/images/iconbg.png")
        }
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          marginRight: 6,
        }}
      />

      {/* BUBBLE */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 16,
        }}
      >

        <View style={{ flexDirection: "row" }}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View key={i} style={[{ marginHorizontal: 2 }, dotStyle(d)]}>
              <LinearGradient
                colors={["#22c55e", "#4ade80"]}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                }}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}