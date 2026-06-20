import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";


const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!
);

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
          getToken: auth.getToken,
        };
      }}
    >
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ConvexProviderWithClerk>
  </ClerkProvider>
);
}