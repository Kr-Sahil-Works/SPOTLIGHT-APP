import { COLORS } from "@/constants/theme";
import {
  triggerFeedRefresh,
} from "@/lib/feedRefresh";
import {
  useAuth
} from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Platform, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/convex/_generated/api";
import useChatListTheme from "@/hooks/useChatListTheme";
import { getProfileImage, saveProfileImage } from "@/lib/cache/profileImageCache";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";


const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;
const isTablet =
  screenWidth >= 768;


const iconMap: Record<
  string,
  [
    keyof typeof Ionicons.glyphMap,
    keyof typeof Ionicons.glyphMap
  ]
> = {
  index: [
    "home",
    "home-outline",
  ],

  bookmarks: [
    "bookmark",
    "bookmark-outline",
  ],

  create: [
    "add-circle",
    "add-circle-outline",
  ],

chats: [
  "chatbubble-ellipses",
  "chatbubble-ellipses-outline",
],

  profile: [
    "person",
    "person-outline",
  ],
};

function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const currentUser = useQuery(
  api.users.index.getCurrentUser
);

  const insets = useSafeAreaInsets();

useEffect(() => {
  if (
    currentUser?.image
  ) {
    saveProfileImage(
      currentUser.image
    );
  }
}, [currentUser?.image]);

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

<Tab.Screen name="chats">
  {() => {
    const Screen = require("./chats").default;
    return <Screen setSwipeEnabled={setSwipeEnabled} />;
  }}
</Tab.Screen>

<Tab.Screen name="create">
  {() => {
    const Screen = require("./create").default;
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
  profileImage,
}: {
  name: string;
  size: number;
  color: string;
  focused: boolean;
  profileImage?: string;
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const handlePressIn = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

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
if (name === "profile") {
  if (!profileImage) {
    return (
      <Ionicons
        name={
          focused
            ? "person"
            : "person-outline"
        }
        size={24}
       color={
  focused
    ? color
    : "rgba(255,255,255,0.5)"
}
      />
    );
  }

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale,
          },
        ],
      }}
    >
      <Image
        source={{
          uri: profileImage,
        }}
        cachePolicy="memory-disk"
        transition={120}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          borderWidth: focused
            ? 2
            : 0,
          borderColor: "#ffffff",
        }}
      />
    </Animated.View>
  );
}

  const icons =
    iconMap[name] || [
      "ellipse",
      "ellipse-outline",
    ];

  const iconName = focused
    ? icons[0]
    : icons[1];

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [
            {
              scale,
            },
          ],
        }}
      >
     <Ionicons
  name={iconName}
  size={
    name === "create"
      ? size + 4
      : size
  }
  color={
    focused
      ? color
      : "rgba(255,255,255,0.5)"
  }
 style={
  name === "chats"
    ? {
        transform: [
          {
  translateY: -1,
},
          {
            scale: 1.08,
          },
        ],
      }
    : undefined
}
  onPressIn={
    handlePressIn
  }
/>
      </Animated.View>
    </View>
  );
});


function CustomTabBar({ state, navigation }: any) {

const chatTheme =
  useChatListTheme();

  const currentUser = useQuery(
  api.users.index.getCurrentUser
);
const cachedProfileImage =
  getProfileImage();

  const insets = useSafeAreaInsets();

  return (
    <View
style={{
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,

  ...(isTablet && {
    maxWidth: 700,
    alignSelf: "center",
  }),

  zIndex: 999,
  elevation: 999,
}}
    >
      {/* 🔥 BLUR BACKGROUND */}
      <BlurView
        intensity={Platform.OS === "ios" ? 100 : 70}
        tint="dark"
        style={{
          flexDirection: "row",
          height:
  isTablet
    ? 70 + Math.max(insets.bottom, 10)
    : 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(0,0,0,0.15)",

          ...(isTablet && {
  marginHorizontal: 12,
  marginBottom: 8,
  borderRadius: 24,
  overflow: "hidden",
}),
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
        onPress={() => {
  const isFocused =
    state.index === index;

  if (
    isFocused &&
    route.name ===
      "index"
  ) {
    Haptics.impactAsync(
      Haptics
        .ImpactFeedbackStyle
        .Medium
    );

    triggerFeedRefresh();

    return;
  }

  navigation.jumpTo(
    route.name
  );
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
  color={
    route.name === "chats" &&
    isFocused
      ? chatTheme.glow ??
        chatTheme.headerColor ??
        COLORS.primary
      : "rgba(255,255,255,0.5)"
  }
  focused={isFocused}
  profileImage={
    currentUser?.image ??
    cachedProfileImage
  }
/>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

export default memo(TabsLayout);