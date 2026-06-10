import React, {
  memo,
  useCallback,
} from "react";

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

  const handlePress =
  useCallback(() => {
    if (replyTo) {
      onScrollTo?.(
        String(replyTo)
      );
    }

    onPress?.();
  }, [
    replyTo,
    onScrollTo,
    onPress,
  ]);

  if (
    !replyTo ||
    !replyToText
  ) {
    return null;
  }

  return (
    <Pressable
onPress={handlePress}
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

export default memo(
  ReplyPreview
);