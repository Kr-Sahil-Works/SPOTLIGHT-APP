import { storage } from "@/lib/mmkv";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  visible: boolean;
  fullname?: string;
  onClose: () => void;

  blurIntensity?: number;
  dimOpacity?: number;
};
export default function WelcomeModal({
  visible,
  onClose,
  blurIntensity = 25,
  dimOpacity = 0.51,
}: Props) {
  const { width, height } = useWindowDimensions();

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const scale = useRef(
    new Animated.Value(0.92)
  ).current;

  const float = useRef(
    new Animated.Value(0)
  ).current;

  const rotate = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0.92);
    float.setValue(0);
    rotate.setValue(0);

    const entrance = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 140,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]);

    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(float, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const tilting = Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(rotate, {
          toValue: -1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(rotate, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    entrance.start();
    floating.start();
    tilting.start();

    const timer = setTimeout(() => {
      storage.set(
        "welcome_card_seen",
        true
      );

      onClose();
    }, 22000);

    return () => {
      clearTimeout(timer);

      floating.stop();
      tilting.stop();

      float.stopAnimation();
      rotate.stopAnimation();
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const rotateZ = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [
      "-0.6deg",
      "0deg",
      "0.6deg",
    ],
  });

  /*
   * Keep the card comfortably inside the screen.
   *
   * Width is limited by both:
   * - screen width
   * - screen height
   *
   * This prevents the artwork from becoming
   * enormous on tall/narrow devices.
   */
  const cardWidth = Math.min(
    width * 0.88,
    height * 0.58,
    430
  );

  const cardHeight =
    cardWidth * 1.08;

return (
  <View style={styles.overlay}>

    {/* REAL BACKGROUND BLUR */}
    <BlurView
      intensity={blurIntensity}
      tint="dark"
      experimentalBlurMethod="dimezisBlurView"
      style={StyleSheet.absoluteFill}
    />

    {/* DARKNESS OVER BLUR */}
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: `rgba(0, 0, 0, ${dimOpacity})`,
        },
      ]}
    />

    {/* TAP OUTSIDE TO CLOSE */}
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => {
        storage.set(
          "welcome_card_seen",
          true
        );

        onClose();
      }}
    />

    {/* CENTERED WELCOME CARD */}
    <View
      style={styles.centerContainer}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            height: cardHeight,

            opacity,

            transform: [
              {
                translateY,
              },
              {
                scale,
              },
              {
                rotateZ,
              },
            ],
          },
        ]}
      >
        <Image
          source={require(
            "@/assets/images/loginpage/mili-welcome-card.webp"
          )}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
          allowDownscaling
        />
      </Animated.View>
    </View>

  </View>
);
}

const styles = StyleSheet.create({
overlay: {
  ...StyleSheet.absoluteFillObject,

  justifyContent: "center",
  alignItems: "center",

  zIndex: 99999,
},

centerContainer: {
  ...StyleSheet.absoluteFillObject,

  justifyContent: "center",
  alignItems: "center",

  pointerEvents: "box-none",
},
  cardWrapper: {
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#D6A928",

    shadowOffset: {
      width: 0,
      height: 18,
    },

    shadowOpacity: 0.22,
    shadowRadius: 28,

    elevation: 18,
  },
});