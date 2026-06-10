import React, {
  useState,
} from "react";
import {
  Text,
  View,
} from "react-native";

import {
  TouchableOpacity,
} from "react-native";

import OfflineInfoModal from "../modals/OfflineInfoModal";

export default function OfflineBanner() {
 const [showInfo, setShowInfo] =
  useState(false);

return (
  <>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        setShowInfo(true)
      }
    >
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
        <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  }}
>
  <Text
    style={{
      color: "#f5f5f5",
      fontWeight: "800",
      fontSize: 13,
    }}
  >
    You're offline   : (
  </Text>
</View>
      </View>
    </TouchableOpacity>

    <OfflineInfoModal
      visible={showInfo}
      onClose={() =>
        setShowInfo(false)
      }
    />
  </>
);
}