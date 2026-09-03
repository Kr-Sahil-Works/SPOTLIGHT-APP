import React, {
  useState,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";
import OfflineInfoModal from "../modals/OfflineInfoModal";

export default function OfflineBanner() {
  const [showInfo, setShowInfo] =
    useState(false);

return (
  <>
    <SafeAreaView
      style={{
        backgroundColor: "#830014",
      }}
      edges={["left", "right","top"]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          setShowInfo(true)
        }
      >
        <View
          style={{
            backgroundColor: "#830014",
            paddingVertical: 7,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#00000020",
          }}
        >
          <Text
            style={{
              color: "#f5f5f5",
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            You're offline : (
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>

    <OfflineInfoModal
      visible={showInfo}
      onClose={() =>
        setShowInfo(false)
      }
    />
  </>
);
}