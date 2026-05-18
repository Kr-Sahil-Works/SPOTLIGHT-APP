import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Message } from "@/types/chat";

type OverlayType =
  | "menu"
  | "reaction"
  | "delete"
  | null;

type OverlayState = {
  type: OverlayType;
  message: Message | null;
};

type ChatOverlayContextType = {
  overlay: OverlayState;

  highlightedMessageId: string | null;

  openMenu: (msg: Message) => void;

  openReaction: (
    msg: Message
  ) => void;

  openDelete: (
    msg: Message
  ) => void;

  highlightMessage: (
    id: string | null
  ) => void;

  closeOverlay: () => void;
};

const ChatOverlayContext =
  createContext<
    ChatOverlayContextType | undefined
  >(undefined);

export function ChatOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [overlay, setOverlay] =
    useState<OverlayState>({
      type: null,
      message: null,
    });

  const [
    highlightedMessageId,
    setHighlightedMessageId,
  ] = useState<string | null>(
    null
  );

  const openMenu = useCallback(
    (msg: Message) => {
      setOverlay({
        type: "menu",
        message: msg,
      });
    },
    []
  );

  const openReaction =
    useCallback((msg: Message) => {
      setOverlay({
        type: "reaction",
        message: msg,
      });
    }, []);

  const openDelete = useCallback(
    (msg: Message) => {
      setOverlay({
        type: "delete",
        message: msg,
      });
    },
    []
  );

const closeOverlay =
  useCallback(() => {
    setOverlay({
      type: null,
      message: null,
    });

    setHighlightedMessageId(
      null
    );
  }, []);

  const highlightMessage =
    useCallback((id: string | null) => {
      setHighlightedMessageId(id);
    }, []);

  const value = useMemo(
    () => ({
      overlay,

      highlightedMessageId,

      openMenu,

      openReaction,

      openDelete,

      closeOverlay,

      highlightMessage,
    }),
    [
      overlay,
      highlightedMessageId,

      openMenu,
      openReaction,
      openDelete,

      closeOverlay,
      highlightMessage,
    ]
  );

  return (
    <ChatOverlayContext.Provider
      value={value}
    >
      {children}
    </ChatOverlayContext.Provider>
  );
}

export function useChatOverlay() {
  const context = useContext(
    ChatOverlayContext
  );

  if (!context) {
    throw new Error(
      "useChatOverlay must be used inside ChatOverlayProvider"
    );
  }

  return context;
}