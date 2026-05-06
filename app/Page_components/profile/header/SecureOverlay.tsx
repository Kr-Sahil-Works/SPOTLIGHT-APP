import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Animated, Text, View } from "react-native";

export default function SecureOverlay({
  showSecure,
  secureAnim,
  tickScale,
}: any) {
  if (!showSecure) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.47)",
      }}
    >
      <BlurView intensity={55} tint="dark" style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 90,
            left: 40,
            right: 40,
            padding: 14,
            borderRadius: 16,
            backgroundColor: "rgba(10,10,10,0.85)",
            borderWidth: 1,
            borderColor: "rgba(34,197,94,0.4)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            transform: [
              {
                translateY: secureAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -40],
                }),
              },
            ],
            opacity: secureAnim,
          }}
        >
          <Animated.View style={{ transform: [{ scale: tickScale }] }}>
            <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
          </Animated.View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: "#22c55e", fontWeight: "600" }}>
              Verified Secure
            </Text>
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              End-to-end encrypted
            </Text>
          </View>
        </Animated.View>
      </BlurView>
    </View>
  );
}