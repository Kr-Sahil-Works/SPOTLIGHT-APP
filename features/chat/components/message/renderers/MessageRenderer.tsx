import React, {
  useMemo
} from "react";

import MessageItem from "../MessageItem/MessageItem";

import {
  formatMessageDate,
} from "../utils/messageDate";

import {
  shouldShowDate,
} from "../utils/shouldShowDate";


import { Text, View } from "react-native";
import {
  isGroupedMessage,
} from "../utils";

type Props = {
  item: any;

  index: number;

  isOnline: boolean;

  messages: any[];

  currentUserId?: string;

  theme: any;

  highlightId?: string;

  isDeleting?: boolean;

  onReply: (
    msg: any
  ) => void;

  onReact: (
    msg: any
  ) => void;

  onLongPress: (
    msg: any,
    ref: any,
    px?: number,
    py?: number
  ) => void;

  onScrollTo: (
    id: string
  ) => void;

  onOpenReactions?: (
  msg: any
) => void;

};

function MessageRenderer({
  item,

  index,

  isOnline,

  messages,

  currentUserId,

  theme,

  highlightId,

  isDeleting,

  onReply,

  onReact,

  onLongPress,

onScrollTo,

onOpenReactions,
}: Props) {
const previous = useMemo(
  () => messages[index - 1],
  [messages, index]
);

const next = useMemo(
  () => messages[index + 1],
  [messages, index]
);

const showDate = useMemo(
  () =>
    shouldShowDate(
      item,
      previous
    ),
  [item, previous]
);

const dateLabel = useMemo(
  () =>
    formatMessageDate(
      item.createdAt
    ),
  [item.createdAt]
);

const grouped = useMemo(
  () =>
    isGroupedMessage(
      item,
      next
    ),
  [item, next]
);

 return (
  <>
    {showDate && (
      <View
        style={{
          alignItems: "center",

          marginVertical: 14,
        }}
      >
        <View
          style={{
            backgroundColor:
              "rgba(255,255,255,0.08)",

            paddingHorizontal: 12,

            paddingVertical: 5,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color:
                "#ddd",

              fontSize: 12,

              fontWeight:
                "600",
            }}
          >
            {dateLabel}
          </Text>
        </View>
      </View>
    )}

    <MessageItem
      item={item}
      isOnline={isOnline}
      isMe={
        item.senderId ===
        currentUserId
      }
      theme={theme}
      avatar={
        item.senderImage || ""
      }
      isGrouped={grouped}
isHighlighted={
  Boolean(
    highlightId &&
    highlightId ===
      item._id
  )
}
      onReply={onReply}
      isDeleting={
  isDeleting
}
      onReact={onReact}
      onLongPress={
        onLongPress
      }
      onScrollTo={
        onScrollTo
      }
      onOpenReactions={
  onOpenReactions
}
    />
  </>
);
}

export default MessageRenderer;