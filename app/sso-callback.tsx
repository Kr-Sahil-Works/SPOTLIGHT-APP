import GreenLoader from "@/components/loaders/GreenLoader";
import { useAuth } from "@clerk/clerk-expo";
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

  return (
    <Redirect href="/" />
  );
}