import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect } from "react";

import PushHandler from "@/components/PushHandler";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { AppState, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

/* =========================
   ✅ ONLINE WRAPPER (FIX)
========================= */
function OnlineWrapper({ children }: any) {
  const setOnline = useMutation(api.messages.setOnlineStatus);

useEffect(() => {
  const handleState = (state: string) => {
    if (state === "active") {
      // 🟢 app open
      setOnline({ isOnline: true });
    } else {
      // 🔴 background / minimized
      setOnline({ isOnline: false });
    }
  };

  const sub = AppState.addEventListener("change", handleState);

  // 🔥 initial state
  handleState(AppState.currentState);

  return () => {
    sub.remove();
  };
}, []);

  return children;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkAndConvexProvider>
        <OnlineWrapper>
          <SafeAreaProvider>
            <SafeAreaView
              edges={["top", "left", "right"]}
              style={{ flex: 1, backgroundColor: "#000" }}
              onLayout={onLayoutRootView}
            >
              {/* 🔔 PUSH HANDLER */}
              <PushHandler />

              {/* 🔥 ROUTER */}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                  animationDuration: 180,
                  gestureEnabled: true,
                }}
              />
            </SafeAreaView>
          </SafeAreaProvider>
        </OnlineWrapper>
      </ClerkAndConvexProvider>
    </GestureHandlerRootView>
  );
}