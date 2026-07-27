import { Text, View } from "react-native";

export default function MilesHeader() {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 30,
          fontWeight: "800",
        }}
      >
        Miles
      </Text>

      <Text
        style={{
          color: "rgba(255,255,255,0.55)",
          marginTop: 4,
          fontSize: 15,
        }}
      >
        Your shared journey together.
      </Text>
    </View>
  );
}