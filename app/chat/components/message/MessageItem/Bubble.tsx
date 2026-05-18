import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  ChatTheme,
} from "@/constants/chatThemes";

type Props = {
  text: string;

  edited?: boolean;

  isMe: boolean;

  isGrouped?: boolean;

  isHighlighted?: boolean;

  theme: ChatTheme;
};

function Bubble({
  text,

  edited,

  isMe,

  isGrouped,

  isHighlighted,

  theme,
}: Props) {
  const trimmed =
    text.trim();

  const emojiOnly =
    /^[\p{Emoji}\s]+$/u.test(
      trimmed
    );

const emojiCount =
  [...trimmed].length;

const emojiMessage =
  emojiOnly &&
  emojiCount > 0 &&
  emojiCount <= 8;

let emojiFontSize = 22;

if (emojiCount === 1) {
  emojiFontSize = 32;
} else if (
  emojiCount >= 2 &&
  emojiCount <= 4
) {
  emojiFontSize = 26;
}

if (emojiMessage) {
  return (
    <Text
      style={{
        fontSize:
          emojiFontSize,

        lineHeight:
          emojiFontSize + 6,

        marginVertical: 2,
      }}
    >
      {text}
    </Text>
  );
}


  const bubbleStyle = isMe
    ? {
        borderTopLeftRadius: 22,

        borderTopRightRadius: 22,

        borderBottomLeftRadius: 22,

        borderBottomRightRadius:
          isGrouped
            ? 10
            : 22,
      }
    : {
        borderTopLeftRadius: 22,

        borderTopRightRadius: 22,

        borderBottomRightRadius: 22,

        borderBottomLeftRadius:
          isGrouped
            ? 10
            : 22,
      };

const content = (
  <>
    <Text
      style={{
        color:
          isHighlighted
            ? "#ffffff"
            : isMe
            ? theme.textMe
            : theme.textOther,

        fontSize: 14,

        lineHeight: 20,
      }}
    >
      {text}
    </Text>

    {edited && (
      <Text
        style={{
          fontSize: 10,

          color:
            isHighlighted
              ? "#ffffff"
              : isMe
              ? theme.textMe
              : theme.textOther,

          marginTop: 4,
        }}
      >
        edited
      </Text>
    )}
  </>
);

/* ✅ GRADIENT BUBBLE */
if (
  isMe &&
  theme.bubbleGradient
) {
  return (
    <LinearGradient
      colors={
        theme.bubbleGradient
      }
      style={{
        backgroundColor:
          isHighlighted
            ? "#050505"
            : undefined,

        borderWidth:
          isHighlighted
            ? 2.2
            : 0,

        borderColor:
          isHighlighted
            ? "#0dff00"
            : "transparent",

        transform: [
          {
            scale:
              isHighlighted
                ? 1.04
                : 1,
          },
        ],

        paddingVertical: 10,

        paddingHorizontal: 14,

        ...bubbleStyle,
      }}
    >
      {content}
    </LinearGradient>
  );
}

/* ✅ NORMAL BUBBLE */
return (
  <View
    style={{
      backgroundColor:
        isHighlighted
          ? "#050505"
          : isMe
          ? theme.bubbleMe
          : theme.bubbleOther,

      borderWidth:
        isHighlighted
          ? 2.2
          : 0,

      borderColor:
        isHighlighted
          ? "#00ffe1"
          : "transparent",

      transform: [
        {
          scale:
            isHighlighted
              ? 1.04
              : 1,
        },
      ],

      paddingVertical: 10,

      paddingHorizontal: 14,

      ...bubbleStyle,
    }}
  >
    {content}
  </View>
);
}

export default React.memo(
  Bubble
);