import React from "react";

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
  const trimmed =
    text.trim();

    const isPhoneNumber =
  /^(\+?\d[\d\s-]{8,})$/.test(
    text.trim()
  );

const isLink =
  /(https?:\/\/|www\.)/i.test(
    text
  );


const cleanText =
  text.trim();

const emojiOnly =
  cleanText.length >
    0 &&
  /^[\p{Extended_Pictographic}\s\u200d]+$/u.test(
    cleanText
  );

const emojiCount =
  [...cleanText].length;

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

if (emojiMessage) {
  return (
    <View>
  <Text
  selectable
  suppressHighlighting
  onPress={async () => {
    if (
      isPhoneNumber
    ) {
    const rawNumber =
  text.replace(
    /\D/g,
    ""
  );

const indianNumber =
  rawNumber.length ===
  10
    ? `+91${rawNumber}`
    : rawNumber.startsWith(
        "91"
      )
    ? `+${rawNumber}`
    : rawNumber;

await Linking.openURL(
  `tel:${indianNumber}`
)

      return;
    }

    if (isLink) {
      let url = text;

      if (
        !url.startsWith(
          "http"
        )
      ) {
        url = `https://${url}`;
      }

      await Linking.openURL(
        url
      );
    }
  }}
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
      selectable
      suppressHighlighting
      onPress={async () => {
        if (
          isPhoneNumber
        ) {
          await Linking.openURL(
            `tel:${text.replace(
              /\s/g,
              ""
            )}`
          );

          return;
        }

        if (isLink) {
          let url = text;

          if (
            !url.startsWith(
              "http"
            )
          ) {
            url = `https://${url}`;
          }

          await Linking.openURL(
            url
          );
        }
      }}
      style={{
        color:
          isHighlighted
            ? "#ffffff"
            : isMe
            ? theme.textMe
            : theme.textOther,

        fontSize: 14,

        lineHeight: 20,

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

export default React.memo(
  Bubble
);