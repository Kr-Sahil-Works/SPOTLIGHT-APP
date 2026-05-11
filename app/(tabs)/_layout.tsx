import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Haptics from "expo-haptics";
import { Redirect } from "expo-router";
import React, { memo, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;

const iconMap: Record<
  string,
  [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]
> = {
  index: ["home", "home-outline"],
  bookmarks: ["bookmark", "bookmark-outline"],
  create: ["add-circle", "add-circle"],
  chats: ["chatbubble", "chatbubble-outline"], 
  profile: ["person", "person-outline"],
};

function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const insets = useSafeAreaInsets();

  const [swipeEnabled,
    setSwipeEnabled] =
    useState(true);

    if (!isLoaded) {
  return null;
}

if (!isSignedIn) {
  return (
    <Redirect
      href="/(auth)/login"
    />
  );
}

return (
  <>
    <Tab.Navigator
      initialRouteName="index"
      screenOptions={{
       swipeEnabled,
    animationEnabled: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
<Tab.Screen name="index">
  {() => {
    const Screen = require("./index").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>

<Tab.Screen name="bookmarks">
  {() => {
    const Screen = require("./bookmarks").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>

<Tab.Screen name="create">
  {() => {
    const Screen = require("./create").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>

<Tab.Screen name="chats">
  {() => {
    const Screen = require("./chats").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>

<Tab.Screen name="profile">
  {() => {
    const Screen = require("./profile").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>
    </Tab.Navigator>
  </>
);
}

/* 🔥 CLEAN ICON */
const TabIcon = memo(function TabIcon({
  name,
  size,
  color,
  focused,
}: {
  name: string;
  size: number;
  color: string;
  focused: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05,
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

  /* ✅ SAFE ICON ACCESS */
  const icons =
    iconMap[name] || ["ellipse", "ellipse-outline"];

  const iconName = focused ? icons[0] : icons[1];

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={iconName}
          size={name === "create" ? size + 4 : size}
          color={focused ? COLORS.primary : color}
          onPressIn={handlePressIn}
        />
      </Animated.View>

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

import { BlurView } from "expo-blur";
import { Platform } from "react-native";

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
     style={{
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  elevation: 999, // Android
}}
    >
      {/* 🔥 BLUR BACKGROUND */}
      <BlurView
        intensity={Platform.OS === "ios" ? 100 : 70}
        tint="dark"
        style={{
          flexDirection: "row",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(0,0,0,0.15)",
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
  navigation.jumpTo(route.name);
}}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.8}
            >
              <TabIcon
                name={route.name}
                size={24}
                color="rgba(255,255,255,0.5)"
                focused={isFocused}
              />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

export default memo(TabsLayout);