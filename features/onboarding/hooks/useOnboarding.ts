import { storage } from "@/lib/mmkv";

const ONBOARDING_KEY = "onboarding_completed";

export function useOnboarding() {
  const hasCompletedOnboarding =
    storage.getBoolean(ONBOARDING_KEY) === true;

  const completeOnboarding = () => {
    storage.set(ONBOARDING_KEY, true);
  };

  const resetOnboarding = () => {
    storage.remove(ONBOARDING_KEY);
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}