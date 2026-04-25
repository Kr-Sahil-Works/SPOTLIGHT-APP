import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ReactNode } from "react";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import Constants from "expo-constants";
import { View, Text } from "react-native";

/* =========================
   ✅ SAFE ENV (APK + DEV)
========================= */
const extra = Constants.expoConfig?.extra;

const convexUrl =
  process.env.EXPO_PUBLIC_CONVEX_URL ||
  extra?.convexUrl;

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  extra?.clerkPublishableKey;

/* =========================
   🔍 DEBUG (CHECK IN APK)
========================= */
console.log("Convex URL:", convexUrl);
console.log("Clerk Key:", publishableKey);

/* =========================
   ✅ CREATE CLIENT
========================= */
const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : null;

/* =========================
   🚀 PROVIDER
========================= */
export default function ClerkAndConvexProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* 🚨 NEVER return null */
  if (!convex || !publishableKey) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Loading app...</Text>
        <Text style={{ color: "red", marginTop: 10 }}>
          Missing ENV variables
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk
        client={convex}
        useAuth={(...args) => {
          const auth = useAuth(...args);
          return {
            ...auth,
            getToken: auth.getToken,
          };
        }}
      >
        <ClerkLoaded>{children}</ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}