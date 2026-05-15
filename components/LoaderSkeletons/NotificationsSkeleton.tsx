import { COLORS } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function NotificationsSkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 400],
  });

  const Shimmer = () => (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "rgba(255,255,255,0.03)",
          transform: [{ translateX }],
        },
      ]}
    />
  );

return (
  <View style={{ flex: 1, backgroundColor: "#000" }}>
    
    {/* HEADER SKELETON */}
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
      }}
    >
      <View
        style={{
          height: 18,
          width: 140,
          borderRadius: 6,
          backgroundColor: COLORS.surface,
          overflow: "hidden",
        }}
      >
        <Shimmer />
      </View>

      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          backgroundColor: COLORS.surface,
          overflow: "hidden",
        }}
      >
        <Shimmer />
      </View>
    </View>

    <View style={{ padding: 12 }}>
      {[...Array(14)].map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14,
            padding: 12,
            borderRadius: 16,
            backgroundColor: "#0a0a0a",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: COLORS.surface,
              overflow: "hidden",
            }}
          >
            <Shimmer />
          </View>

          {/* Text */}
          <View style={{ marginLeft: 12, flex: 1 }}>
            <View
              style={{
                height: 12,
                width: "55%",
                backgroundColor: COLORS.surface,
                borderRadius: 6,
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>

            <View
              style={{
                height: 10,
                width: "75%",
                backgroundColor: COLORS.surface,
                borderRadius: 6,
                marginBottom: 6,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>

            <View
              style={{
                height: 8,
                width: "30%",
                backgroundColor: COLORS.surface,
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>
          </View>

          {/* Right thumbnail */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: COLORS.surface,
              overflow: "hidden",
              marginLeft: 10,
            }}
          >
            <Shimmer />
          </View>
        </View>
      ))}
    </View>
    </View>
  );
}