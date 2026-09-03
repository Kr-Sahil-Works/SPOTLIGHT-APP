import React, {
  useEffect,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import Svg, {
  Circle,
} from "react-native-svg";

import Reanimated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle =
  Reanimated.createAnimatedComponent(
    Circle
  );

type Props = {
  visible: boolean;
  remaining: number | null;
  turnEndsAt?: number;
};

export default function VotingTimer({
  visible,
  remaining,
  turnEndsAt,
}: Props) {
  const progress =
    useSharedValue(1);

  /* =========================
     ⏱️ SMOOTH PROGRESS
  ========================= */

  useEffect(() => {
    if (
      !visible ||
      !turnEndsAt
    ) {
      progress.value = 1;
      return;
    }

    const duration =
      Math.max(
        0,
        turnEndsAt -
          Date.now()
      );

    progress.value = 1;

    progress.value =
      withTiming(
        0,
        {
          duration,
          easing:
            Easing.linear,
        }
      );
  }, [
    visible,
    turnEndsAt,
  ]);

  /* =========================
     ⭕ TIMER ARC
  ========================= */
const radius = 18.4;

const circumference =
  2 * Math.PI * radius;


  const animatedProps =
    useAnimatedProps(
      () => ({
        strokeDashoffset:
          circumference *
          (1 - progress.value),
      })
    );

  if (
    !visible ||
    remaining === null
  ) {
    return null;
  }

  return (
    <View
      style={styles.container}
    >
      {/* =========================
          ⏱️ STOPWATCH
      ========================= */}

      <View
        style={styles.timerVisual}
      >
      <Svg
  width={45}
  height={45}
  viewBox="0 0 45 45"
  style={styles.progressRing}
>
  <Circle
    cx={22.5}
    cy={22.5}
    r={18.4}
    fill="none"
    stroke="rgba(242,169,0,0.12)"
    strokeWidth={2}
  />

  <AnimatedCircle
    cx={22.5}
    cy={22.5}
    r={18.4}
    fill="none"
    stroke="#D99A00"
    strokeWidth={2}
    strokeLinecap="round"
    strokeDasharray={`${circumference} ${circumference}`}
    rotation="-90"
    origin="22.5, 22.5"
    animatedProps={animatedProps}
  />
</Svg>

        {/* =========================
            TRANSPARENT STOPWATCH
        ========================= */}

        <Image
          source={require(
            "@/assets/images/icons/timer.webp"
          )}
          contentFit="contain"
          style={styles.stopwatch}
        />
      </View>

      {/* =========================
          SECONDS
      ========================= */}

      <View
        style={styles.secondsRow}
      >
        <Text
          style={styles.seconds}
        >
          {remaining}
        </Text>

        <Text
          style={styles.sec}
        >
          SEC
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      top: 64,

      right: 16,

      alignItems: "center",

      zIndex: 100,
    },

   timerVisual: {
  width: 45,
  height: 45,

  alignItems: "center",
  justifyContent: "center",
},

stopwatch: {
  width: 30,
  height: 30,
  opacity: 0.9,
},

secondsRow: {
  marginTop: -4,

  flexDirection: "row",
  alignItems: "baseline",
  justifyContent: "center",

  gap: 2,
},

seconds: {
  color: "#F2A900",

  fontSize: 12, // unchanged
  fontWeight: "900",

  letterSpacing: 0.2,
},

sec: {
  color:
    "rgba(255,255,255,0.48)",

  fontSize: 6, // unchanged
  fontWeight: "800",

  marginLeft: 2,

  letterSpacing: 0.8,
},

    progressRing: {
      position: "absolute",

      top: 0,
      left: 0,
    },


  });