import React from "react";

import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useOverlay } from "../hooks/useOverlay";

type Props = {
  onDelete: (msg: any) => void;
};

export default function DeleteDialog({
  onDelete,
}: Props) {
  const {
    overlay,
    closeOverlay,
  } = useOverlay();

  const visible =
    overlay.type ===
      "delete" &&
    overlay.message;

  if (!visible) {
    return null;
  }

  const msg = overlay.message;

  return (
    <View
      style={{
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        justifyContent:
          "center",

        alignItems: "center",

        zIndex: 99999,

        elevation: 99999,
      }}
    >
      <Pressable
        onPress={closeOverlay}
        style={{
          position: "absolute",

          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          backgroundColor:
            "#00000088",
        }}
      />

      <View
        style={{
          width: "82%",

          backgroundColor:
            "#1c1c1e",

          borderRadius: 26,

          padding: 22,
        }}
      >
        <Text
          style={{
            color: "#fff",

            fontSize: 18,

            fontWeight: "700",

            marginBottom: 10,
          }}
        >
          Delete Message?
        </Text>

        <Text
          style={{
            color: "#aaa",

            fontSize: 14,

            lineHeight: 20,

            marginBottom: 24,
          }}
        >
          This message will be
          removed permanently.
        </Text>

        <View
          style={{
            flexDirection: "row",

            justifyContent:
              "flex-end",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={closeOverlay}
            style={{
              paddingVertical: 10,

              paddingHorizontal: 16,

              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: "#aaa",

                fontSize: 15,

                fontWeight: "600",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              onDelete(msg);

              closeOverlay();
            }}
            style={{
              backgroundColor:
                "#ff453a",

              paddingVertical: 10,

              paddingHorizontal: 18,

              borderRadius: 14,
            }}
          >
            <Text
              style={{
                color: "#fff",

                fontSize: 15,

                fontWeight: "700",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}