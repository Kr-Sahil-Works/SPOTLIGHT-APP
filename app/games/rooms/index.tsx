import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import JoinRoomModal from "@/features/games/spy/components/JoinRoomModal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function ActionCard({
  icon,
  title,
  subtitle,
  colors,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  colors: [string, string];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.actionWrapper,
        animatedStyle,
      ]}
    >
      <Pressable
        style={[
          styles.actionCard,
          {
            backgroundColor: colors[0],
          },
        ]}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.97, {
            duration: 100,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 100,
          });
        }}
      >
        <View
          style={[
            styles.actionGlow,
            {
              backgroundColor: colors[1],
            },
          ]}
        />

        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color="#F0C65A"
          />
        </View>

        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>
            {title}
          </Text>

          <Text style={styles.actionSubtitle}>
            {subtitle}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="rgba(255,255,255,0.32)"
        />
      </Pressable>
    </Animated.View>
  );
}

export default function GameRoomsScreen() {
  return (
    <SafeAreaProvider>
      <GameRoomsContent />
    </SafeAreaProvider>
  );
}

function GameRoomsContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [joinVisible, setJoinVisible] =
    useState(false);

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ImageBackground
        source={require("@/assets/images/games/spy/backgrounds/dots_martix.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
        {/* =========================
            HEADER
        ========================= */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={21}
              color="#D9D9D9"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Game Rooms
            </Text>

            <Text style={styles.headerSubtitle}>
              Play together
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* =========================
            CREATE / SEARCH
        ========================= */}

        <View style={styles.actionsRow}>
          <ActionCard
            icon="plus"
            title="Create"
            subtitle="Start a room"
            colors={[
              "rgba(61,46,12,0.72)",
              "rgba(242,169,0,0.16)",
            ]}
            onPress={() => {
              router.push("/games/spy/create");
            }}
          />

          <ActionCard
            icon="magnify"
            title="Search"
            subtitle="Join by ID"
            colors={[
              "rgba(30,25,18,0.72)",
              "rgba(205,145,45,0.13)",
            ]}
          onPress={() => {
  setJoinVisible(true);
}}
          />
        </View>

        {/* =========================
            LIVE GAMES
        ========================= */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Live Games
              </Text>

              <Text style={styles.sectionSubtitle}>
                Rooms currently looking for players
              </Text>
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>
          </View>

          {/* EMPTY STATE */}

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="gamepad-variant-outline"
                size={29}
                color="#A98235"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No live games
            </Text>

            <Text style={styles.emptyText}>
              There are no public rooms available
              right now.
            </Text>
          </View>
        </View>

        <JoinRoomModal
  visible={joinVisible}
  onClose={() => setJoinVisible(false)}
/>
                </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  /* =========================
     ROOT
  ========================= */

    safeArea: {
    flex: 1,

    backgroundColor: "#030303",
  },

  background: {
    flex: 1,

    width: "100%",
    height: "100%",
  },

   container: {
    flex: 1,

    backgroundColor: "transparent",

    paddingHorizontal: 18,
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    height: 64,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.045)",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.07)",
  },

  headerCenter: {
    flex: 1,

    marginLeft: 13,
  },

  headerTitle: {
    color: "#E7D6A4",

    fontSize: 22,

    fontWeight: "900",

    letterSpacing: -0.4,

    includeFontPadding: false,
  },

  headerSubtitle: {
    marginTop: 2,

    color: "rgba(255,255,255,0.38)",

    fontSize: 9,

    fontWeight: "600",

    letterSpacing: 0.2,
  },

  headerSpacer: {
    width: 40,
  },

  /* =========================
     ACTIONS
  ========================= */

  actionsRow: {
    flexDirection: "row",

    gap: 12,

    marginTop: 14,
  },

  actionWrapper: {
    flex: 1,
  },

  actionCard: {
    height: 78,

    borderRadius: 17,

    paddingHorizontal: 10,

    flexDirection: "row",

    alignItems: "center",

    position: "relative",

    overflow: "hidden",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.09)",

    shadowColor: "#000",

    shadowOpacity: 0.4,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  actionGlow: {
    position: "absolute",

    width: 75,
    height: 75,

    borderRadius: 40,

    right: -35,
    top: -35,

    opacity: 0.45,
  },

  iconBox: {
    width: 39,
    height: 39,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(242,169,0,0.10)",

    borderWidth: 0.8,

    borderColor:
      "rgba(242,169,0,0.18)",
  },

  actionText: {
    flex: 1,

    marginLeft: 9,
  },

  actionTitle: {
    color: "#E8D7A7",

    fontSize: 13,

    fontWeight: "900",

    includeFontPadding: false,
  },

  actionSubtitle: {
    marginTop: 3,

    color: "rgba(255,255,255,0.38)",

    fontSize: 8.5,

    fontWeight: "600",

    includeFontPadding: false,
  },

  /* =========================
     LIVE GAMES
  ========================= */

  section: {
    marginTop: 30,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#DCCB9D",

    fontSize: 17,

    fontWeight: "900",

    letterSpacing: -0.2,

    includeFontPadding: false,
  },

  sectionSubtitle: {
    marginTop: 4,

    color: "rgba(255,255,255,0.32)",

    fontSize: 9,

    fontWeight: "600",

    includeFontPadding: false,
  },

  liveBadge: {
    height: 22,

    paddingHorizontal: 8,

    borderRadius: 8,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.035)",

    borderWidth: 0.7,

    borderColor:
      "rgba(255,255,255,0.07)",
  },

  liveDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: "#B89A4A",

    marginRight: 5,
  },

  liveText: {
    color: "#A9925B",

    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 0.7,
  },

  /* =========================
     EMPTY STATE
  ========================= */

  emptyState: {
    marginTop: 16,

    minHeight: 190,

    borderRadius: 18,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      "rgba(10,10,12,0.48)",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.065)",
  },

  emptyIcon: {
    width: 58,
    height: 58,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(242,169,0,0.055)",

    borderWidth: 0.8,

    borderColor:
      "rgba(242,169,0,0.10)",
  },

  emptyTitle: {
    marginTop: 12,

    color: "#C9BC98",

    fontSize: 12,

    fontWeight: "900",

    includeFontPadding: false,
  },

  emptyText: {
    marginTop: 5,

    maxWidth: 210,

    color: "rgba(255,255,255,0.30)",

    fontSize: 9,

    fontWeight: "600",

    textAlign: "center",

    lineHeight: 14,
  },
});