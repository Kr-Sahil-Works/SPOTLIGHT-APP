import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OnboardingLayout from "../components/OnboardingLayout";

import appLogo from "../../../assets/images/icons/app/default-green.png";

type Props = {
  onNext: () => void;
};

export default function OnboardingWelcome({
  onNext,
}: Props) {
  /* =========================
     LOGO ANIMATION
  ========================= */

  const logoOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.92)
  ).current;

  /* =========================
     WELCOME TEXT
  ========================= */

  const welcomeOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const welcomeTranslate = useRef(
    new Animated.Value(10)
  ).current;

  /* =========================
     TITLE + TAGLINE
  ========================= */

  const titleOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const titleTranslate = useRef(
    new Animated.Value(12)
  ).current;

  /* =========================
     INTRO ANIMATION
  ========================= */

  useEffect(() => {
    Animated.parallel([
      /* Logo fade */
      Animated.timing(logoOpacity, {
        toValue: 1,

        duration: 1500,

        useNativeDriver: true,
      }),

      /* Logo gentle settle */
      Animated.spring(logoScale, {
        toValue: 1,

        friction: 9,
        tension: 30,

        useNativeDriver: true,
      }),

      /* WELCOME TO */
      Animated.timing(welcomeOpacity, {
        toValue: 1,

        duration: 650,

        useNativeDriver: true,
      }),

      Animated.timing(welcomeTranslate, {
        toValue: 0,

        duration: 650,

        useNativeDriver: true,
      }),

      /* MilesSpot + tagline */
      Animated.timing(titleOpacity, {
        toValue: 1,

        duration: 700,

        delay: 40,

        useNativeDriver: true,
      }),

      Animated.timing(titleTranslate, {
        toValue: 0,

        duration: 700,

        delay: 40,

        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <OnboardingLayout
      current={0}
      total={3}
      onNext={onNext}
    >
      <View style={styles.container}>
        {/* =========================
            CENTER SOFT GLOW
        ========================= */}

        <View style={styles.glow} />

        {/* =========================
            LOGO
        ========================= */}

        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,

              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <Image
            source={appLogo}
     contentFit="contain"
            style={styles.logo}
          />
        </Animated.View>

        {/* =========================
            WELCOME TO
        ========================= */}

        <Animated.Text
          style={[
            styles.eyebrow,
            {
              opacity: welcomeOpacity,

              transform: [
                {
                  translateY:
                    welcomeTranslate,
                },
              ],
            },
          ]}
        >
          WELCOME TO
        </Animated.Text>

        {/* =========================
            MAIN TITLE
        ========================= */}

        <Animated.View
          style={{
            opacity: titleOpacity,

            transform: [
              {
                translateY:
                  titleTranslate,
              },
            ],
          }}
        >
          <Text style={styles.title}>
            MilesSpot
          </Text>

          <Text style={styles.tagline}>
            Where every friendship{"\n"}
            reaches{" "}
            <Text style={styles.gold}>
              MILES.
            </Text>
          </Text>
        </Animated.View>

      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  /* =========================
     CONTAINER
  ========================= */

  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,

    overflow: "hidden",
  },

  /* =========================
     CENTER STATIC GLOW

     Kept very subtle because
     ambient component already
     has its own breathing glow.
  ========================= */

  glow: {
    position: "absolute",

    width: 340,
    height: 340,

    borderRadius: 170,

    backgroundColor: "#8A641B",

    opacity: 0.055,
  },

  /* =========================
     LOGO
  ========================= */

  logoWrapper: {
    width: 132,
    height: 132,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 28,
  },

  logo: {
    width: 145,
    height: 145,
  },

  /* =========================
     EYEBROW
  ========================= */

  eyebrow: {
    color: "#A68A43",

    fontSize: 12,

    fontWeight: "700",

    letterSpacing: 3,

    marginBottom: 5,
  },

  /* =========================
     TITLE
  ========================= */

  title: {
    color: "#F4C95D",

    fontSize: 40,

    lineHeight: 48,

    fontWeight: "900",

    letterSpacing: -1,

    textAlign: "center",
  },

  /* =========================
     TAGLINE
  ========================= */

  tagline: {
    color: "#F5F2EA",

    fontSize: 20,

    lineHeight: 30,

    fontWeight: "700",

    textAlign: "center",

    marginTop: 16,
  },

  /* =========================
     GOLD HIGHLIGHT
  ========================= */

  gold: {
    color: "#F4C95D",

    fontWeight: "900",

    letterSpacing: 1,
  },
});