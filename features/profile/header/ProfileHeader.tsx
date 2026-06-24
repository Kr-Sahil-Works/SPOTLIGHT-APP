import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader({
  username,
  showSecure,
  setShowSecure,
  pressScale,
  tickScale,
  secureAnim,
  particleScale,
  particleOpacity,
  menuAnim,
  menuOpen,
  setMenuOpen,
  router,
}: any)  {
  return (
    <View
      style={[
        styles.header,
        {
          zIndex: 100,
          elevation: 100,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
 {/* 🔒 LOCK */}
<TouchableOpacity
  disabled={showSecure}
  activeOpacity={0.6}
onPress={() => {
  if (showSecure) return;

  setShowSecure(true);

  tickScale.setValue(0);

  secureAnim.setValue(0);

  particleScale.setValue(0.2);
  particleOpacity.setValue(0);

  Animated.parallel([
 Animated.timing(tickScale, {
  toValue: 1,
  duration: 650,
  useNativeDriver: true,
}),

    Animated.timing(secureAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),

    Animated.sequence([
      Animated.delay(700),

      Animated.parallel([
        Animated.spring(
          particleScale,
          {
            toValue: 1.8,
            tension: 45,
            friction: 10,
            useNativeDriver: true,
          }
        ),

        Animated.sequence([
          Animated.timing(
            particleOpacity,
            {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            particleOpacity,
            {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }
          ),
        ]),
      ]),
    ]),
  ]).start();

  setTimeout(() => {
    Animated.timing(
      secureAnim,
      {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }
    ).start(() =>
      setShowSecure(false)
    );
  }, 2400);
}}
  onPressIn={() => {
    Animated.spring(pressScale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }}
  onPressOut={() => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }}
  style={{
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000000f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  }}
>
  <Animated.View
    style={{
      transform: [{ scale: pressScale }],
    }}
  >
    <Ionicons
      name="lock-closed-outline"
      size={20}
      color="#22c55e"
    />
  </Animated.View>
</TouchableOpacity>

      {/* 👤 USERNAME */}
      <Text
        pointerEvents="none"
        style={[
          styles.username,
          {
            position: "absolute",
            left: 60,
            right: 60,
            textAlign: "center",
          },
        ]}
      >
        @{username}
      </Text>

      {/* ☰ MENU */}
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => {
          if (menuOpen) return;

          setMenuOpen(true);

          Animated.spring(menuAnim, {
            toValue: 1,
            tension: 300,
            useNativeDriver: true,
          }).start();

          setTimeout(() => {
            router.push("/settings");
          }, 140);
        }}
      >
        <View style={{ width: 18, height: 20, justifyContent: "center" }}>
          {/* TOP */}
          <Animated.View
            style={{
              position: "absolute",
              width: 16,
              height: 2,
              backgroundColor: "#22c55e",
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-5, 0],
                  }),
                },
                {
                  rotate: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            }}
          />

          {/* MIDDLE */}
          <Animated.View
            style={{
           width: 16,
              height: 2,
              backgroundColor: "#22c55e",
              opacity: menuAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          />

          {/* BOTTOM */}
          <Animated.View
            style={{
              position: "absolute",
           width: 16,
              height: 2,
              backgroundColor: "#22c55e",
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [5, 0],
                  }),
                },
                {
                  rotate: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-45deg"],
                  }),
                },
              ],
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}