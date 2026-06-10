import {
    useCallback,
} from "react";

import {
    useOverlay,
} from "./useOverlay";

import {
    Message,
} from "@/types/chat";

export default function useMessageReaction() {
  const {
    openReaction,
  } = useOverlay();

  const reactToMessage =
    useCallback(
      (msg: Message) => {
        openReaction(msg);
      },
      [openReaction]
    );

  return {
    reactToMessage,
  };
}