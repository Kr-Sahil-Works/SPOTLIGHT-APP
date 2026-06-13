import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

type Props = {
  count: number;

  avatar?: string;

  theme: any;

  onPress: () => void;
};

export default function NewMessageBadge({
  count,
  avatar,
  theme,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        position: "absolute",

        alignSelf: "center",

        bottom: 24,

        zIndex: 999,
      }}
    >
      <View
        style={{
          flexDirection: "row",

          alignItems: "center",

  backgroundColor:
  `${theme.bubbleMe}99`,

          borderRadius: 999,

          paddingLeft: 6,

          paddingRight: 14,

          paddingVertical: 6,

          shadowOpacity: 0.25,

          shadowRadius: 10,

          elevation: 8,
        }}
      >
    <View
  style={{
    width: 36,
    height: 36,

    marginRight: 10,

    position: "relative",
  }}
>
      <Image
  source={
    avatar
      ? { uri: avatar }
      : require(
          "@/assets/images/icons/iconbg.webp"
        )
  }
  contentFit="cover"
  style={{
    width: 36,
    height: 36,

    borderRadius: 18,

    borderWidth: 1.5,

    borderColor: "#ffffff20",
  }}
/>

       {count > 0 && (
  <View
    style={{
      position: "absolute",

      top: -4,

      right: -4,

      minWidth: 20,

      height: 20,

      borderRadius: 10,

      backgroundColor: "#ff3040",

      borderWidth: 2,

      borderColor:
        theme.bubbleMe,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 4,
    }}
  >
    <Text
      style={{
        color: "#fff",

        fontSize: 10,

        fontWeight: "700",
      }}
    >
      {count > 99
        ? "99+"
        : count}
    </Text>
  </View>
)}
        </View>

        <Text
          style={{
            color: "#fff",

            fontSize: 13,

            fontWeight: "700",
          }}
        >
          New messages
        </Text>
      </View>
    </TouchableOpacity>
  );
}