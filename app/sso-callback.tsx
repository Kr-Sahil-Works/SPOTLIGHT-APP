import GreenLoader from "@/components/loaders/GreenLoader";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function SSOCallback() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GreenLoader />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
