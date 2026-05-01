import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect } from "react";

import PushHandler from "@/components/PushHandler";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { AppState, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

/* =========================
   ✅ ONLINE WRAPPER
========================= */
function OnlineWrapper({ children }: any) {
  const setOnline = useMutation(
    api.messages.index.setOnlineStatus
  );
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

  const handleState = (state: string) => {
  try {
    if (isSignedIn) {
      setOnline({ isOnline: state === "active" });
    }
  } catch {}
};

    const sub = AppState.addEventListener("change", handleState);

    // initial state
    handleState(AppState.currentState);

    return () => {
      sub.remove();
      if (isSignedIn) {
        setOnline({ isOnline: false });
      }
    };
  }, [isLoaded, isSignedIn, setOnline]);

  return children;
}

/* =========================
   ✅ APP CONTENT
========================= */
function AppContent({ onLayoutRootView }: any) {
const { user } = useUser();
const createUser = useMutation(api.users.index.createUser);
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
useEffect(() => {
  if (!isSignedIn || !user) return;

  createUser({
    username: user.primaryEmailAddress?.emailAddress.split("@")[0] || "user",
    fullname: user.fullName || "User",
    email: user.primaryEmailAddress?.emailAddress || "",
    image: user.imageUrl || "",
    clerkId: user.id,
  }).catch(() => {});
}, [isSignedIn, user]);
  return (
    <OnlineWrapper>
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{ flex: 1, backgroundColor: "#000" }}
          onLayout={onLayoutRootView}
        >
          {isSignedIn && <PushHandler />}

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
  );
}

/* =========================
   ✅ ROOT
========================= */
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
        <AppContent onLayoutRootView={onLayoutRootView} />
      </ClerkAndConvexProvider>
    </GestureHandlerRootView>
  );
}