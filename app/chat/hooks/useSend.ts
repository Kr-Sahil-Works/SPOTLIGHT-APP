import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/chat";
import { useMutation } from "convex/react";
import { useState } from "react";

type UseSendReturn = {
  text: string;
  setText: (v: string) => void;
  handleSend: () => Promise<void>;
};

export default function useSend(
  userId: Id<"users">,
  replyMsg: Message | null,
  setReplyMsg: (msg: Message | null) => void
): UseSendReturn {
  const [text, setText] = useState<string>("");

  const sendMessage = useMutation(
    api.messages.index.sendMessage
  );

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setText("");

    try {
      await sendMessage({
        receiverId: userId, // ✅ correct type

        text: messageText,

        replyTo: replyMsg?._id as Id<"messages"> | undefined, // ✅ FIX

        replyToText: replyMsg?.text,
      });
    } catch (e) {
      console.log(e);
    }

    setReplyMsg(null);
  };

  return { text, setText, handleSend };
}