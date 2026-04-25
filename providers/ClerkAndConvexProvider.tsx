import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ReactNode } from "react";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// ✅ Read env safely
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// ✅ Debug logs (will show in release logs too)
if (!convexUrl) {
  console.log("❌ Missing EXPO_PUBLIC_CONVEX_URL");
}

if (!publishableKey) {
  console.log("❌ Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

// ✅ Create client safely
const convex = convexUrl
  ? new ConvexReactClient(convexUrl)
  : null;

export default function ClerkAndConvexProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ❌ Prevent crash if env missing
  if (!convex || !publishableKey) {
    return null; // or show loading screen if you want
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