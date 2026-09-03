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

type ClassicGameOverlayProps =
  PropsWithChildren<{
    visible?: boolean;
    blurIntensity?: number;
  }>;

export default function ClassicGameOverlay({
  children,
  visible = true,
  blurIntensity = 18,
}: ClassicGameOverlayProps) {
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
      {/* Background blur */}
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={
          StyleSheet.absoluteFill
        }
      />

      {/* Extra darkness */}
      <View
        pointerEvents="none"
        style={
          styles.darkOverlay
        }
      />

      {/* Gameplay UI */}
      <View
        style={styles.content}
        pointerEvents="box-none"
      >
        {children}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    darkOverlay: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.58)",
    },

    content: {
      flex: 1,
    },
  });