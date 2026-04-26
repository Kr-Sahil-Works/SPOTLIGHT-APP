import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function ChatSkeleton() {
  const shimmer = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: width,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const Bubble = ({ align }: { align: "left" | "right" }) => (
    <View
      style={{
        alignSelf: align === "left" ? "flex-start" : "flex-end",
        marginVertical: 8,
        maxWidth: "75%",
      }}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={{
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 20,
            width: Math.random() * 120 + 80,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          {/* 🔥 SHIMMER */}
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              transform: [{ translateX: shimmer }],
            }}
          >
            <LinearGradient
              colors={[
                "transparent",
                "rgba(255,255,255,0.12)",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 120, height: "100%" }}
            />
          </Animated.View>
        </View>
      </BlurView>
    </View>
  );

  return (
    <View style={{ padding: 14 }}>
      {[...Array(12)].map((_, i) => (
        <View key={i}>
          <Bubble align={i % 2 === 0 ? "left" : "right"} />
          <Bubble align={i % 2 === 0 ? "left" : "right"} />
        </View>
      ))}
    </View>
  );
}