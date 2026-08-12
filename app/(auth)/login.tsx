import LoginUI from "@/features/auth/components/LoginUI";
import useGoogleLogin from "@/features/auth/hooks/useGoogleLogin";
import useNetwork from "@/hooks/useNetwork";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();

  const isOnline = useNetwork();

  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const {
    signInWithGoogle,
  } = useGoogleLogin();

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [
    isLoaded,
    isSignedIn,
    router,
  ]);

  const handleGooglePress =
    async () => {
      if (loading) {
        return;
      }

      if (!isOnline) {
        return;
      }

      if (isSignedIn) {
        router.replace("/(tabs)");
        return;
      }

      setLoading(true);

      try {
        const result =
          await signInWithGoogle();

        if (result.success) {
          return;
        }

        if (result.cancelled) {
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Login controller error:",
          error
        );

        setLoading(false);
      }
    };

  return (
    <LoginUI
      loading={loading}
      isOnline={isOnline}
      isSignedIn={!!isSignedIn}
      onGooglePress={
        handleGooglePress
      }
    />
  );
}
