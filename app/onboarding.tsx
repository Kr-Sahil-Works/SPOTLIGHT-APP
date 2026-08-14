import { useRouter } from "expo-router";
import { useState } from "react";

import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";

import OnboardingFeatures from "@/features/onboarding/screens/OnboardingFeatures";
import OnboardingGames from "@/features/onboarding/screens/OnboardingGames";
import OnboardingWelcome from "@/features/onboarding/screens/OnboardingWelcome";

export default function OnboardingRoute() {
  const router = useRouter();

  const { completeOnboarding } = useOnboarding();

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    completeOnboarding();

    router.replace("/(auth)/login");
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((current) => current - 1);
    }
  };

  if (step === 0) {
    return (
      <OnboardingWelcome
        onNext={handleNext}
      />
    );
  }

  if (step === 1) {
    return (
      <OnboardingFeatures
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  }

  return (
    <OnboardingGames
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}