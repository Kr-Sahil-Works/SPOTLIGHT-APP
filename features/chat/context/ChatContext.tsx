import React, {
    createContext,
    useContext,
} from "react";

import { Message } from "@/types/chat";

type ChatContextType = {
  currentUserId?: string;

  messages: Message[];
};

const ChatContext =
  createContext<
    ChatContextType | undefined
  >(undefined);

type Props = {
  currentUserId?: string;

  messages: Message[];

  children: React.ReactNode;
};

export function ChatProvider({
  currentUserId,

  messages,

  children,
}: Props) {
  return (
    <ChatContext.Provider
      value={{
        currentUserId,

        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context =
    useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
}