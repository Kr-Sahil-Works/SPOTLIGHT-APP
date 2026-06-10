import {
    useCallback,
} from "react";

import {
    useOverlay,
} from "./useOverlay";

import {
    Message,
} from "@/types/chat";

export default function useMessageMenu() {
  const {
    openMenu,
  } = useOverlay();

  const showMenu =
    useCallback(
      (msg: Message) => {
        openMenu(msg);
      },
      [openMenu]
    );

  return {
    showMenu,
  };
}