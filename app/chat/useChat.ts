import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useRef, useState } from "react";

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

  // ✅ prevent double send
  const sendingRef = useRef(false);

  /* 🔥 QUERIES */
  const data = useQuery(api.messages.getMessages, {
    userId,
    limit: 20,
  });

  const typing = useQuery(api.messages.getTyping, { userId });

  const user = useQuery(api.users.getUserProfile, {
    id: userId,
  });

  // ✅ loading state (IMPORTANT)
  const isLoading = data === undefined;

  /* 🔥 MUTATIONS */
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const editMessage = useMutation(api.messages.editMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const setChatTheme = useMutation(api.messages.setChatTheme);
  const setTyping = useMutation(api.messages.setTyping);
  const markAsSeen = useMutation(api.messages.markAsSeen);

  /* 🔥 OPTIMISTIC */
  const [optimisticMsgs, setOptimisticMsgs] = useState<any[]>([]);
  const real = data?.messages ?? [];

  // ✅ auto remove optimistic when real arrives
  useEffect(() => {
    if (!real.length) return;

    setOptimisticMsgs((prev) =>
      prev.filter(
        (o) => !real.some((r) => r.clientId === o.clientId)
      )
    );
  }, [real]);
const messages = React.useMemo(() => {
  const merged = [...real];

  for (const o of optimisticMsgs) {
    const exists = real.find((r) => r.clientId === o.clientId);
    if (!exists) merged.push(o);
  }

  return merged;
}, [real, optimisticMsgs]);

  const currentUserId = data?.currentUserId;
  const themeIndex = data?.themeIndex ?? 0;

  /* 🔥 MARK SEEN */
  useEffect(() => {
    if (!userId || isLoading) return;
    markAsSeen({ userId });
  }, [messages.length, isLoading]);

  /* 🔥 TYPING */
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
    if (sendingRef.current) return;
    if (!text.trim().length) return;

    sendingRef.current = true;

    const messageText = text.trim();
    setText("");

    const clientId = Date.now().toString();

    const fakeMsg = {
      _id: clientId,
      clientId,
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
        clientId,
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

    setTimeout(() => {
      sendingRef.current = false;
    }, 300);
  };

  /* 🔥 DELETE */
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
    themeIndex,
    isLoading, // 🔥 IMPORTANT

    handleSend,
    handleDelete,
    toggleReaction,
    editMessage,
    setChatTheme,
  };
}