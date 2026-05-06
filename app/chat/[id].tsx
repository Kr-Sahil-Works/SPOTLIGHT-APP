import { useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

import { CHAT_THEMES } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/chat";
import { useState } from "react";
import { Animated } from "react-native";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import MessageList from "./components/MessageList";
import ThemeModal from "./components/ThemeModal";
import useMessages from "./hooks/useMessages";
import useSend from "./hooks/useSend";
import useTheme from "./hooks/useTheme";
import MenuModal from "./modals/MenuModal";


export default function ChatScreen() {

const params = useLocalSearchParams<{ id: string }>();

const userId = params.id as Id<"users">;

  // ✅ STRICT TYPES
  const [replyMsg, setReplyMsg] = useState<Message | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [reactionMsg, setReactionMsg] = useState<Message | null>(null);

  const { applyTheme } = useTheme();

const [themeOpen, setThemeOpen] = useState(false);
const [previewThemeIndex, setPreviewThemeIndex] = useState<number | null>(null);

  if (!userId) {
    return <Text>Invalid chat</Text>;
  }



const {
  messages,
  currentUserId,
  themeIndex,
  isLoading,
} = useMessages(userId);

const activeThemeIndex =
  previewThemeIndex !== null ? previewThemeIndex : themeIndex;
const theme =
  CHAT_THEMES[activeThemeIndex ?? 0] ||
  CHAT_THEMES[0];







  const { text, setText, handleSend } =
    useSend(userId, replyMsg, setReplyMsg);

  // ✅ STRICT DOUBLE TAP
  const handleDoubleTap = (msg: Message) => {
    const reactions = msg.reactions ?? [];

    const hasHeart = reactions.some(
      (r) => r.value === "❤️"
    );

    const updatedReactions = hasHeart
      ? reactions.filter((r) => r.value !== "❤️")
      : [...reactions, { value: "❤️" }];

    const updatedMsg: Message = {
      ...msg,
      reactions: updatedReactions,
    };

    setSelectedMsg(updatedMsg);
  };

  return (
<View style={{ flex: 1 }}>

  {/* 🔥 CURRENT THEME */}
  <Animated.View
  style={{
    flex: 1,
    backgroundColor: theme.background,
  }}
>
      {/* 🔝 HEADER */}
      
<ChatHeader
  userId={userId}
  onOpenTheme={() => setThemeOpen(true)}
  theme={theme} // ✅ ADD
/>

<ThemeModal
  visible={themeOpen}
  selectedIndex={activeThemeIndex}
  onPreview={(i: number) => setPreviewThemeIndex(i)} // 🔥 live preview
  onClose={() => {
    setPreviewThemeIndex(null); // 🔥 reset preview
    setThemeOpen(false);
  }}
  onApply={(i: number) => {
    applyTheme(userId, i); // 🔥 save to DB
    setPreviewThemeIndex(null);
    setThemeOpen(false);
  }}
/>

      {/* 🔥 MAIN */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={56}
      >
        <View style={{ flex: 1 }}>
          {/* 💬 MESSAGES */}
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <Text style={{ color: "#fff", padding: 16 }}>
                Loading...
              </Text>
            ) : messages.length === 0 ? (
              <Text style={{ color: "#aaa", padding: 16 }}>
                Start conversation
              </Text>
            ) : (
              <MessageList
                messages={messages}
                theme={theme}
                highlightId={reactionMsg?._id}
                currentUserId={currentUserId}
                onReply={setReplyMsg}
                onDoubleTap={handleDoubleTap}
                onLongPress={(msg: Message) => {
                  Keyboard.dismiss();

                  setSelectedMsg(msg);

                  setReactionMsg({
                    ...msg,
                    x: msg.x,
                    y: msg.y,
                    width: msg.width,
                    height: msg.height,
                  });
                }}
              />
            )}

            {/* ✅ MODAL */}
            <MenuModal
              selectedMsg={selectedMsg}
              reactionMsg={reactionMsg}
              setReactionMsg={setReactionMsg}
              setSelectedMsg={(v: Message | null) => {
                setSelectedMsg(v);
                if (!v) setReactionMsg(null);
              }}
              setReplyMsg={setReplyMsg}
              setDeleteConfirm={() => {}}
              currentUserId={currentUserId}
            />
          </View>

          {/* ✅ REPLY BAR */}
          {replyMsg && (
            <View
              style={{
                padding: 8,
                backgroundColor: theme.inputBg,
                borderLeftColor: theme.bubbleMe,
                borderLeftWidth: 3,
                
              }}
            >
              <Text style={{ color: theme.headerText }}>
                Replying: {replyMsg.text}
              </Text>

              <Text
                onPress={() => setReplyMsg(null)}
                style={{ color: "#f87171", marginTop: 4 }}
              >
                Cancel
              </Text>
            </View>
          )}

          {/* ⌨️ INPUT */}
       <ChatInput
  text={text}
  setText={setText}
  onSend={handleSend}
  theme={theme}
/>
        </View>
      </KeyboardAvoidingView>
</Animated.View>
</View>
  );
}