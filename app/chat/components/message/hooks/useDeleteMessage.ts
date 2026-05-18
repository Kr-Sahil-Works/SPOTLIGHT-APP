import {
    useCallback,
} from "react";

import {
    useOverlay,
} from "./useOverlay";

import {
    Message,
} from "@/types/chat";

export default function useDeleteMessage() {
  const {
    openDelete,
  } = useOverlay();

  const confirmDelete =
    useCallback(
      (msg: Message) => {
        openDelete(msg);
      },
      [openDelete]
    );

  return {
    confirmDelete,
  };
}