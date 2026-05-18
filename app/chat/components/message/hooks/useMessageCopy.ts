import {
    useCallback,
} from "react";

import * as Clipboard from "expo-clipboard";

import {
    Message,
} from "@/types/chat";

export default function useMessageCopy() {
  const copyMessage =
    useCallback(
      async (
        msg: Message
      ) => {
        if (!msg?.text) {
          return;
        }

        await Clipboard.setStringAsync(
          msg.text
        );
      },
      []
    );

  return copyMessage;
}