import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            "#000",
        }}
      />
    );
  }

  return isSignedIn ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect
      href="/(auth)/login"
    />
  );
}