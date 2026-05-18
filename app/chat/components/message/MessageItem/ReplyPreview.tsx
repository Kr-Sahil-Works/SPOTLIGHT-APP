import React from "react";

import {
    Pressable,
    Text
} from "react-native";

import { ChatTheme } from "@/constants/chatThemes";

type Props = {
  replyTo?: string;

  replyToText?: string;

  onPress?: () => void;

  theme: ChatTheme;
};

function ReplyPreview({
  replyTo,
  replyToText,
  onPress,
  theme,
}: Props) {
  if (!replyTo || !replyToText) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderLeftWidth: 3,

        borderLeftColor:
          theme.bubbleMe,

        paddingLeft: 8,

        marginBottom: 6,
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