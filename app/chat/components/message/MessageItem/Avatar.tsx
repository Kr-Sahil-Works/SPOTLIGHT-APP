import { AppImage } from "@/shared/ui/AppImage";
import React, { memo } from "react";
import { View } from "react-native";

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
  <AppImage
    uri={avatar?.trim() || undefined}
    source={
      avatar?.trim()
        ? undefined
        : require("@/assets/images/icons/iconbg.png")
    }
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 6,
    }}
    contentFit="cover"
  />
);
}

export default memo(Avatar);