import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

export default function useChat(userId: Id<"users">) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [reactionMsg, setReactionMsg] = useState<any>(null);
  const [replyMsg, setReplyMsg] = useState<any>(null);

  const [editModal, setEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  const [editText, setEditText] = useState("");
  const [lastDeleted, setLastDeleted] = useState<any>(null);
  

  const tapRef = useRef<any>({});
  const flatListRef = useRef<any>(null);

  /* 🔥 QUERIES */
  const data = useQuery(api.messages.getMessages, {
    userId,
    limit: 20,
  });

  const typing = useQuery(api.messages.getTyping, {
    userId,
  });

  const user = useQuery(api.users.getUserProfile, {
    id: userId,
  });

  /* 🔥 MUTATIONS */
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.messages.setTyping);
  const setOnlineStatus = useMutation(api.messages.setOnlineStatus);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const restoreMessage = useMutation(api.messages.restoreMessage);
  const editMessage = useMutation(api.messages.editMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
const setChatTheme = useMutation(api.messages.setChatTheme);
  const markAsSeen = useMutation(api.messages.markAsSeen);

  const messages = data?.messages || [];
  const currentUserId = data?.currentUserId;

  useEffect(() => {
  if (!userId) return;

  setOnlineStatus({ isOnline: true });

  return () => {
    setOnlineStatus({ isOnline: false });
  };
}, []);

  /* 🔥 AUTO SCROLL */
useEffect(() => {
  if (!reactionMsg) {
    flatListRef.current?.scrollToEnd({ animated: true });
  }
}, [messages]);

  /* 🔥 KEYBOARD SCROLL */
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    return () => sub.remove();
  }, []);

  /* 🔥 TYPING STATUS */
 useEffect(() => {
  if (!userId) return;

  markAsSeen({ userId });
}, [messages]);

  /* 🔥 SEND MESSAGE */
  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);

    try {
    await sendMessage({
  receiverId: userId,
  text,
  replyTo: replyMsg?._id,
  replyToText: replyMsg?.text,
});

      setText("");
      setReplyMsg(null);

      setTyping({
        receiverId: userId,
        isTyping: false,
      });
    } catch (e) {
  console.log("CHAT ERROR:", e);
}

    setSending(false);
  };

  /* 🔥 DELETE WITH UNDO SUPPORT */
const handleDelete = async (msg: any) => {
  if (!msg?._id) return;

  setLastDeleted(msg);

  setTimeout(() => {
    setLastDeleted(null);
  }, 8000);

  await deleteMessage({
    messageId: msg._id,
  });
};

  return {
    /* STATE */
    text, setText,
    sending,
setChatTheme,
    selectedMsg, setSelectedMsg,
    reactionMsg, setReactionMsg,
    replyMsg, setReplyMsg,

    editModal, setEditModal,
    deleteConfirm, setDeleteConfirm,
    infoModal, setInfoModal,

    editText, setEditText,
    lastDeleted, setLastDeleted,

    tapRef,
    flatListRef,

    /* DATA */
    messages,
    currentUserId,
    user,
    typing,

    /* ACTIONS */
    handleSend,
    handleDelete,
    toggleReaction,
    editMessage,
    restoreMessage,
  };
}