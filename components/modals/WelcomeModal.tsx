import { api } from "@/convex/_generated/api";
import { storage } from "@/lib/mmkv";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  fullname?: string;
  onClose: () => void;
};

export default function WelcomeModal({
  visible,
  fullname,
  onClose,
}: Props) {


  const userRank = useQuery(
  api.users.index.getUserRank
);


  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.9)
    ).current;
    const progress =
  useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (!visible) return;

    progress.setValue(0);

Animated.timing(
  progress,
  {
    toValue: 100,
    duration: 20000,
    easing: Easing.linear,
    useNativeDriver: false,
  }
).start();

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        scale,
        {
          toValue: 1,
          useNativeDriver: true,
        }
      ),
    ]).start();

    const timer =
      setTimeout(() => {
        storage.set(
          "welcome_card_seen",
          true
        );

        onClose();
      }, 22000);

    return () =>
      clearTimeout(timer);

}, [visible]);

  if (!visible)
    return null;

  return (
    <View
      style={{
        position:
          "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor:
          "rgba(0,0,0,0.6)",

        justifyContent:
          "center",

        alignItems:
          "center",

        zIndex: 99999,
      }}
    >
      <Animated.View
        style={{
          opacity,

          transform: [
            { scale },
          ],

          width: "88%",

          backgroundColor:
            "#0f0f0f",

          borderRadius: 24,

          borderWidth: 1,

          borderColor:
            "rgba(255,255,255,0.08)",

          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 24,

            marginBottom: 12,

            textAlign:
              "center",
          }}
        >
          🤗💚
        </Text>

        <Text
          style={{
            color: "#fff",

            fontSize: 22,

            fontWeight: "700",

            textAlign:
              "center",
          }}
        >
          Welcome to Spotlight
        </Text>

        <Text
          style={{
            color:
              "#44d800",

            marginTop: 10,

            fontSize: 16,

            textAlign:
              "center",

            fontWeight:
              "600",
          }}
        >
          {fullname}
        </Text>

       <Text
  style={{
    color: "#CFCFCF",
    marginTop: 18,
    lineHeight: 22,
    textAlign: "center",
  }}
>
  Spotlight is my first
  published app.
  {"\n\n"}

  Built with passion,
  curiosity, and countless
  late nights.

  {"\n\n"}

Thank you for being{" "}
<Text
  style={{
    color: "#00ff6a",
    fontWeight: "900",
    fontSize: 17,
  }}
>
  #{userRank ?? "?"}
</Text>{" "}
user of Spotlight.

  {"\n\n"}

  Early users like you
  are helping this app to grow.
  Everyone using this app means a lot to me.

  {"\n\n"}

  I really hope you enjoy
  using Spotlight ✨
</Text>

        <TouchableOpacity
          onPress={() => {
            storage.set(
              "welcome_card_seen",
              true
            );

            onClose();
          }}
          style={{
            marginTop: 22,

            backgroundColor:
              "#44d800",

            borderRadius: 14,

            paddingVertical:
              12,
          }}
        >
          <Text
            style={{
              textAlign:
                "center",

              fontWeight:
                "700",

              color: "#000",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
        <View
  style={{
    marginTop: 16,
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
  "#52ff00",
    }}
  />
</View>
      </Animated.View>
    </View>
  );
}