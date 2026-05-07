import { ChatTheme } from "@/constants/chatThemes";
import { Message } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  item: Message;
  isMe: boolean;
  theme: ChatTheme;
  avatar: string;

  onLongPress: (
    msg: Message,
    ref: any,
    px?: number,
    py?: number
  ) => void;

  onReact: (msg: Message) => void;
  onReply: (msg: Message) => void;
  onScrollTo: (id: string) => void;

  highlightId?: string;
  isGrouped?: boolean;
  isLast?: boolean;
};

const areEqual = (prev: Props, next: Props) => {
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
  prev.highlightId ===
    next.highlightId &&
  prev.isGrouped ===
    next.isGrouped &&
  prev.isMe === next.isMe &&
  prev.theme === next.theme
);
};

const MessageItem = React.memo(function MessageItem({
  item,
  isMe,
  theme,
  avatar,
  onLongPress,
  onReact,
  onReply,
  onScrollTo,
  highlightId,
  isGrouped,
}: Props) {
  const msgRef = useRef<any>(null);

  const isHighlighted = highlightId === item._id;

 

  /* ✅ SIMPLE SWIPE */
  const panX = useRef(new Animated.Value(0)).current;

  const replied = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        return (
          Math.abs(g.dx) > 12 &&
          Math.abs(g.dx) > Math.abs(g.dy)
        );
      },

      onPanResponderMove: (_, g) => {
        if (
          g.dx > 0 &&
          Math.abs(g.dx) > Math.abs(g.dy)
        ) {
          const dx = g.dx;

          const resistance =
            dx > 80
              ? 80 + (dx - 80) * 0.2
              : dx;

          panX.setValue(Math.max(0, resistance));
        }

        if (g.dx > 75 && !replied.current) {
          replied.current = true;

          Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Medium
          );

          onReply(item);
        }
      },

      onPanResponderRelease: () => {
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        replied.current = false;
      },
    })
  ).current;

  const arrowOpacity = panX.interpolate({
    inputRange: [20, 70],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

   if (item.type === "system") {
  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          backgroundColor: "#ffffff10",

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
          {item.text}
        </Text>

        {(item.systemCount ?? 1) >
          1 && (
          <View
            style={{
              marginLeft: 8,

              minWidth: 18,
              height: 18,

              borderRadius: 9,

              backgroundColor:
                theme.bubbleMe,

              alignItems: "center",
              justifyContent: "center",

              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {item.systemCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX: panX }],
      }}
    >
      <Pressable
        ref={msgRef}
        delayLongPress={180}
        onLongPress={(e) => {
          const { pageX, pageY } = e.nativeEvent;

          onLongPress(
            item,
            msgRef,
            pageX,
            pageY
          );
        }}
        onPress={() => onReact(item)}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: isMe
              ? "flex-end"
              : "flex-start",

            alignItems: "flex-end",

            marginBottom: 8,

            marginLeft:
              !isMe && isGrouped ? 34 : 0,
          }}
        >
          {/* ✅ AVATAR */}
          {!isMe && !isGrouped && (
            <Image
              source={
                avatar?.trim()
                  ? { uri: avatar }
                  : require("@/assets/images/iconbg.png")
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                marginRight: 6,
              }}
            />
          )}

          {/* ✅ REPLY ICON */}
          <Animated.View
            style={{
              position: "absolute",
              left: -30,
              bottom: 10,
              opacity: arrowOpacity,
            }}
          >
            <Ionicons
              name="arrow-undo"
              size={18}
              color={theme.bubbleMe}
            />
          </Animated.View>

          <View
            style={{
              maxWidth: "75%",
            }}
          >
            {/* ✅ REPLY PREVIEW */}
            {item.replyToText && (
              <Pressable
                onPress={() =>
                  item.replyTo &&
                  onScrollTo(item.replyTo)
                }
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor:
                    theme.bubbleMe,

                  paddingLeft: 8,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                  }}
                >
                  {item.replyToText}
                </Text>
              </Pressable>
            )}
            {/* ✅ BUBBLE */}
            <View
              style={{
                backgroundColor:
                  isHighlighted
                    ? "#111"
                    : isMe
                    ? theme.bubbleMe
                    : theme.bubbleOther,

                paddingVertical: 10,
                paddingHorizontal: 14,

                borderRadius: isGrouped
                  ? 16
                  : 22,
              }}
            >
              <Text
                style={{
                  color: isMe
  ? theme.textMe
  : theme.textOther,
                  fontSize: 14,
                }}
              >
                {item.text}
              </Text>

              {item.edited && (
                <Text
                  style={{
                    fontSize: 10,
                    color: "#aaa",
                    marginTop: 4,
                  }}
                >
                  edited
                </Text>
              )}
            </View>

            {/* ✅ REACTIONS */}
            {(item.reactions?.length ?? 0) >
              0 && (
              <View
                style={{
                  position: "absolute",
                  bottom: -18,

                  backgroundColor:
                    "#000000cc",

                  borderRadius: 16,

                  paddingHorizontal: 8,
                  paddingVertical: 3,

                  flexDirection: "row",
                }}
              >
                {item.reactions!.map(
                  (r, i) => (
                    <Text key={i}>
                      {r.value}
                    </Text>
                  )
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}, areEqual);

export default MessageItem;