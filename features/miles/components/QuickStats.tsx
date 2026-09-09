import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onRankingPress?: () => void;
  onTasksPress?: () => void;
  onFriendsPress?: () => void;
};

function AnimatedStat({
  image,
  title,
  color,
  onPress,
  iconStyle,
}: {
  image: any;
  title: string;
  color: string;
  onPress?: () => void;
  iconStyle?: any;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.wrapper,
        animatedStyle,
      ]}
    >
      <Pressable
        style={styles.item}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.97, {
            duration: 90,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 90,
          });
        }}
      >
        {/* 3D ASSET */}
        <Image
          source={image}
          style={[
  styles.icon,
  iconStyle,
]}
        />

        {/* BOTTOM-LEFT LABEL */}
        <View style={styles.labelWrapper}>
          <Text
            style={[
              styles.label,
              {
                color,
                textShadowColor: `${color}30`,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        {/* SUBTLE GLASS HIGHLIGHT */}
        <View
          pointerEvents="none"
          style={styles.gloss}
        />
      </Pressable>
    </Animated.View>
  );
}

export default function QuickStats({
  onRankingPress,
  onTasksPress,
  onFriendsPress,
}: Props) {
  return (
    <View style={styles.container}>
      <AnimatedStat
        title="Ranking"
        color="#E8B83D"
        image={require("@/assets/images/miles/ranking.png")}
        onPress={() => {
  router.push("/games/rooms/ranking");
}}
      />

      <AnimatedStat
        title="Tasks"
        color="#D96868"
        image={require("@/assets/images/miles/tasks.png")}
     onPress={() => {
  router.push("/games/rooms/tasks");
}}
      />

   <AnimatedStat
        title="Friends"
        color="#B58A5C"
        image={require("@/assets/images/spot/moments.png")}
        iconStyle={styles.friendsIcon}
        onPress={() => {
  router.push("/games/rooms/friends");
}}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  /* =========================
     CONTAINER
  ========================= */

container: {
    marginTop: 40,
    marginBottom: 20,

    paddingHorizontal: 16,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 9,
  },

  /* =========================
     CARD WRAPPER
  ========================= */

wrapper: {
    width: "28%",

    marginHorizontal: 0,
  },

  /* =========================
     CARD
  ========================= */

item: {
    height: 62,

    width: "100%",

    position: "relative",

    overflow: "visible",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 12,

    /*
     * SAME DARK GLASS BACKGROUND
     */

    backgroundColor:
      "rgba(10,10,13,0.58)",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.09)",

    shadowColor: "#000",

    shadowOpacity: 0.28,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  /* =========================
     3D ASSET
  ========================= */

 icon: {
    position: "absolute",

    width: 74,

    height: 74,

    resizeMode: "contain",

    right: -8,

    top: -22,

    zIndex: 5,

    transform: [
      {
        rotate: "5deg",
      },
    ],
  },

  /* =========================
     LABEL
  ========================= */

 labelWrapper: {
    position: "absolute",

    left: 7,

    bottom: 8,

    zIndex: 10,

    maxWidth: "72%",
  },

  friendsIcon: {
    width: 67,
    height: 67,
    right: -8,
    top: -20,
  },


   label: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 0.25,

    includeFontPadding: false,

    textAlign: "left",

    textShadowRadius: 4,

    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },

  /* =========================
     GLASS HIGHLIGHT
  ========================= */

  gloss: {
    position: "absolute",

    top: 1,

    left: 10,

    right: 10,

    height: 1,

    borderRadius: 99,

    backgroundColor:
      "rgba(255,255,255,0.14)",

    zIndex: 20,
  },
});