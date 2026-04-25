import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";

export default function useChat(userId: Id<"users">) {
  const [text, setText] = useState("");

  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [reactionMsg, setReactionMsg] = useState<any>(null);
  const [replyMsg, setReplyMsg] = useState<any>(null);

  const [editModal, setEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  const [editText, setEditText] = useState("");

  const tapRef = useRef<any>({});
  const flatListRef = useRef<any>(null);

  /* 🔥 QUERIES */
  const data = useQuery(api.messages.getMessages, {
    userId,
    limit: 20,
  });

  const typing = useQuery(api.messages.getTyping, { userId });

  const user = useQuery(api.users.getUserProfile, {
    id: userId,
  });

  /* 🔥 MUTATIONS */
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const editMessage = useMutation(api.messages.editMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const setChatTheme = useMutation(api.messages.setChatTheme);
  const setTyping = useMutation(api.messages.setTyping);
  const markAsSeen = useMutation(api.messages.markAsSeen);

  const [optimisticMsgs, setOptimisticMsgs] = useState<any[]>([]);
const real = data?.messages || [];

const messages = [
  ...real,
  ...optimisticMsgs.filter(
    (o) => !real.some((r) => r.text === o.text && r.createdAt - o.createdAt < 2000)
  ),
];

  const currentUserId = data?.currentUserId;

  /* 🔥 MARK SEEN */
  useEffect(() => {
    if (!userId) return;
    markAsSeen({ userId });
  }, [messages.length]);

  /* 🔥 TYPING HANDLER */
  const typingTimeout = useRef<any>(null);

  const handleTyping = (t: string) => {
    setText(t);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    setTyping({
      receiverId: userId,
      isTyping: true,
    });

    typingTimeout.current = setTimeout(() => {
      setTyping({
        receiverId: userId,
        isTyping: false,
      });
    }, 800);
  };

  /* 🔥 SEND MESSAGE */
const handleSend = async () => {
  if (!text.trim().length) return;

  const messageText = text.trim();
  setText("");

  const tempId = Date.now().toString();

  const fakeMsg = {
    _id: tempId,
    text: messageText,
    senderId: currentUserId,
    createdAt: Date.now(),
    optimistic: true,
  };

  setOptimisticMsgs((p) => [...p, fakeMsg]);

  try {
    await sendMessage({
      receiverId: userId,
      text: messageText,
      replyTo: replyMsg?._id,
      replyToText: replyMsg?.text,
    });
  } catch (e) {
    console.log(e);
  }

  setTyping({
    receiverId: userId,
    isTyping: false,
  });

  setReplyMsg(null);
};

  /* 🔥 DELETE (CLEAN - NO UNDO) */
  const handleDelete = async (msg: any) => {
    if (!msg?._id) return;

    await deleteMessage({ messageId: msg._id });
  };

  return {
    text,
    setText: handleTyping,

    selectedMsg,
    setSelectedMsg,

    reactionMsg,
    setReactionMsg,

    replyMsg,
    setReplyMsg,

    editModal,
    setEditModal,

    deleteConfirm,
    setDeleteConfirm,

    infoModal,
    setInfoModal,

    editText,
    setEditText,

    tapRef,
    flatListRef,

    messages,
    currentUserId,
    user,
    typing,

    handleSend,
    handleDelete,
    toggleReaction,
    editMessage,
    setChatTheme,
  };
}