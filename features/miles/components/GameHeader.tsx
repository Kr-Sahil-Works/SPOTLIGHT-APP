import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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
  onEventsPress?: () => void;
  onRoomsPress?: () => void;
};

function ActionButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.96, {
            duration: 90,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 90,
          });
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}


export default function GamesHeader({
  onEventsPress,
  onRoomsPress,
}: Props) {
    const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          Games
        </Text>

        <View style={styles.actions}>
         <ActionButton
  onPress={() => {
    if (onRoomsPress) {
      onRoomsPress();
      return;
    }

    router.push("/games/rooms" as any);
  }}
>
            <View style={styles.roomPill}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                  name="door-closed"
                  size={13}
                  color="#D6A83E"
                />
              </View>

              <Text style={styles.roomText}>
                Game Room
              </Text>
            </View>
          </ActionButton>
        </View>
      </View>

      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  /* =========================
     HEADER
  ========================= */

  container: {
    marginTop: 30,

    paddingHorizontal: 20,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  /* =========================
     TITLE
  ========================= */

  title: {
    fontFamily: "Manrope-ExtraBold",

    fontSize: 27,

    color: "#E2C16A",

    letterSpacing: -0.7,

    includeFontPadding: false,

    textShadowColor: "rgba(226,193,106,0.16)",

    textShadowRadius: 5,

    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },

  /* =========================
     ACTIONS
  ========================= */

  actions: {
    flexDirection: "row",

    alignItems: "center",
  },

  /* =========================
     GAME ROOM GLASS PILL
  ========================= */

  roomPill: {
    height: 27,

    paddingLeft: 5,

    paddingRight: 9,

    borderRadius: 9,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(10,10,12,0.72)",

    borderWidth: 0.8,

    borderColor:
      "rgba(226,193,106,0.16)",

    shadowColor: "#000",

    shadowOpacity: 0.32,

    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,

    overflow: "hidden",
  },

  /* =========================
     ICON
  ========================= */

  iconWrap: {
    width: 19,

    height: 19,

    borderRadius: 6,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      "rgba(226,193,106,0.10)",

    borderWidth: 0.7,

    borderColor:
      "rgba(226,193,106,0.16)",
  },

  /* =========================
     TEXT
  ========================= */

  roomText: {
    marginLeft: 5,

    color: "#C8AA62",

    fontSize: 9.5,

    fontWeight: "800",

    letterSpacing: 0.15,

    includeFontPadding: false,
  },

  /* =========================
     DIVIDER
  ========================= */

  divider: {
    height: 1,

    marginTop: 12,

    marginHorizontal: 20,

    backgroundColor:
      "rgba(255,255,255,0.055)",
  },
});