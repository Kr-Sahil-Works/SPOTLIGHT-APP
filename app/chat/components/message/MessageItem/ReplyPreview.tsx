import React from "react";

import {
  Pressable,
  Text,
} from "react-native";

import { ChatTheme } from "@/constants/chatThemes";

type Props = {
  replyTo?: string;

  replyToText?: string;

  onPress?: () => void;
  onScrollTo?: (
  id: string
) => void;

  theme: ChatTheme;
};

function ReplyPreview({
  replyTo,
  replyToText,
  onScrollTo,
  onPress,
  theme,
}: Props) {
  if (
    !replyTo ||
    !replyToText
  ) {
    return null;
  }

  return (
    <Pressable
onPress={() => {
  if (
    replyTo
  ) {
    onScrollTo?.(
      String(replyTo)
    );
  }

  onPress?.();
}}
      android_ripple={{
        color:
          "rgba(255,255,255,0.08)",
      }}
      style={{
        borderLeftWidth: 3,

        borderLeftColor:
          "#00b7ff",

        paddingLeft: 10,

        paddingVertical: 4,

        marginBottom: 8,

        borderRadius: 8,

        opacity: 0.92,
      }}
    >
      <Text
        numberOfLines={2}
        style={{
          fontSize: 11,

          color: "#aaa",

          lineHeight: 16,
        }}
      >
        {replyToText}
      </Text>
    </Pressable>
  );
}

export default React.memo(
  ReplyPreview
);