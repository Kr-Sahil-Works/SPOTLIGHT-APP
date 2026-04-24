import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ReactNode } from "react";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!
);

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env"
  );
}

export default function ClerkAndConvexProvider({
  children,
}: {
  children: ReactNode;
}) {
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

            // ✅ FIXED: removed template
            getToken: auth.getToken,
          };
        }}
      >
        <ClerkLoaded>{children}</ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}