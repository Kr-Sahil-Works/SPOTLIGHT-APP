import React, {
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  View,
} from "react-native";



import * as Haptics from "expo-haptics";

import {
  ChatTheme,
} from "@/constants/chatThemes";

import {
  Message,
} from "@/types/chat";

import Avatar from "./Avatar";

import Bubble from "./Bubble";

import Reactions from "./Reactions";

import ReplyPreview from "./ReplyPreview";

import SwipeReply from "./SwipeReply";

import useDoubleTap from "../gestures/useDoubleTap";

import useMessageGestures from "../gestures/useMessageGestures";

type Props = {
  item: Message;

  isMe: boolean;

  theme: ChatTheme;

  avatar: string;

  isGrouped?: boolean;

 isHighlighted?: boolean;

  onReply: (
    msg: Message
  ) => void;

  onReact: (
    msg: Message
  ) => void;

  onLongPress: (
    msg: Message,
    ref: any,
    px?: number,
    py?: number
  ) => void;

  onScrollTo: (
    id: string
  ) => void;
};

const areEqual = (
  prev: Props,
  next: Props
) => {
  return (
    prev.item._id ===
      next.item._id &&

    prev.item.text ===
      next.item.text &&

    prev.item.edited ===
      next.item.edited &&

    prev.item.replyToText ===
      next.item.replyToText &&

      JSON.stringify(
  prev.item.reactions
) ===
JSON.stringify(
  next.item.reactions
) &&

  prev.isHighlighted ===
  next.isHighlighted &&

    prev.isGrouped ===
      next.isGrouped &&

    prev.isMe === next.isMe &&

    prev.theme === next.theme
  );
};

function MessageItem({
  item,

  isMe,

  theme,

  avatar,

  isGrouped,

isHighlighted,

  onReply,

  onReact,

  onLongPress,

  onScrollTo,
}: Props) {
  const msgRef =
    useRef<any>(null);

  const {
    panX,

    arrowOpacity,

    panResponder,
  } = useMessageGestures({
    item,

    onReply,
  });

  const handleTap =
    useDoubleTap({
      onDoubleTap: async () => {
        await Haptics.impactAsync(
          Haptics
            .ImpactFeedbackStyle
            .Light
        );

        onReact(item);
      },
    });

  if (item.type === "system") {
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
            backgroundColor:
              "#ffffff10",

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 999,
          }}
        >
          <Animated.Text
            style={{
              color: "#888",

              fontSize: 12,
            }}
          >
            {item.text}
          </Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [
          {
            translateX: panX,
          },
        ],
      }}
    >
      <Pressable
        ref={msgRef}
        delayLongPress={220}
onPress={handleTap}
     onLongPress={(e) => {
  Haptics.impactAsync(
    Haptics
      .ImpactFeedbackStyle
      .Medium
  );

  const {
    pageX,
    pageY,
  } = e.nativeEvent;

  onLongPress(
    item,
    msgRef,
    pageX,
    pageY
  );
}}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems:
              "flex-end",

            alignSelf: isMe
              ? "flex-end"
              : "flex-start",

           marginBottom:
  isGrouped
    ? 2
    : 16,

  
  
  
  marginLeft:
  !isMe &&
  isGrouped
    ? 0
    : 0,
          }}
        >
          <Avatar
            avatar={avatar}
            isMe={isMe}
            isGrouped={
              isGrouped
            }
          />

          <SwipeReply
            arrowOpacity={
              arrowOpacity
            }
            color={
              theme.bubbleMe
            }
          />

          <View
            style={{
              maxWidth: "75%",
            }}
          >
            <ReplyPreview
              replyTo={
                item.replyTo
              }
              replyToText={
                item.replyToText
              }
              onPress={() => {
                if (
                  item.replyTo
                ) {
                  onScrollTo(
                    item.replyTo
                  );
                }
              }}
              theme={theme}
            />

            <Bubble
              text={item.text}
              edited={
                item.edited
              }
              isMe={isMe}
              isGrouped={
                isGrouped
              }
              isHighlighted={
                isHighlighted
              }
              theme={theme}
            />

            <Reactions
              reactions={
                item.reactions
              }
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(
  MessageItem,
  areEqual
);