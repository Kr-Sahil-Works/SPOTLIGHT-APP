import React, {
  useEffect,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  FlashList,
} from "@shopify/flash-list";

import {
  MessageRenderer,
} from "./renderers";

import {
  OverlayRenderer,
} from "./overlays";

import { Id } from "@/convex/_generated/dataModel";
import {
  useAutoScroll,
  useChatScroll,
  useKeyboardScroll,
  useOverlay,
  useScrollToMessage,
  useThemeScrollSync,
} from "./hooks";


type Props = {
  messages: any[];

  currentUserId?: string;

  theme: any;

  highlightId?: string;

  loadingMore?: boolean;

  loadOlder?: () => void;

  onReply: (
    msg: any
  ) => void;

  onReact: (
    msg: any
  ) => void;

  onDelete: (
    msg: any
  ) => void;

  onCopy: (
    msg: any
  ) => void;

  onEdit?: (
    msg: any
  ) => void;

  onLongPress: (
    msg: any,
    ref: any,
    px?: number,
    py?: number
  ) => void;

toggleReaction: (data: {
  messageId: Id<"messages">;
  reaction: string;
}) => Promise<any> | void;
};

export default function MessageList({
  messages,

  currentUserId,

  theme,

  highlightId,

  loadingMore,

  loadOlder,

  onReply,

  onReact,

  onDelete,

  onCopy,

  onEdit,

  onLongPress,

  toggleReaction,
}: Props) {
const {
  openReaction,
  highlightMessage,
  highlightedMessageId,
} = useOverlay();
  const {
    listRef,

    onScroll,

    scrollToBottom,

    onNewMessage,

    showScrollBtn,

    newMsgCount,

    scrollOffsetRef,
  } = useChatScroll();

  useKeyboardScroll(
    listRef
  );

  useAutoScroll(
    messages,
    listRef
  );

  useThemeScrollSync(
    listRef,
    scrollOffsetRef,
    theme
  );

  const scrollToMessage =
    useScrollToMessage(
      listRef,
      messages
    );

  useEffect(() => {
    if (
      messages?.length
    ) {
      onNewMessage();
    }
  }, [messages]);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor:
          theme.wallpaper
            ? "transparent"
            : theme.background,
      }}
    >
      {loadingMore && (
        <View
          style={{
            position:
              "absolute",

            top: 8,

            alignSelf:
              "center",

            zIndex: 999,

            backgroundColor:
              "#000000aa",

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontSize: 12,
            }}
          >
            Loading Chats...
          </Text>
        </View>
      )}

      <FlashList
        ref={listRef}
        data={messages}
        drawDistance={
          300
        }
        removeClippedSubviews
        keyExtractor={(
          item
        ) =>
          item._id.toString()
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 12,

          paddingVertical: 10,
        }}
        onScroll={(e) => {
          onScroll(e);

          if (
            e.nativeEvent
              .contentOffset
              .y < 80 &&
            !loadingMore
          ) {
            loadOlder?.();
          }
        }}
        renderItem={({
          item,
          index,
        }) => (
          <MessageRenderer
            item={item}
            index={index}
            messages={
              messages
            }
            currentUserId={
              currentUserId
            }
            theme={theme}
     highlightId={
  highlightedMessageId ||
  undefined
}
            onReply={
              onReply
            }
   onReact={
  async (msg) => {
    await toggleReaction({
      messageId:
        msg._id,

      reaction: "❤️",
    });
  }
}
          onLongPress={(
  msg
) => {
  highlightMessage(
    msg._id
  );

  openReaction(msg);
}}
            onScrollTo={
              scrollToMessage
            }
          />
        )}
      />

      {showScrollBtn && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={
            scrollToBottom
          }
          style={{
            position:
              "absolute",

            right: 18,

            bottom: 18,

            backgroundColor:
              theme.bubbleMe,

            minWidth: 44,

            height: 44,

            borderRadius: 22,

            alignItems:
              "center",

            justifyContent:
              "center",

            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              color: "#000",

              fontWeight:
                "600",
            }}
          >
            ↓ {newMsgCount}
          </Text>
        </TouchableOpacity>
      )}

      <OverlayRenderer
        currentUserId={
          currentUserId
        }
        onReply={onReply}
        onDelete={onDelete}
        onCopy={onCopy}
        onEdit={onEdit}
        toggleReaction={
          toggleReaction
        }
      />
    </View>
  );
}