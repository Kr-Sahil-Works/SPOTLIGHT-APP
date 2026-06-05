import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";

export default function ProfileTabs({
  activeTab,
  switchTab,
  tabLayouts,
  setTabLayouts,
  tabIndex,
}: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 60,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "rgba(255,255,255,0.06)",
        marginTop: 10,
        position: "relative",
      }}
    >
      {/* GRID */}
      <TouchableOpacity
        onPress={() => switchTab(0)}
        onLayout={(e) => {
          const { x, width } = e.nativeEvent.layout;
          setTabLayouts((prev: any) => {
            const copy = [...prev];
            copy[0] = { x, width };
            return copy;
          });
        }}
      >
        <Ionicons
          name="grid-outline"
          size={22}
          color={activeTab === "grid" ? "#fff" : "#555"}
        />
      </TouchableOpacity>

      {/* REELS */}
      <TouchableOpacity
        onPress={() => switchTab(1)}
        onLayout={(e) => {
          const { x, width } = e.nativeEvent.layout;
          setTabLayouts((prev: any) => {
            const copy = [...prev];
            copy[1] = { x, width };
            return copy;
          });
        }}
      >
        <Ionicons
          name="play-outline"
          size={22}
          color={activeTab === "reels" ? "#fff" : "#555"}
        />
      </TouchableOpacity>

      {/* TAGS */}
      <TouchableOpacity
        onPress={() => switchTab(2)}
        onLayout={(e) => {
          const { x, width } = e.nativeEvent.layout;
          setTabLayouts((prev: any) => {
            const copy = [...prev];
            copy[2] = { x, width };
            return copy;
          });
        }}
      >
        <Ionicons
          name="person-outline"
          size={22}
          color={activeTab === "tags" ? "#fff" : "#555"}
        />
      </TouchableOpacity>

      {/* 🔥 UNDERLINE */}
      {tabLayouts.length === 3 && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            height: 2,
            width: 28,
            backgroundColor: "#fff",
            transform: [
              {
                translateX: tabIndex.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: tabLayouts.map(
                    (l: any) => l.x + l.width / 2 - 14
                  ),
                }),
              },
            ],
          }}
        />
      )}
    </View>
  );
}