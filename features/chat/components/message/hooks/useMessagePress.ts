import {
    useCallback,
} from "react";

import { Message } from "@/types/chat";

type Props = {
  item: Message;

  onReact: (
    msg: Message
  ) => void;

  onLongPress: (
    msg: Message,
    px?: number,
    py?: number
  ) => void;
};

export default function useMessagePress({
  item,

  onReact,

  onLongPress,
}: Props) {
  const handleDoubleTap =
    useCallback(() => {
      onReact(item);
    }, [item, onReact]);

  const handleLongPress =
    useCallback(
      (
        px?: number,
        py?: number
      ) => {
        onLongPress(
          item,
          px,
          py
        );
      },
      [
        item,
        onLongPress,
      ]
    );

  return {
    handleDoubleTap,

    handleLongPress,
  };
}