import React, {
    PropsWithChildren,
} from "react";

import {
    StyleSheet,
    View,
} from "react-native";

import {
    BlurView,
} from "expo-blur";

type GamePhaseOverlayProps =
  PropsWithChildren<{
    visible: boolean;
  }>;

export default function GamePhaseOverlay({
  visible,
  children,
}: GamePhaseOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={
        StyleSheet.absoluteFill
      }
      pointerEvents="box-none"
    >
      <BlurView
        intensity={22}
        tint="dark"
        style={
          StyleSheet.absoluteFill
        }
      />

      <View
        style={
          styles.darkLayer
        }
      />

      <View
        style={styles.content}
      >
        {children}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    darkLayer: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.62)",
    },

    content: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal: 24,
    },
  });