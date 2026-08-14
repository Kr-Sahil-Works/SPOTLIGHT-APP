import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";

export default function Index() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const {
    hasCompletedOnboarding,
  } = useOnboarding();

  if (!isLoaded) {
    return null;
  }

  // Existing authenticated flow.
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // First-time user.
if (__DEV__) {
  return <Redirect href="/onboarding" />;
}

if (!hasCompletedOnboarding) {
  return <Redirect href="/onboarding" />;
}

}