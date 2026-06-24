import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function OfflineInfoModal({
  visible,
  onClose,
}: Props) {
  const translateY =
    useRef(
      new Animated.Value(120)
    ).current;

    const pulse =
  useRef(
    new Animated.Value(0)
  ).current;

const ring =
  useRef(
    new Animated.Value(0)
  ).current;

  const wifiBlink =
  useRef(
    new Animated.Value(1)
  ).current;


  const progress =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    if (!visible) return;

    progress.setValue(0);

    Animated.parallel([
      Animated.spring(
        translateY,
        {
          toValue: 0,
          tension: 90,
          friction: 10,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        progress,
        {
          toValue: 100,
          duration: 12000,
          useNativeDriver: false,
        }
      ),
    ]).start();

    Animated.loop(
  Animated.sequence([
    Animated.timing(
      pulse,
      {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }
    ),
    Animated.timing(
      pulse,
      {
        toValue: 0,
        duration: 1400,
        useNativeDriver: true,
      }
    ),
  ])
).start();

Animated.loop(
  Animated.sequence([
    Animated.timing(
      ring,
      {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }
    ),
    Animated.timing(
      ring,
      {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }
    ),
  ])
).start();

Animated.loop(
  Animated.sequence([
    Animated.timing(
      wifiBlink,
      {
        toValue: 0.25,
        duration: 700,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      wifiBlink,
      {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }
    ),
  ])
).start();

    const timer =
      setTimeout(() => {
        onClose();
      }, 12000);

    return () =>
      clearTimeout(timer);
  }, [visible]);

  if (!visible)
    return null;

  return (
    <Pressable
      onPress={onClose}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",

          left: 16,
          right: 16,
          bottom: 24,

          transform: [
            {
              translateY,
            },
          ],

          backgroundColor:
            "#0d0d0d",

          borderRadius: 24,

          borderWidth: 1,

          borderColor:
            "rgba(255,77,79,0.35)",

          padding: 16,

          shadowColor:
  "#ff4d4f",

shadowOpacity: 0.25,

shadowRadius: 25,

elevation: 16,
        }}
      >
        {/* TOP */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
         <Animated.View
  style={{
    position: "absolute",

    width: 36,
    height: 36,

    borderRadius: 999,

    borderWidth: 2,
    marginLeft: -10,

borderColor:
  "#ff4d4f",
    opacity:
      ring.interpolate({
        inputRange: [0,1],
        outputRange: [0.8,0],
      }),

    transform: [
      {
        scale:
          ring.interpolate({
            inputRange: [0,1],
            outputRange: [0.8,2],
          }),
      },
    ],
  }}
/>

<Animated.View
  style={{
    opacity: wifiBlink,

    transform: [
      {
        scale:
          wifiBlink.interpolate({
            inputRange: [
              0.25,
              0.8,
            ],
            outputRange: [
              0.8,
              0.9,
            ],
          }),
      },
    ],
  }}
>
  <Ionicons
    name="wifi-outline"
    size={26}
    color="#ff4d4f"
  />
</Animated.View>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Offline Mode
            </Text>

            <Text
              style={{
                color: "#9ca3af",
                marginTop: 2,
                fontSize: 13,
              }}
            >
              Viewing cached content
            </Text>
          </View>
        </View>

        {/* INFO */}
        <View
          style={{
            marginTop: 14,
          }}
        >
          <Text
            style={{
              color: "#d1d5db",
              fontSize: 13,
              lineHeight: 20,
            }}
          >
      Some features may be unavailable
until your Reconnects to Internet.

{"\n\n"}

If a screen feels freezed,
close and reopen Spotlight.
          </Text>
        </View>

        {/* PROGRESS */}
        <View
          style={{
            marginTop: 14,

            height: 4,

            borderRadius: 999,

            overflow: "hidden",

            backgroundColor:
              "rgba(255,255,255,0.06)",
          }}
        >
          <Animated.View
            style={{
              height: "100%",

              width:
                progress.interpolate({
                  inputRange: [
                    0,
                    100,
                  ],
                  outputRange: [
                    "0%",
                    "100%",
                  ],
                }),

      backgroundColor:
  "#ff4d4f",
            }}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}