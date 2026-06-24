import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Text,
  View,
} from "react-native";

export default function SecureOverlay({
  showSecure,
  secureAnim,
  tickScale,
  particleScale,
  particleOpacity,
}: any) {
  if (!showSecure) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        zIndex: 999999,
        elevation: 999999,

        backgroundColor:
          "rgba(0,0,0,0.72)",

        opacity: secureAnim,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",

          bottom: 110,
          left: 28,
          right: 28,

          paddingVertical: 12,
          paddingHorizontal: 14,

          borderRadius: 22,

          backgroundColor:
            "rgba(18,18,18,0.96)",

          borderWidth: 1,

          borderColor:
            "rgba(34,197,94,0.35)",

          elevation: 12,

          flexDirection: "row",
          alignItems: "center",

          transform: [
            {
              translateY:
                secureAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [80, 0],
                }),
            },
            {
              scale:
                secureAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
            },
          ],

          opacity: secureAnim,
        }}
      >
        {/* PREMIUM VERIFIED ICON */}
        <View
          style={{
            width: 46,
            height: 46,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}
        >
          {/* EXPANDING GREEN RING */}
          <Animated.View
            style={{
              position: "absolute",

              width: 52,
              height: 52,

              borderRadius: 999,

              borderWidth: 2,

              borderColor:
                "rgba(34,197,94,0.75)",

              opacity:
                particleOpacity,

              transform: [
                {
                  scale:
                    particleScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 2.2],
                    }),
                },
              ],
            }}
          />

          {/* PARTICLES */}
          <View
            style={{
              position: "absolute",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map(
              (i) => (
                <Animated.View
                  key={i}
                  style={{
                    position:
                      "absolute",

                    width: 4,
                    height: 4,

                    borderRadius:
                      999,

                    backgroundColor:
                      "#22c55e",

                    opacity:
                      particleOpacity,

                    transform: [
                      {
                        translateX:
                          particleScale.interpolate({
                            inputRange: [
                              0,
                              1,
                            ],
                            outputRange: [
                              0,
                              Math.cos(
                                i *
                                  60 *
                                  Math.PI /
                                  180
                              ) *
                                  28,
                            ],
                          }),
                      },
                      {
                        translateY:
                          particleScale.interpolate({
                            inputRange: [
                              0,
                              1,
                            ],
                            outputRange: [
                              0,
                              Math.sin(
                                i *
                                  60 *
                                  Math.PI /
                                  180
                              ) *
                                  28,
                            ],
                          }),
                      },
                    ],
                  }}
                />
              )
            )}
          </View>

          {/* TICK */}
<Animated.View
  style={{
    opacity: tickScale.interpolate({
      inputRange: [0, 0.15, 1],
      outputRange: [0, 0.5, 1],
    }),

    transform: [
      {
        translateY: tickScale.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
      {
        rotate: tickScale.interpolate({
          inputRange: [0, 1],
          outputRange: ["-55deg", "0deg"],
        }),
      },
      {
        scale: tickScale.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [0.2, 1.45, 1],
        }),
      },
    ],
  }}
>
  <Ionicons
    name="checkmark-circle"
    size={24}
    color="#22c55e"
  />
</Animated.View>
        </View>

        {/* TEXT */}
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#22c55e",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            Verified Account
          </Text>

          <Text
            style={{
              color: "#9ca3af",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            End-to-end encrypted
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}