import React from "react";

import {
    Image,
    View,
} from "react-native";

type Props = {
  avatar?: string;

  isMe: boolean;

  isGrouped?: boolean;
};

function Avatar({
  avatar,
  isMe,
  isGrouped,
}: Props) {
  if (isMe || isGrouped) {
    return (
      <View
        style={{
          width: 34,
        }}
      />
    );
  }

  return (
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
  );
}

export default React.memo(Avatar);