import React, {
  useCallback,
  useEffect
} from "react";

import {
  ActivityIndicator,
  View
} from "react-native";

import {
  FlashList,
} from "@shopify/flash-list";

import {
  MessageRenderer,
} from "./renderers";

import NewMessagesBadge from "./NewMessagesBadge";

import {
  OverlayRenderer,
} from "./overlays";

import ReactionsModal from "../modals/ReactionsModal";

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

  isOnline: boolean;

  currentUserId?: string;

  theme: any;

  highlightId?: string;

  loadingMore?: boolean;
  isChatOpen?: boolean;

  loadOlder?: () => void;

  pinnedMessageId?: string;

  flatListRef?: any;
  otherUserAvatar?: string;

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

  isOnline,
isChatOpen,
  highlightId,
  onScrollTo,

  otherUserAvatar,

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
  reactionsModalVisible,
  setReactionsModalVisible,
] = React.useState(
  false
);

const [
  selectedReactions,
  setSelectedReactions,
] = React.useState<any[]>(
  []
);

const [
  selectedMessage,
  setSelectedMessage,
] = React.useState<any>(
  null
);

const initialScrollDone =
  React.useRef(false);

const [
  scrollHighlightId,
  setScrollHighlightId,
] = React.useState<
  string | null
>(null);
  const {

    onScroll,

    scrollToBottom,

    onNewMessage,

    showScrollBtn,

    newMsgCount,

    scrollOffsetRef,

    isAtBottom
  } = useChatScroll(
    flatListRef
  );

useKeyboardScroll(
  flatListRef
);

useAutoScroll(
  messages,
  flatListRef,
  isAtBottom
);

  useThemeScrollSync(
    flatListRef,
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

const firstLoadRef =
  React.useRef(true);

const lastMessageIdRef =
  React.useRef<
    string | null
  >(null);

useEffect(() => {
  if (firstLoadRef.current) {
    firstLoadRef.current =
      false;

    lastMessageIdRef.current =
      messages[
        messages.length - 1
      ]?._id ?? null;

    return;
  }

  const latestId =
    messages[
      messages.length - 1
    ]?._id;

  if (
    !latestId ||
    latestId ===
      lastMessageIdRef.current
  ) {
    return;
  }

lastMessageIdRef.current =
  latestId;

onNewMessage();
}, [messages.length]);


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
      isOnline={isOnline}
      isChatOpen={
  isChatOpen
}
   onOpenReactions={(
  msg
) => {
  setSelectedMessage(
    msg
  );

  setSelectedReactions(
    msg.reactions || []
  );

  setReactionsModalVisible(
    true
  );
}}
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
      position: "absolute",
      top: 12,
      alignSelf: "center",
      zIndex: 999,

      width: 34,
      height: 34,

      borderRadius: 17,

      backgroundColor:
        "#1c1c1ecc",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <ActivityIndicator
      size="small"
      color="#ffffff"
    />
  </View>
)}

      <FlashList
      keyboardShouldPersistTaps="always"
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        drawDistance={
          800
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
        onLoad={() => {
  if (
    initialScrollDone.current
  ) {
    return;
  }

  initialScrollDone.current =
    true;

requestAnimationFrame(() => {
  flatListRef.current?.scrollToEnd({
    animated: false,
  });
});
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
  <NewMessagesBadge
    count={newMsgCount}
    theme={theme}
    avatar={otherUserAvatar}
    onPress={scrollToBottom}
  />
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

   <ReactionsModal
  visible={
    reactionsModalVisible
  }
  reactions={
    selectedReactions
  }
  currentUserId={
    currentUserId
  }
  messageId={
    selectedMessage?._id
  }
  isOnline={isOnline}
  toggleReaction={
    toggleReaction
  }
  onClose={() =>
    setReactionsModalVisible(
      false
    )
  }
/>
    </View>
  );
}