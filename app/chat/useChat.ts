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
  const [lastDeleted, setLastDeleted] = useState<any>(null);

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
  const setOnlineStatus = useMutation(api.messages.setOnlineStatus);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const restoreMessage = useMutation(api.messages.restoreMessage);
  const editMessage = useMutation(api.messages.editMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const setChatTheme = useMutation(api.messages.setChatTheme);
  const markAsSeen = useMutation(api.messages.markAsSeen);

  const [optimisticMsgs, setOptimisticMsgs] = useState<any[]>([]);
const messages = [...optimisticMsgs, ...(data?.messages || [])];

  const currentUserId = data?.currentUserId;

  /* 🔥 ONLINE STATUS */
  useEffect(() => {
    if (!userId) return;

    setOnlineStatus({ isOnline: true });

    return () => {
      setOnlineStatus({ isOnline: false });
    };
  }, []);


  /* 🔥 MARK SEEN */
  useEffect(() => {
    if (!userId) return;
    markAsSeen({ userId });
  }, [messages]);

  /* 🔥 SEND MESSAGE (CLEAN) */
  const handleSend = async () => {
    if (!text.length) return;

    const messageText = text;
    setText(""); // ✅ instant clear

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

      setOptimisticMsgs((p) =>
        p.filter((m) => m._id !== tempId)
      );
    } catch (e) {
      console.log(e);
    }

    setReplyMsg(null);
  };

  /* 🔥 DELETE */
  const handleDelete = async (msg: any) => {
    if (!msg?._id) return;

    setLastDeleted(msg);

    setTimeout(() => {
      setLastDeleted(null);
    }, 8000);

    await deleteMessage({ messageId: msg._id });
  };

  return {
    text,
    setText,

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

    lastDeleted,
    setLastDeleted,

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
    restoreMessage,
    setChatTheme,
  };
}