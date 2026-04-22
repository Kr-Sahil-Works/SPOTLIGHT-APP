import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Redirect, Tabs } from "expo-router";
import { useRef } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: "#000" },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#777",

        // ✅ CLEAN TAB STYLE
        tabBarStyle: {
          position: "absolute",
          height: 60,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingTop: 6,
          borderTopWidth: 0,
          backgroundColor: "rgba(15,15,15,0.5)",
        },

        // ✅ EVEN DISTRIBUTION (no hacks)
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },

        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView" // 👈 ADD THIS
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.2)",
              borderTopWidth: 0.5,
              borderTopColor: "rgba(255,255,255,0.12)",
            }}
          />
        ),

        // ✅ CLEAN ICON (no scale hacks)
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

/* 🔥 ICON */
function TabIcon({ name, size, color, focused }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const iconMap: any = {
    index: focused ? "home" : "home-outline",
    bookmarks: focused ? "bookmark" : "bookmark-outline",
    create: "add-circle",
    chats: focused ? "chatbubbles" : "chatbubbles-outline",
    profile: focused ? "person" : "person-outline",
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const glowStyle = {
    shadowColor: COLORS.primary,
    shadowOpacity: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
    }),
    shadowRadius: 8,
    elevation: 6,
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
        <Ionicons
          name={iconMap[name]}
          size={name === "create" ? size + 4 : size}
          color={focused ? COLORS.primary : color}
          onPressIn={handlePressIn}
        />
      </Animated.View>

      {focused && (
        <View
          style={{
            marginTop: 3,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.primary,
          }}
        />
      )}
    </View>
  );
}