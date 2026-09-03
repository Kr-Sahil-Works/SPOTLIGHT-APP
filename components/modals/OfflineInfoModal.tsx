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

import {
  LinearGradient,
} from "expo-linear-gradient";

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
      new Animated.Value(80)
    ).current;

  const progress =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    translateY.setValue(80);
    progress.setValue(0);

    Animated.spring(
      translateY,
      {
        toValue: 0,

        tension: 75,
        friction: 12,

        useNativeDriver: true,
      }
    ).start();

    Animated.timing(
      progress,
      {
        toValue: 100,

        duration: 12000,

        useNativeDriver: false,
      }
    ).start();

    const timer =
      setTimeout(() => {
        onClose();
      }, 12000);

    return () =>
      clearTimeout(timer);
  }, [
    visible,
    onClose,
    translateY,
    progress,
  ]);

  if (!visible) {
    return null;
  }

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

        justifyContent:
          "flex-end",

        paddingHorizontal: 12,
        paddingBottom: 18,

        /*
         * Very subtle red atmosphere.
         */
        backgroundColor:
          "rgba(70,0,4,0.035)",
      }}
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY,
            },
          ],

          width: "100%",

          paddingHorizontal: 15,
          paddingTop: 13,
          paddingBottom: 11,

          borderRadius: 18,

          /*
           * Almost-black glass.
           */
          backgroundColor:
            "rgba(3,3,4,0.98)",

          borderWidth: 0.6,

          borderColor:
            "rgba(255,70,75,0.12)",

          /*
           * Very restrained
           * red backlight.
           */
          shadowColor:
            "#ff3038",

          shadowOpacity: 0.08,

          shadowRadius: 10,

          shadowOffset: {
            width: 0,
            height: 3,
          },

          elevation: 8,
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          {/* ICON */}

          <View
            style={{
              width: 31,
              height: 31,

              borderRadius: 10,

              alignItems:
                "center",

              justifyContent:
                "center",

              backgroundColor:
                "rgba(255,55,60,0.07)",

              borderWidth: 0.5,

              borderColor:
                "rgba(255,70,75,0.10)",
            }}
          >
            <Ionicons
              name="wifi-outline"
              size={21}
              color="#c9363e"
            />
          </View>

          {/* TITLE */}

          <View
            style={{
              flex: 1,

              marginLeft: 10,
            }}
          >
            <Text
              style={{
                color: "#c9363e",

                fontSize: 14,

                fontWeight: "700",

                letterSpacing: 0.1,
              }}
            >
              No Internet Connection
            </Text>
          </View>
        </View>

        {/* =========================
            INFO
        ========================= */}

        <Text
          style={{
            color: "#a5a5aa",

            fontSize: 10,

            lineHeight: 18,

            marginTop: 11,

               textAlign: "center",
          }}
        >
          You are not connected to the internet.
  {"\n"}
  Make sure Wi-Fi is on, Airplane Mode is off
  {"\n"}
  and try again.
        </Text>
<Text
  style={{
    color: "#66666c",

    fontSize: 10.5,

    lineHeight: 15,

    marginTop: 6,

    textAlign: "center",
  }}
>
          If still screen feels frozen,
          close and reopen MilesSpot.
        </Text>

        {/* =========================
            PROGRESS
        ========================= */}

        <View
          style={{
            marginTop: 12,

            height: 3,

            borderRadius: 99,

            overflow: "hidden",

            backgroundColor:
              "rgba(255,255,255,0.055)",
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
            }}
          >
            <LinearGradient
              colors={[
                "#520006",
                "#a40010",
                "#e8323d",
              ]}
              start={{
                x: 0,
                y: 0.5,
              }}
              end={{
                x: 1,
                y: 0.5,
              }}
              style={{
                flex: 1,

                borderRadius: 99,
              }}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}