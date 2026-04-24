import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView
            edges={["top", "left", "right"]}
            style={{ flex: 1, backgroundColor: "#000" }}
            onLayout={onLayoutRootView}
          >
            {/* <PushHandler /> ✅ SAFE PLACE */}
            <Stack
  screenOptions={{
    headerShown: false,
    animation: "fade",          // ✅ smooth + fast
    animationDuration: 180,     // ⚡ no lag
    gestureEnabled: true,       // ✅ swipe back smooth
  }}
/>
          </SafeAreaView>
        </SafeAreaProvider>
      </ClerkAndConvexProvider>
    </GestureHandlerRootView>
  );
}