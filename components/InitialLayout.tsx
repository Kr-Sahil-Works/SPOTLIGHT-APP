import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {

  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {

    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }

  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}