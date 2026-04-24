import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import {
  DeleteModal,
  EditModal,
  InfoModal,
  MenuModal,
} from "./_Modals";
import MessageItem from "./MessageItem";
import ReactionBar from "./ReactionBar";
import useChat from "./useChat";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  if (!id || typeof id !== "string") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>Invalid chat</Text>
      </View>
    );
  }

  const userId = id as unknown as Id<"users">;

  const {
    text, setText,
    sending,
    messages,
    currentUserId,
    user,
    typing,
    reactionMsg, setReactionMsg,
    selectedMsg, setSelectedMsg,
    deleteConfirm, setDeleteConfirm,
    editModal, setEditModal,
    infoModal, setInfoModal,
    editText, setEditText,
    lastDeleted, setLastDeleted,
    restoreMessage,
    tapRef,
   setChatTheme,
    flatListRef,
    handleSend,
    handleDelete,
    toggleReaction,
    editMessage,
    replyMsg, setReplyMsg,
  } = useChat(userId);

  /* 🎨 THEMES */
  const themes = [
    { bg: "#090000", bubbleMe: "#FF3B3B", bubbleOther: "#1F1F1F" },
    { bg: "#0f1702", bubbleMe: "#6dae05", bubbleOther: "#7e941d" },
    { bg: "#000c1d", bubbleMe: "#3B82F6", bubbleOther: "#000916" },
    { bg: "#190022", bubbleMe: "#9539eb", bubbleOther: "#1A1625" },
    { bg: "#00121c", bubbleMe: "#22D3EE", bubbleOther: "#013359" },
    { bg: "#140612", bubbleMe: "#ee2292", bubbleOther: "#d50c4c" },
  ];
const [highlightId, setHighlightId] = useState<string | null>(null);
const [themeIndex, setThemeIndex] = useState(user?.themeIndex || 0);
  const theme = themes[themeIndex];

  /* 🎬 SMOOTH THEME ANIMATION */
  const bgAnim = useRef(new Animated.Value(0)).current;

const changeTheme = () => {
  const next = (themeIndex + 1) % themes.length;

  Animated.timing(bgAnim, {
    toValue: 1,
    duration: 250,
    useNativeDriver: false,
  }).start(async () => {
    setThemeIndex(next);
    bgAnim.setValue(0);

    await setChatTheme({
      userId,
      themeIndex: next,
    });
  });
};

  const scaleAnim = useRef(new Animated.Value(1)).current;
const handleScrollTo = (id: string) => {
  const index = messages.findIndex((m) => m._id === id);
  if (index === -1) return;

  flatListRef.current?.scrollToIndex({
    index,
    animated: true,
  });

  setHighlightId(id);

  setTimeout(() => {
    setHighlightId(null);
  }, 1200);
};

const toggleOnlineVisibility = useMutation(api.messages.toggleOnlineVisibility);


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 30}
    >
      <View style={{ flex: 1 }}>

        {/* 🔥 HEADER */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
          backgroundColor: "#000",
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Image
            source={user?.image ? { uri: user.image } : require("@/assets/images/iconbg.png")}
            style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 10 }}
          />

          <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
            {user?.fullname || "User"}
          </Text>

          <View style={{ marginLeft: "auto", flexDirection: "row" }}>
            <Ionicons name="call-outline" size={24} color="#fff" />
<TouchableOpacity
  onPress={async () => {
    await toggleOnlineVisibility({});
  }}
  style={{ marginLeft: 14 }}
>
  <Ionicons name="eye-off-outline" size={22} color="#aaa" />
