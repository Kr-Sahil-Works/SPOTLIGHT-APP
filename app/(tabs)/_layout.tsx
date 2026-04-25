import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React, { memo, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* 🔥 ICON MAP */
const iconMap: any = {
  index: ["home", "home-outline"],
  bookmarks: ["bookmark", "bookmark-outline"],
  create: ["add-circle", "add-circle"],
  chats: ["chatbubbles", "chatbubbles-outline"],
  profile: ["person", "person-outline"],
};

function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

if (!isLoaded) {
  return <View style={{ flex: 1, backgroundColor: "#000" }} />;
}
  
if (!isSignedIn) return null;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: "#000" },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",

        /* 🔥 TAB STYLE */
        tabBarStyle: {
          position: "absolute",
          height: 60,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },

        /* 🔥 EVEN DISTRIBUTION */
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },

        /* 🔥 BLUR BACKGROUND */
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "ios" ? 80 : 40}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.25)",
              borderTopWidth: 0.5,
              borderTopColor: "rgba(255,255,255,0.08)",
            }}
          />
        ),

        /* 🔥 SIMPLE ICON */
        tabBarIcon: ({ size, color, focused }) => (
          <TabIcon
            name={route.name}
            size={size}
            color={color}
            focused={focused}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="bookmarks" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

/* 🔥 CLEAN ICON (NO GLOW) */
const TabIcon = memo(function TabIcon({
  name,
  size,
  color,
  focused,
}: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05, // very subtle
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={focused ? iconMap[name][0] : iconMap[name][1]}
          size={name === "create" ? size + 4 : size}
          color={focused ? COLORS.primary : color}
          onPressIn={handlePressIn}
        />
      </Animated.View>

      {/* 🔥 SUBTLE DOT */}
      {focused && (
        <View
          style={{
            marginTop: 3,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.primary,
            opacity: 0.7,
          }}
        />
      )}
    </View>
  );
});

export default memo(TabsLayout);