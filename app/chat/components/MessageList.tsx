import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MessageItem from "./MessageItem";

import { ChatTheme } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Message, TapState } from "@/types/chat";

type Props = {
  messages: Message[];

  currentUserId?: Id<"users">;

  theme: ChatTheme;

  onReply?: (msg: Message) => void;

  onLongPress?: (msg: Message) => void;

  onReact?: (msg: Message) => void;

  onDoubleTap?: (msg: Message) => void;

  highlightId?: string;
};

export default function MessageList({
  messages,
  currentUserId,
  theme,
  onReply,
  onLongPress,
  onReact,
  onDoubleTap,
  highlightId,
}: Props) {
  const listRef = useRef<any>(null);

  const tapRef = useRef<
    Record<Id<"messages">, TapState>
  >({});

  const lastIdRef = useRef<string | null>(
    null
  );

  const isAtBottom = useRef(true);

  const [showScrollBtn, setShowScrollBtn] =
    useState(false);

  const [newMsgCount, setNewMsgCount] =
    useState(0);

  /* ✅ AUTO SCROLL */
  useEffect(() => {
    if (!messages.length) return;

    const latest =
      messages[messages.length - 1];

    if (latest._id === lastIdRef.current)
      return;

    lastIdRef.current = latest._id;

    if (isAtBottom.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({
          animated: true,
        });
      });
    } else {
      setNewMsgCount((p) => p + 1);
      setShowScrollBtn(true);
    }
  }, [messages]);

  /* ✅ SCROLL TO BOTTOM */
  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({
      animated: true,
    });

    setShowScrollBtn(false);
    setNewMsgCount(0);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme.background,
      }}
    >
      <FlashList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
        showsVerticalScrollIndicator={
          false
        }
        onScroll={(e) => {
          const {
            contentOffset,
            contentSize,
            layoutMeasurement,
          } = e.nativeEvent;

          const distanceFromBottom =
            contentSize.height -
            (contentOffset.y +
              layoutMeasurement.height);

          const atBottom =
            distanceFromBottom < 60;

          isAtBottom.current = atBottom;

          if (atBottom) {
            setShowScrollBtn(false);
            setNewMsgCount(0);
          }
        }}
        renderItem={({ item, index }) => {
          const prev =
            messages[index - 1];

          const isGrouped =
            prev?.senderId ===
            item.senderId;

          const isMe =
            item.senderId ===
            currentUserId;

          return (
            <MessageItem
              item={item}
              isMe={isMe}
              theme={theme}
              avatar=""
              isGrouped={!!isGrouped}
              highlightId={highlightId}
              onLongPress={(
                msg,
                ref,
                px,
                py
              ) => {
                if (!ref?.current) return;

                ref.current.measureInWindow(
                  (
                    x: number,
                    y: number,
                    w: number,
                    h: number
                  ) => {
                    onLongPress?.({
                      ...msg,
                      x,
                      y,
                      width: w,
                      height: h,
                      fingerX: px,
                      fingerY: py,
                    });
                  }
                );
              }}
              onReact={(msg) => {
             const id = msg._id;

                if (!tapRef.current[id]) {
                  tapRef.current[id] = {
                    count: 0,
                    timer: null,
                  };
                }

                const t =
                  tapRef.current[id];

                t.count++;

                if (t.timer) {
                  clearTimeout(
                    t.timer
                  );
                }

                t.timer = setTimeout(() => {
                  const taps = t.count;

                  if (taps === 2) {
                    onDoubleTap?.(
                      msg
                    );
                  } else if (
                    taps >= 3
                  ) {
                    onReact?.(msg);
                  }

                  tapRef.current[id] =
                    {
                      count: 0,
                      timer: null,
                    };
                }, 220);
              }}
              onReply={
                onReply ||
                (() => {})
              }
              onScrollTo={() => {}}
            />
          );
        }}
      />

      {/* ✅ SCROLL BUTTON */}
      {showScrollBtn && (
        <TouchableOpacity
          onPress={scrollToBottom}
          activeOpacity={0.9}
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,

            backgroundColor:
              theme.bubbleMe,

            minWidth: 44,
            height: 44,

            borderRadius: 22,

            alignItems: "center",
            justifyContent: "center",

            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontWeight: "600",
            }}
          >
            ↓ {newMsgCount}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}