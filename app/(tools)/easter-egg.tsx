import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EasterEgg() {
  const router = useRouter();

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),

      Animated.timing(rotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      router.back();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [router, fade, scale, rotate, glow]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8deg", "0deg"],
  });

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/loginpage/login-background.webp")}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fade,
            transform: [
              { scale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <View style={styles.eggContainer}>
          <Text style={styles.egg}>🥚</Text>
        </View>

        <Text style={styles.title}>
          Easter Egg Found
        </Text>

        <Text style={styles.subtitle}>
          You discovered something hidden.
        </Text>

        <View style={styles.line} />

        <Text style={styles.smallText}>
          Thanks for exploring MilesSpot ✦
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.68)",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#cab301",
  },

  eggContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(202, 168, 1, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(202, 145, 1, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#dede15",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 15,
  },

  egg: {
    fontSize: 72,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 28,
  },

  subtitle: {
    color: "#A7A7A7",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  line: {
    width: 70,
    height: 2,
    backgroundColor: "#01CA08",
    borderRadius: 10,
    marginTop: 22,
  },

  smallText: {
    color: "#6F6F6F",
    fontSize: 12,
    marginTop: 14,
    letterSpacing: 0.5,
  },
});