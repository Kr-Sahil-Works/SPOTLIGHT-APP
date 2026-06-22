import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import {
  AppToastProvider,
} from "@/components/common/AppToast";
import useNetwork from "@/hooks/useNetwork";

import { api } from "@/convex/_generated/api";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import OfflineBanner from "@/components/common/OfflineBanner";
import PushHandler from "@/components/PushHandler";
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
        if (
          !isLoaded ||
          !isSignedIn ||
          AppState.currentState !==
            "active"
        ) {
          return;
        }

        setOnline({
          isOnline: true,
        }).catch(() => {});
      }, 60000);

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
function AppContent() {
  const isOnline =
    useNetwork();

  const { user } =
    useUser();

  const {
    isSignedIn,
  } = useAuth();

  const createUser =
    useMutation(
      api.users.index
        .createOrUpdateUser
    );

  const currentUser =
    useQuery(
      api.users.index
        .getCurrentUser
    );

  useEffect(() => {
    if (
      !user ||
      !isSignedIn
    )
      return;

    createUser({
      clerkId: user.id,
      email:
        user
          .primaryEmailAddress
          ?.emailAddress || "",
      fullname:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "User",
      image:
        user.imageUrl || "",
    });
  }, [
    user?.id,
    isSignedIn,
  ]);

 return (
  <OnlineWrapper>
  <>
  {isSignedIn && (
    <PushHandler />
  )}

  {!isOnline && (
    <OfflineBanner />
  )}

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
</>
  </OnlineWrapper>
);
}

/* =========================
   ✅ ROOT
========================= */
export default function RootLayout() {
  const [fontsLoaded] =
    useFonts({
      "JetBrainsMono-Medium":
        require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

if (!fontsLoaded) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    />
  );
}

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <ClerkAndConvexProvider>
        <AppToastProvider>
          <SafeAreaProvider>
            <SafeAreaView
              edges={[
                "top",
                "left",
                "right",
              ]}
              style={{
                flex: 1,
                backgroundColor:
                  "#000",
              }}
            >
              <AppContent />
            </SafeAreaView>
          </SafeAreaProvider>
        </AppToastProvider>
      </ClerkAndConvexProvider>
    </GestureHandlerRootView>
  );
}