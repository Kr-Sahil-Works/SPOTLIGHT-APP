import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useEffect, useRef, useState } from "react";
import TypingDots from "../../components/TypingDots";
import {
  DeleteModal,
  EditModal,
  InfoModal,
  MenuModal,
} from "./_Modals";
import MessageItem from "./MessageItem";
import ReactionBar from "./ReactionBar";
import useChat from "./useChat";
// ADD THIS IMPORT

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
  { bg: "#090000", bubbleMe: "#FF3B3B", bubbleOther: "#1F1F1F", header: "#140000" },
  { bg: "#0f1702", bubbleMe: "#6dae05", bubbleOther: "#7e941d", header: "#355705" },
  { bg: "#000c1d", bubbleMe: "#3B82F6", bubbleOther: "#000916", header: "#000814" },
  { bg: "#190022", bubbleMe: "#9539eb", bubbleOther: "#1A1625", header: "#14001c" },
  { bg: "#00121c", bubbleMe: "#22D3EE", bubbleOther: "#013359", header: "#0c2533" },
  { bg: "#140612", bubbleMe: "#ee2292", bubbleOther: "#232323", header: "#0f040c" },
  { bg: "#080808", bubbleMe: "#000000", bubbleOther: "#181818", header: "#050505" },
];
  
const [highlightId, setHighlightId] = useState<string | null>(null);
const [themeIndex, setThemeIndex] = useState(0);
const wmOpacity = useRef(new Animated.Value(0)).current;
const [wmText, setWmText] = useState("");



const showWatermark = (text: string) => {
  setWmText(text);

  Animated.sequence([
    Animated.timing(wmOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.delay(1200),
    Animated.timing(wmOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }),
  ]).start();
};

useEffect(() => {
  if (user?.themeIndex !== undefined) {
    setThemeIndex(user.themeIndex);
  }
}, [user]);


  const theme = themes[themeIndex];

  /* 🎬 SMOOTH THEME ANIMATION */
  const bgAnim = useRef(new Animated.Value(0)).current;

const sendAnim = useRef(new Animated.Value(1)).current;



const animateSend = () => {
  sendAnim.setValue(0.8);

  Animated.spring(sendAnim, {
    toValue: 1,
    stiffness: 200,
    damping: 15,
    useNativeDriver: true,
  }).start();
};
const changeTheme = async () => {
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

    showWatermark(`Theme changed 🎨`);
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


const openInstagram = async () => {
  const url = "instagram://direct/inbox";
  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    Linking.openURL(url);
  } else {
    Linking.openURL("https://instagram.com/direct/inbox/");
  }
};



 return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.bg }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
 keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 40}
  >
    <View style={{ flex: 1 }}>

      {/* 🔥 HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
          backgroundColor: theme.header,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={
            user?.image
              ? { uri: user.image }
              : require("@/assets/images/iconbg.png")
          }
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            marginLeft: 10,
          }}
        />

        <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
          {user?.fullname || "User"}
        </Text>

        <View style={{ marginLeft: "auto", flexDirection: "row" }}>
          <TouchableOpacity onPress={openInstagram}>
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={changeTheme} style={{ marginLeft: 14 }}>
            <Ionicons name="color-palette" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WATERMARK */}
      <Animated.View
        style={{
          position: "absolute",
          top: 80,
          alignSelf: "center",
          opacity: wmOpacity,
          backgroundColor: "rgba(0,0,0,0.4)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          zIndex: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 12 }}>{wmText}</Text>
      </Animated.View>

      {/* 🔥 MAIN CONTENT */}
      <View style={{ flex: 1 }}>

        {/* 💬 MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => String(i._id)}
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 10,
          }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }, 50);
          }}
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
        {typing && <TypingDots />}

        {/* 🔄 UNDO */}
        {lastDeleted && (
          <View
            style={{
              backgroundColor: "#222",
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
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
          <View
            style={{
              padding: 8,
              backgroundColor: "#222",
              borderLeftWidth: 3,
              borderLeftColor: "#4ade80",
            }}
          >
            <Text style={{ color: "#aaa" }}>
              Replying to: {replyMsg.text}
            </Text>

            <TouchableOpacity onPress={() => setReplyMsg(null)}>
              <Text style={{ color: "#f87171" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ✅ INPUT (FIXED BOTTOM) */}
      <View
        style={{
          borderTopWidth: 0.5,
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#777"
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}
          />

          <TouchableOpacity
            disabled={!text.length}
            onPress={() => {
              if (!text.length) return;
              animateSend();
              handleSend();
            }}
            activeOpacity={0.7}
          >
            <Animated.View
              style={{
                marginLeft: 10,
                transform: [{ scale: sendAnim }],
                opacity: text.length ? 1 : 0,
              }}
            >
              <View
                style={{
                  backgroundColor: theme.bubbleMe,
                  padding: 10,
                  borderRadius: 50,
                }}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODALS */}
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