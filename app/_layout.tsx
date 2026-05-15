import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback, useEffect } from "react";

import PushHandler from "@/components/PushHandler";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
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
function OnlineWrapper({
  children,
}: any) {
  const setOnline =
    useMutation(
      api.messages.index
        .setOnlineStatus
    );

  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn
    )
      return;

const handleState =
  async (state: string) => {
    try {
      if (
        !isLoaded ||
        !isSignedIn
      ) {
        return;
      }

      await setOnline({
        isOnline:
          state === "active",
      });
    } catch {}
  };

    const sub =
      AppState.addEventListener(
        "change",
        handleState
      );

    handleState(
      AppState.currentState
    );
    const interval =
  setInterval(() => {
    setOnline({
      isOnline: true,
    }).catch(() => {});
  }, 30000);

    return () => {

      clearInterval(interval);
      
      sub.remove();

      try {
        if (
          isLoaded &&
          isSignedIn
        ) {
          setOnline({
            isOnline: false,
          }).catch(
            () => {}
          );
        }
      } catch {}
    };
  }, [
    isLoaded,
    isSignedIn,
    setOnline,
  ]);

  return children;
}

/* =========================
   ✅ APP CONTENT
========================= */
function AppContent({ onLayoutRootView }: any) {
  const { user } = useUser();
  const {
  isLoaded,
  isSignedIn,
  signOut,
} = useAuth();

  const createUser = useMutation(
    api.users.index.createOrUpdateUser
  );

  const currentUser = useQuery(
  api.users.index.getCurrentUser
);



useEffect(() => {
  if (!user || !isSignedIn) return;

  createUser({
    clerkId: user.id,
    email: user.primaryEmailAddress?.emailAddress || "",
    fullname:
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "User",
    image: user.imageUrl || "",
  });
}, [user?.id, isSignedIn]);

 

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

  contentStyle: {
    backgroundColor: "#000",
  },
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