</TouchableOpacity>
            <TouchableOpacity onPress={changeTheme} style={{ marginLeft: 14 }}>
              <Ionicons name="color-palette" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        

        {/* 💬 MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(i) => String(i._id)}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
   <MessageItem
  item={item}
  isMe={item.senderId === currentUserId}
  theme={theme}
  avatar={user?.image || ""}
  onScrollTo={handleScrollTo}
highlightId={highlightId}
onReply={(msg: any) => setReplyMsg(msg)}

  onLongPress={(msg: any) => {
    setReactionMsg(null);
    setSelectedMsg(msg);
  }}

  onReact={(msg: any) => {
    if (!tapRef.current[msg._id]) {
      tapRef.current[msg._id] = { count: 0, timer: null };
    }

    const t = tapRef.current[msg._id];
    t.count++;

    if (t.timer) clearTimeout(t.timer);

    t.timer = setTimeout(() => {
      const taps = t.count;

      if (taps === 2) {
        const already = msg.reactions?.includes("❤️");

        if (!already) {
          toggleReaction({
            messageId: msg._id,
            reaction: "❤️",
          });
        }
      }

      if (taps === 3) {
        setReactionMsg(msg);
      }

      tapRef.current[msg._id] = { count: 0, timer: null };
    }, 250);
  }}
/>
          )}
        />

        {/* ✍️ TYPING */}
        {typing && (
          <Text style={{ color: "#888", paddingLeft: 12 }}>
            {user?.fullname} typing...
          </Text>
        )}

        {/* 🔄 UNDO */}
   {lastDeleted && (
  <View style={{
    backgroundColor: "#222",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  }}>
    <Text style={{ color: "#fff" }}>Message deleted</Text>

    <TouchableOpacity
      onPress={async () => {
        await restoreMessage({ message: lastDeleted });
        setLastDeleted(null);
      }}
    >
      <Text style={{ color: "#4ade80" }}>UNDO</Text>
    </TouchableOpacity>
  </View>
)}

        {/* 🔁 REPLY BAR */}
        {replyMsg && (
          <View style={{
            padding: 8,
            backgroundColor: "#222",
            borderLeftWidth: 3,
            borderLeftColor: "#4ade80",
          }}>
            <Text style={{ color: "#aaa" }}>
              Replying to: {replyMsg.text}
            </Text>

            <TouchableOpacity onPress={() => setReplyMsg(null)}>
              <Text style={{ color: "#f87171" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ✏️ GLASS INPUT */}
        <View style={{
          flexDirection: "row",
          padding: 10,
        }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#777"
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "#fff",
              borderRadius: 25,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          />

          <TouchableOpacity onPress={handleSend}>
            {sending ? (
              <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />
            ) : (
              <View style={{
                marginLeft: 10,
                backgroundColor: "rgba(255,255,255,0.12)",
                padding: 10,
                borderRadius: 22,
              }}>
                <Ionicons name="send" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ReactionBar
          reactionMsg={reactionMsg}
          setReactionMsg={setReactionMsg}
          toggleReaction={toggleReaction}
        />

        <DeleteModal
          visible={deleteConfirm && !!selectedMsg}
          selectedMsg={selectedMsg}
          deleteMessage={handleDelete}
          setSelectedMsg={setSelectedMsg}
          setDeleteConfirm={setDeleteConfirm}
          setLastDeleted={setLastDeleted}
        />

        <EditModal
          visible={editModal}
          scaleAnim={scaleAnim}
          editText={editText}
          setEditText={setEditText}
          selectedMsg={selectedMsg}
          setSelectedMsg={setSelectedMsg}
          setEditModal={setEditModal}
          editMessage={editMessage}
        />

        <InfoModal
          visible={infoModal}
          selectedMsg={selectedMsg}
          setInfoModal={setInfoModal}
        />

        <MenuModal
          selectedMsg={selectedMsg}
          reactionMsg={reactionMsg}
          scaleAnim={scaleAnim}
          setSelectedMsg={setSelectedMsg}
          setEditText={setEditText}
          setEditModal={setEditModal}
          setDeleteConfirm={setDeleteConfirm}
          setInfoModal={setInfoModal}
          currentUserId={currentUserId}
        />
      </View>
    </KeyboardAvoidingView>
  );
}