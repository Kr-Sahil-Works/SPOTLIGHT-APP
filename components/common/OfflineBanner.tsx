import React from "react";
import { Text, View } from "react-native";

export default function OfflineBanner() {
  return (
    <View
      style={{
        backgroundColor:
          "#00ff88",
        paddingVertical: 6,
        alignItems:
          "center",
      }}
    >
      <Text
        style={{
          color: "#000",
          fontWeight:
            "700",
        }}
      >
        Offline Mode
      </Text>
    </View>
  );
}