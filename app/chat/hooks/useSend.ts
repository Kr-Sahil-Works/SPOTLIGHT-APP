import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/chat";

import {
  getNetworkState,
} from "@/lib/network";
import { useMutation } from "convex/react";
import { useState } from "react";

type UseSendReturn = {
  text: string;

  setText: (
    v: string
  ) => void;

  handleSend: () => Promise<void>;
};

export default function useSend(
  userId: Id<"users">,

  replyMsg: Message | null,

  setReplyMsg: (
    msg: Message | null
  ) => void,

  editingMessage: any,

  setEditingMessage: any
): UseSendReturn {
  const [text, setText] =
    useState<string>("");

    const [sending,
  setSending] =
  useState(false);


  const sendMessage =
    useMutation(
      api.messages.index
        .sendMessage
    );

  const editMessage =
    useMutation(
      api.messages.index
        .editMessage
    );

  const handleSend =
  
    async () => {
      if (sending)
  return;

setSending(true);

const online =
  await getNetworkState();

if (!online) {
  setSending(false);

  alert(
    "Reconnect to send messages"
  );

  return;
}
      if (!text.trim())
        return;

      const messageText =
        text.trim();

      setText("");

      try {
        /* ✅ EDIT MODE */
        if (
          editingMessage
        ) {
          await editMessage(
            {
              messageId:
                editingMessage._id,

              newText:
                messageText,
            }
          );

          setEditingMessage(
            null
          );

          return;
        }

        /* ✅ NORMAL SEND */
        await sendMessage({
          receiverId:
            userId,

          text: messageText,

          replyTo:
            replyMsg?._id as
              | Id<"messages">
              | undefined,

          replyToText:
            replyMsg?.text,
        });
      } catch (e) {
          setSending(false);
  console.log(e);

  alert(
    "Message failed. Check connection and try again."
  );
}

      setReplyMsg(null);
      setSending(false);
    };

  return {
    text,

    setText,

    handleSend,
  };
}