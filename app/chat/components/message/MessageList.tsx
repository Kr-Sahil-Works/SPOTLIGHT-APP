import React, {
  useCallback,
  useEffect
} from "react";

import {
  Text,
  TouchableOpacity,
  View
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

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  useAutoScroll,
  useChatScroll,
  useKeyboardScroll,
  useOverlay,
  useThemeScrollSync
} from "./hooks";


type Props = {
  messages: any[];

  currentUserId?: string;

  theme: any;

  highlightId?: string;

  loadingMore?: boolean;

  loadOlder?: () => void;

  pinnedMessageId?: string;

  flatListRef?: any;

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
  onPin?: (
  msg: any
) => void;
onScrollTo?: (
  targetId: string
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
  onScrollTo,

  flatListRef,

  pinnedMessageId,

  loadingMore,

  loadOlder,

  onReply,

  onReact,

  onPin,

  onDelete,

  onCopy,

  onEdit,

  onLongPress,

  toggleReaction,
}: Props) {
  const [
  deletingIds,
  setDeletingIds,
] = React.useState<
  string[]
>([]);
const {
  openReaction,
  highlightMessage,
  highlightedMessageId,
} = useOverlay();

const [
  scrollHighlightId,
  setScrollHighlightId,
] = React.useState<
  string | null
>(null);
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
const scrollToMessage = (
  targetId: string
) => {
  const targetIndex =
    messages.findIndex(
      (m) =>
        String(m._id) ===
        String(targetId)
    );

  if (
    targetIndex === -1
  ) {
    return;
  }

  flatListRef.current?.scrollToIndex(
    {
      index:
        targetIndex,

      animated: true,

      viewPosition:
        0.5,
    }
  );
setScrollHighlightId(
  targetId
);

setTimeout(() => {
  setScrollHighlightId(
    null
  );
}, 1200);
};

  useEffect(() => {
    if (
      messages?.length
    ) {
      onNewMessage();
    }
  }, [messages]);

  const editMessage =
  useMutation(
    api.messages.index
      .editMessage
  );

const deleteMessage =
  useMutation(
    api.messages.index
      .deleteMessage
  );

  const renderItem = useCallback(
  ({ item, index }: any) => (
    <MessageRenderer
      item={item}
      index={index}
      isDeleting={deletingIds.includes(
        item._id
      )}
      messages={messages}
      currentUserId={
        currentUserId
      }
      theme={theme}
      highlightId={
        scrollHighlightId ||
        highlightedMessageId ||
        undefined
      }
      onReply={onReply}
      onReact={async (msg) => {
        await toggleReaction({
          messageId: msg._id,
          reaction: "❤️",
        });
      }}
      onLongPress={(msg) => {
        highlightMessage(msg._id);

        openReaction(msg);
      }}
      onScrollTo={
        scrollToMessage
      }
    />
  ),
  [
    deletingIds,
    messages,
    currentUserId,
    theme,
    scrollHighlightId,
    highlightedMessageId,
    onReply,
    toggleReaction,
    highlightMessage,
    openReaction,
  ]
);

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
      keyboardShouldPersistTaps="always"
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
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
              color: "#e8dddd",

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


        onDelete={async (msg) => {
  try {
    setDeletingIds(
      (prev) => [
        ...prev,
        msg._id,
      ]
    );

    setTimeout(
      async () => {
        await deleteMessage(
          {
            messageId:
              msg._id,
          }
        );

        setDeletingIds(
          (prev) =>
            prev.filter(
              (id) =>
                id !==
                msg._id
            )
        );
      },
      260
    );
  } catch (e: any) {
    alert(
      e.message
    );
  }
}}
        onCopy={onCopy}
onEdit={onEdit}
        toggleReaction={
          toggleReaction
        }

        onPin={onPin}

pinnedMessageId={
  pinnedMessageId
}
      />
    </View>
  );
}