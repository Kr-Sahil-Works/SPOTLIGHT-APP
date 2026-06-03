import React from "react";
import {
  Text,
  View,
} from "react-native";

export default function OfflineBanner() {
  return (
    <View
      style={{
        backgroundColor:
          "#830014",

        paddingVertical: 7,

        alignItems:
          "center",

        justifyContent:
          "center",

        borderBottomWidth: 1,

        borderBottomColor:
          "#00000020",
      }}
    >
      <Text
        style={{
          color: "#f5f5f5",

          fontWeight: "800",

          fontSize: 13,
        }}
      >
        You're offline •
      </Text>
    </View>
  );
}