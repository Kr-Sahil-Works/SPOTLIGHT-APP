import React from "react";

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

  messages: any[];

  currentUserId?: string;

  theme: any;

  highlightId?: string;

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
};

export default function MessageRenderer({
  item,

  index,

  messages,

  currentUserId,

  theme,

  highlightId,

  onReply,

  onReact,

  onLongPress,

  onScrollTo,
}: Props) {
const previous =
  messages[index - 1];

const next =
  messages[index + 1];

    const showDate =
  shouldShowDate(
    item,
    previous
  );

const dateLabel =
  formatMessageDate(
    item.createdAt
  );

  const grouped =
    isGroupedMessage(
      item,
      next
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
      onReact={onReact}
      onLongPress={
        onLongPress
      }
      onScrollTo={
        onScrollTo
      }
    />
  </>
);
}