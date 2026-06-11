import React, {
  memo,
  useCallback,
  useMemo
} from "react";

import {
  Linking,
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
const cleanText = useMemo(
  () => text.trim(),
  [text]
);

const isPhoneNumber = useMemo(
  () =>
    /^(\+?\d[\d\s-]{8,})$/.test(
      cleanText
    ),
  [cleanText]
);

const isLink = useMemo(
  () =>
    /(https?:\/\/|www\.)/i.test(
      cleanText
    ),
  [cleanText]
);

const emojiOnly = useMemo(
  () =>
    cleanText.length > 0 &&
    /^[\p{Extended_Pictographic}\s\u200d]+$/u.test(
      cleanText
    ),
  [cleanText]
);

const emojiCount = useMemo(
  () => [...cleanText].length,
  [cleanText]
);

const emojiMessage =
  emojiOnly &&
  emojiCount > 0 &&
  emojiCount <= 8;

let emojiFontSize = 22;

if (emojiCount === 1) {
  emojiFontSize = 32;
} else if (
  emojiCount >= 2 &&
  emojiCount <= 6
) {
  emojiFontSize = 28;
}

const handleOpen = useCallback(
  async () => {
    if (isPhoneNumber) {
      const rawNumber =
        text.replace(/\D/g, "");

      const indianNumber =
        rawNumber.length === 10
          ? `+91${rawNumber}`
          : rawNumber.startsWith(
              "91"
            )
          ? `+${rawNumber}`
          : rawNumber;

      await Linking.openURL(
        `tel:${indianNumber}`
      );

      return;
    }

    if (isLink) {
      let url = text;

      if (
        !url.startsWith("http")
      ) {
        url = `https://${url}`;
      }

      await Linking.openURL(url);
    }
  },
  [isPhoneNumber, isLink, text]
);

if (emojiMessage) {
  return (
    <View>
  <Text
  selectable={false}
  suppressHighlighting
onPress={
  isPhoneNumber || isLink
    ? handleOpen
    : undefined
}
  style={{
    fontSize:
      emojiOnly
        ? 34
        : 14,

    lineHeight:
      emojiOnly
        ? 42
        : 20,

    color:
      isMe
        ? theme.textMe
        : theme.textOther,

    textDecorationLine:
      isPhoneNumber ||
      isLink
        ? "underline"
        : "none",
  }}
>
  {text}
</Text>

      {edited && (
        <View
          style={{
            alignItems:
              "flex-end",

            marginTop: 2,
          }}
        >
          <Text
            style={{
              fontSize: 10,

              opacity: 0.7,

              color:
                isHighlighted
                  ? "#fff"
                  : isMe
                  ? theme.textMe
                  : theme.textOther,
            }}
          >
            edited
          </Text>
        </View>
      )}
    </View>
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
      selectable={false}
      suppressHighlighting
onPress={
  isPhoneNumber || isLink
    ? handleOpen
    : undefined
}
      style={{
        color:
          isHighlighted
            ? "#ffffff"
            : isMe
            ? theme.textMe
            : theme.textOther,

        fontSize: 14,

        lineHeight: 18,

        textDecorationLine:
          isPhoneNumber ||
          isLink
            ? "underline"
            : "none",
      }}
    >
      {text}
    </Text>

    <View
      style={{
        flexDirection:
          "row",

        justifyContent:
          "flex-end",

        marginTop: 4,
      }}
    />
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
      start={
        theme.gradientDirection
          ?.start ?? {
            x: 0,
            y: 0,
          }
      }
      end={
        theme.gradientDirection
          ?.end ?? {
            x: 1,
            y: 1,
          }
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

        paddingVertical: 8,

        paddingHorizontal: 12,

        ...bubbleStyle,
      }}
    >
      {content}
    </LinearGradient>
  );
}

/* ✅ NORMAL BUBBLE */
return (
  <View>
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
            ? 2
            : 0,

        borderColor:
          isHighlighted
            ? "#00c8ff"
            : "transparent",

        shadowColor:
          isHighlighted
            ? "#00c8ff"
            : "transparent",

        shadowOpacity:
          isHighlighted
            ? 0.9
            : 0,

        shadowRadius:
          isHighlighted
            ? 18
            : 0,

        elevation:
          isHighlighted
            ? 18
            : 0,

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

    {edited && (
      <Text
        style={{
          fontSize: 10,

          marginTop: 4,

          marginHorizontal: 8,

          alignSelf:
            isMe
              ? "flex-end"
              : "flex-start",

          color:
            "#8e8e93",
        }}
      >
        edited
      </Text>
    )}
  </View>
);
}

export default memo(
  Bubble
);