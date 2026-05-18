import React from "react";

import {
    Text,
    View,
} from "react-native";

type Props = {
  text: string;

  count?: number;

  bubbleColor?: string;
};

export default function SystemMessage({
  text,

  count = 1,

  bubbleColor = "#3b82f6",
}: Props) {
  return (
    <View
      style={{
        alignItems:
          "center",

        marginVertical: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",

          alignItems:
            "center",

          backgroundColor:
            "#ffffff10",

          paddingHorizontal: 12,

          paddingVertical: 6,

          borderRadius: 999,
        }}
      >
        <Text
          style={{
            color: "#888",

            fontSize: 12,
          }}
        >
          {text}
        </Text>

        {count > 1 && (
          <View
            style={{
              marginLeft: 8,

              minWidth: 18,

              height: 18,

              borderRadius: 9,

              backgroundColor:
                bubbleColor,

              alignItems:
                "center",

              justifyContent:
                "center",

              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                color: "#000",

                fontSize: 10,

                fontWeight:
                  "700",
              }}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}