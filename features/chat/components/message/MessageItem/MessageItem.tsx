import React, {
  useEffect,
  useRef
} from "react";

import {
  Animated,
  Pressable,
  View
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

  isOnline: boolean;

 isHighlighted?: boolean;

 isDeleting?: boolean;

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

  onOpenReactions?: (
  msg: Message
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
  prev.item.reactions ?? []
) ===
JSON.stringify(
  next.item.reactions ?? []
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

  isOnline,

isHighlighted,

isDeleting,

  onReply,

  onReact,

  onLongPress,

onScrollTo,

onOpenReactions,
}: Props)  {
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
  const deleteOpacity =
  useRef(
    new Animated.Value(1)
  ).current;

const deleteScale =
  useRef(
    new Animated.Value(1)
  ).current;

useEffect(() => {
  if (isDeleting) {
    Animated.parallel([
      Animated.timing(
        deleteOpacity,
        {
          toValue: 0,

          duration: 220,

          useNativeDriver: true,
        }
      ),

      Animated.timing(
        deleteScale,
        {
          toValue: 0.92,

          duration: 220,

          useNativeDriver: true,
        }
      ),
    ]).start();
  } else {
    deleteOpacity.setValue(1);

    deleteScale.setValue(1);
  }
}, [isDeleting]);


  const handleTap =
    useDoubleTap({
onDoubleTap: async () => {
  if (!isOnline)
    return;

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
    renderToHardwareTextureAndroid={false}
      {...panResponder.panHandlers}
style={{
  opacity:
    deleteOpacity,

  transform: [
    {
      translateX:
        panX,
    },
    {
      scale:
        deleteScale,
    },
  ],
}}
    >
      <Pressable
        ref={msgRef}
        delayLongPress={220}
onPress={handleTap}
  onLongPress={(e) => {
  if (!isOnline)
    return;

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
       <Animated.View
  style={{
    flexDirection: "row",

    alignItems:
      "flex-end",

    alignSelf: isMe
      ? "flex-end"
      : "flex-start",

  marginBottom:
  item.reactions?.length
    ? 24
    : isGrouped
      ? 2
      : 16,

    marginLeft:
      !isMe &&
      isGrouped
        ? 0
        : 0,

    opacity:
      deleteOpacity,

    transform: [
      {
        scale:
          deleteScale,
      },
    ],
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
              onScrollTo={
  onScrollTo
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

          <View
  style={{
    position:
      "relative",
  }}
>
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

  {isDeleting && (
    <Animated.View
      pointerEvents="none"
      style={{
        position:
          "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        opacity:
          deleteOpacity,
      }}
    />
  )}
</View>

         <Reactions
  reactions={
    item.reactions
  }
  onPress={() =>
    onOpenReactions?.(
      item
    )
  }
/>
          </View>
   </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(
  MessageItem,
  areEqual
);