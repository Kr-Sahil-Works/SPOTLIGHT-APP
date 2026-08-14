import GreenLoader from "@/components/loaders/GreenLoader";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type LoginUIProps = {
  loading: boolean;
  isOnline: boolean;
  isSignedIn: boolean;
  onGooglePress: () => void;
};

const GOLD = "#E2AE28";
const GOLD_LIGHT = "#F4C95D";
const GOLD_BORDER = "#F2C84D";
const BLACK = "#030303";


function ShimmerLetter({
  letter,
  index,
}: {
  letter: string;
  index: number;
}) {
  const shimmer = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(900 + index * 80),

      Animated.timing(shimmer, {
        toValue: 1,
        duration: 450,
        useNativeDriver: false,
      }),

      Animated.timing(shimmer, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [index]);

  const color = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      GOLD_LIGHT,
      "#FFF1B0",
      GOLD_LIGHT,
    ],
  });

  return (
    <Animated.Text
      style={[
        styles.appNameLetter,
        { color },
      ]}
    >
      {letter}
    </Animated.Text>
  );
}


export default function LoginUI({
  loading,
  isOnline,
  isSignedIn,
  onGooglePress,
}: LoginUIProps) {
  const { height } = useWindowDimensions();

  const pressScale = useRef(
    new Animated.Value(1)
  ).current;

  const morph = useRef(
    new Animated.Value(0)
  ).current;

  const sweep = useRef(
    new Animated.Value(-260)
  ).current;

  /*
   * ----------------------------------------
   * LOADING MORPH
   * ----------------------------------------
   */
  useEffect(() => {
    if (loading) {
      Animated.timing(morph, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      sweep.setValue(-260);

      Animated.timing(sweep, {
        toValue: 260,
        duration: 450,
        useNativeDriver: true,
      }).start();

      return;
    }

    Animated.timing(morph, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  /*
   * ----------------------------------------
   * BUTTON PRESS
   * ----------------------------------------
   */
  const pressIn = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    ).catch(() => {});

    Animated.spring(pressScale, {
      toValue: 0.96,
      speed: 40,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      speed: 40,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  /*
   * ----------------------------------------
   * LOGIN BUTTON ANIMATION
   * ----------------------------------------
   */
  const textOpacity = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const loaderOpacity = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scaleX = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  /*
   * Responsive sizing
   */
  const isSmallScreen = height < 700;

  return (
    <View style={styles.container}>
      {/* ======================================
          BACKGROUND IMAGE
          ====================================== */}

     <Image
  source={require("../../../assets/images/loginpage/login-background.webp")}
  style={StyleSheet.absoluteFill}
  contentFit="cover"
  cachePolicy="memory-disk"
  priority="high"
  allowDownscaling
/>

      {/* ======================================
          DARK OVERLAY
          ====================================== */}

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.48)",
          "rgba(0,0,0,0.12)",
          "rgba(0,0,0,0.25)",
          "rgba(0,0,0,0.94)",
          BLACK,
        ]}
        locations={[
          0,
          0.25,
          0.48,
          0.72,
          1,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle gold atmospheric tint */}
      <LinearGradient
        colors={[
          "rgba(226,174,40,0.04)",
          "transparent",
          "rgba(226,174,40,0.06)",
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* ======================================
          TOP BRAND
          ====================================== */}

      <View
        style={[
          styles.brandSection,
          {
            paddingTop: isSmallScreen
              ? height * 0.07
              : height * 0.09,
          },
        ]}
      >
<View style={styles.appName}>
  {"MilesSpot".split("").map((letter, index) => (
    <ShimmerLetter
      key={`${letter}-${index}`}
      letter={letter}
      index={index}
    />
  ))}
</View>

        <Text style={styles.tagline}>
          Where every friendship reaches MILES.
        </Text>
      </View>

      {/* ======================================
          SPACER
          ====================================== */}

      <View style={styles.middle} />

      {/* ======================================
          LOGIN AREA
          ====================================== */}

      <View
        style={[
          styles.loginSection,
          {
            paddingBottom: isSmallScreen
              ? 24
              : 34,
          },
        ]}
      >
        <Animated.View
          style={{
            width: "100%",
            alignItems: "center",
            transform: [
              {
                scale: pressScale,
              },
              {
                scaleX,
              },
            ],
          }}
        >
          {/* GOOGLE BUTTON */}

          <Pressable
            onPress={onGooglePress}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={
              loading ||
              !isOnline ||
              isSignedIn
            }
            android_ripple={{
              color: "rgba(255,255,255,0.12)",
            }}
            style={[
              styles.googleButton,
              !isOnline && {
                opacity: 0.5,
              },
            ]}
          >
            {/* Sweep animation */}

            <Animated.View
              pointerEvents="none"
              style={[
                styles.sweep,
                {
                  transform: [
                    {
                      translateX: sweep,
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255,255,255,0.22)",
                  "transparent",
                ]}
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 0,
                }}
                style={{
                  flex: 1,
                }}
              />
            </Animated.View>

            {/* Button text */}

            <Animated.View
              style={[
                styles.buttonContent,
                {
                  opacity: textOpacity,
                },
              ]}
            >
              <View style={styles.googleIconContainer}>
                <Ionicons
                  name="logo-google"
                  size={19}
                  color="#1B1A17"
                />
              </View>

              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>
            </Animated.View>

            {/* Loader */}

            <Animated.View
              style={[
                styles.loader,
                {
                  opacity: loaderOpacity,
                },
              ]}
            >
              <GreenLoader />
            </Animated.View>
          </Pressable>

          {/* Offline message */}

          {!isOnline && (
            <Text style={styles.offlineText}>
              Internet connection required to sign in
            </Text>
          )}
        </Animated.View>

        {/* ======================================
            TERMS
            ====================================== */}

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}

          <Text
            style={styles.termsLink}
            onPress={() =>
              router.push(
                "/(settings)/policy/terms-and-conditions"
              )
            }
          >
            Terms
          </Text>

          {" "}and{" "}

          <Text
            style={styles.termsLink}
            onPress={() =>
              router.push(
                "/(settings)/policy/privacy-policy"
              )
            }
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * ========================================
   * ROOT
   * ========================================
   */

  container: {
    flex: 1,
    backgroundColor: BLACK,
  },

  /*
   * ========================================
   * BRAND
   * ========================================
   */

  brandSection: {
    alignItems: "center",
    paddingHorizontal: 24,
  },

appName: {
  flexDirection: "row",
  alignItems: "center",
},

appNameLetter: {
  color: GOLD_LIGHT,

  fontSize: 38,
  lineHeight: 44,

  fontWeight: "900",

  letterSpacing: -1,

  textShadowColor:
    "rgba(226,174,40,0.25)",

  textShadowOffset: {
    width: 0,
    height: 2,
  },

  textShadowRadius: 8,
},
  tagline: {
    color: "#B1A991",

    fontSize: 12,

    letterSpacing: 1.2,

    marginTop: 4,

    textAlign: "center",
  },

  /*
   * ========================================
   * MIDDLE
   * ========================================
   */

  middle: {
    flex: 1,
  },

  /*
   * ========================================
   * LOGIN
   * ========================================
   */

  loginSection: {
    width: "100%",

    paddingHorizontal: 24,

    alignItems: "center",
  },

  googleButton: {
    width: "100%",
    maxWidth: 330,

    height: 58,

    borderRadius: 30,

    backgroundColor: GOLD,

    borderWidth: 1,
    borderColor: GOLD_BORDER,

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    shadowColor: GOLD,
    shadowOpacity: 0.28,
    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 7,
  },

  buttonContent: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
  },

  googleIconContainer: {
    width: 24,
    height: 24,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  googleButtonText: {
    color: "#090805",

    fontSize: 16,

    fontWeight: "800",

    letterSpacing: -0.2,
  },

  sweep: {
    position: "absolute",

    width: 250,
    height: "100%",
  },

  loader: {
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",
  },

  offlineText: {
    color: "#8C8575",

    textAlign: "center",

    marginTop: 9,

    fontSize: 12,
  },

  /*
   * ========================================
   * TERMS
   * ========================================
   */

  termsText: {
    color: "#777063",

    textAlign: "center",

    fontSize: 11.5,

    lineHeight: 18,

    maxWidth: 310,

    marginTop: 14,
  },

  termsLink: {
    color: "#DDB33A",

    textDecorationLine: "underline",

    fontWeight: "700",
  },
});