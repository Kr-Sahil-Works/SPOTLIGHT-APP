import { COLORS } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function FeedSkeleton() {
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
    outputRange: [-400, 400],
  });

  const Shimmer = () => (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "rgba(255,255,255,0.05)",
          transform: [{ translateX }],
        },
      ]}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      {/* HEADER */}
      <View
        style={{
          height: 70,
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 120,
            height: 20,
            borderRadius: 6,
            backgroundColor: COLORS.surface,
            overflow: "hidden",
          }}
        >
          <Shimmer />
        </View>
      </View>

      {/* STORIES */}
      <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ alignItems: "center", marginRight: 14 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: COLORS.surface,
                marginBottom: 6,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>

            <View
              style={{
                width: 40,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.surface,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>
          </View>
        ))}
      </View>

      {/* POSTS */}
      <View style={{ padding: 12 }}>
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            style={{
              marginBottom: 20,
              borderRadius: 16,
              backgroundColor: "#0a0a0a",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
              padding: 10,
            }}
          >
            {/* POST HEADER */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: COLORS.surface,
                  overflow: "hidden",
                }}
              >
                <Shimmer />
              </View>

              <View
                style={{
                  width: 80,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: COLORS.surface,
                  marginLeft: 10,
                  overflow: "hidden",
                }}
              >
                <Shimmer />
              </View>
            </View>

            {/* IMAGE */}
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 12,
                backgroundColor: COLORS.surface,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <Shimmer />
            </View>

            {/* ACTIONS */}
            <View style={{ flexDirection: "row", gap: 14, marginBottom: 8 }}>
              {[...Array(3)].map((_, j) => (
                <View
                  key={j}
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
              ))}
            </View>

            {/* TEXT */}
            <View
              style={{
                width: "40%",
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.surface,
                marginBottom: 6,
                overflow: "hidden",
              }}
            >
              <Shimmer />
            </View>

            <View
              style={{
                width: "70%",
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.surface,
                overflow: "hidden",
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