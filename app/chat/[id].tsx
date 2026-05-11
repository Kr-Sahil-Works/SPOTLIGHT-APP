import { useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View
} from "react-native";

import { CHAT_THEMES } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/chat";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  ImageBackground,
} from "react-native";


import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatSkeleton from "./components/ChatSkeleton";
import MessageList from "./components/MessageList";

import ThemeModal from "./components/ThemeModal";
import useMessages from "./hooks/useMessages";
import useSend from "./hooks/useSend";
import useTheme from "./hooks/useTheme";
import MenuModal from "./modals/MenuModal";

import { api } from "@/convex/_generated/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex/react";
import TypingDots from "./components/TypingDots";



export default function ChatScreen() {



const params = useLocalSearchParams<{ id: string }>();

const userId = params.id as Id<"users">;


  // ✅ STRICT TYPES
  const [replyMsg, setReplyMsg] = useState<Message | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [reactionMsg, setReactionMsg] = useState<Message | null>(null);

  const { applyTheme } = useTheme();

const [themeOpen, setThemeOpen] = useState(false);
const [cachedThemeIndex, setCachedThemeIndex] =
  useState<number | null>(null);
const [previewThemeIndex, setPreviewThemeIndex] = useState<number | null>(null);

useEffect(() => {
  AsyncStorage.getItem(
    `chat-theme-${userId}`
  ).then((v) => {
    if (v !== null) {
      setCachedThemeIndex(
        Number(v)
      );
    }
  });
}, [userId]);

  if (!userId) {
    return <Text>Invalid chat</Text>;
  }

const {
  messages,
  conversationId,
  currentUserId,
  themeIndex,
  isLoading,
  loadOlder,
  loadingMore,
} = useMessages(userId);

const typing = useQuery(
  api.messages.index.getTyping,
  conversationId
    ? { conversationId }
    : "skip"
);

const resolvedThemeIndex =
  previewThemeIndex !== null
    ? previewThemeIndex
    : typeof themeIndex ===
      "number"
    ? themeIndex
    : cachedThemeIndex ?? 0;

const theme = useMemo(() => {
  return (
    CHAT_THEMES[
      resolvedThemeIndex
    ] || CHAT_THEMES[0]
  );
}, [resolvedThemeIndex]);

  const { text, setText, handleSend } =
    useSend(userId, replyMsg, setReplyMsg);

  // ✅ STRICT DOUBLE TAP
const toggleReaction =
  useMutation(
    api.messages.index.toggleReaction
  );

  const handleDoubleTap =
  async (msg: Message) => {
    if (!msg._id) return;

    try {
      await Haptics.impactAsync(
        Haptics
          .ImpactFeedbackStyle
          .Medium
      );

      await toggleReaction({
        messageId: msg._id,
        reaction: "❤️",
      });
    } catch (e) {
      console.log(
        "DOUBLE TAP ERROR",
        e
      );
    }
  };
  

const renderChatContent = () => (
  <>
    {/* 🔝 HEADER */}
    <ChatHeader
      userId={userId}
      onOpenTheme={() =>
        setThemeOpen(true)
      }
      theme={theme}
    />

    <ThemeModal
      visible={themeOpen}
      selectedIndex={
        resolvedThemeIndex ?? 0
      }
      onPreview={(i) =>
        setPreviewThemeIndex(i)
      }
      onClose={() => {
        setPreviewThemeIndex(null);
        setThemeOpen(false);
      }}
      onApply={async (i) => {
        setCachedThemeIndex(i);

        await AsyncStorage.setItem(
          `chat-theme-${userId}`,
          String(i)
        );

        applyTheme(userId, i);

        setPreviewThemeIndex(null);

        setThemeOpen(false);
      }}
    />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={56}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <ChatSkeleton
              theme={theme}
            />
          ) : (
            <MessageList
              messages={messages}
              theme={theme}
              highlightId={
                reactionMsg?._id
              }
              loadOlder={loadOlder}
              loadingMore={
                loadingMore
              }
              currentUserId={
                currentUserId
              }
              onReply={setReplyMsg}
              onDoubleTap={
                handleDoubleTap
              }
           onLongPress={(msg) => {
  Keyboard.dismiss();

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
                      {typing && (
  <TypingDots
  theme={theme}
    typing={true}
    avatar={typing.user?.image}
  />
)}
        </View>

        <ChatInput
          text={text}
            userId={userId}
          setText={setText}
          onSend={handleSend}
          theme={theme}
        />
      </View>
    </KeyboardAvoidingView>
  </>
);

return (
  <View style={{ flex: 1 }}>

    {theme.wallpaper ? (
      <ImageBackground
        source={theme.wallpaper}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor:
              "#00000055",
          }}
        >
          {/* 🔝 HEADER */}
          <ChatHeader
            userId={userId}
            onOpenTheme={() =>
              setThemeOpen(true)
            }
            theme={theme}
          />

          <ThemeModal
            visible={themeOpen}
            selectedIndex={
              resolvedThemeIndex ?? 0
            }
            onPreview={(i) =>
              setPreviewThemeIndex(i)
            }
            onClose={() => {
              setPreviewThemeIndex(null);
              setThemeOpen(false);
            }}
            onApply={async (i) => {
              setCachedThemeIndex(i);

              await AsyncStorage.setItem(
                `chat-theme-${userId}`,
                String(i)
              );

              applyTheme(userId, i);

              setPreviewThemeIndex(null);

              setThemeOpen(false);
            }}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : "height"
            }
            keyboardVerticalOffset={56}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                {isLoading ? (
                  <ChatSkeleton
                    theme={theme}
                  />
                ) : messages.length ===
                  0 ? (
                  <Text
                    style={{
                      color: "#aaa",
                      padding: 16,
                    }}
                  >
                    Start conversation
                  </Text>
                ) : (
                  <MessageList
                    messages={messages}
                    theme={theme}
                    highlightId={
                      reactionMsg?._id
                    }
                    loadOlder={loadOlder}
                    loadingMore={
                      loadingMore
                    }
                    currentUserId={
                      currentUserId
                    }
                    onReply={setReplyMsg}
                    onDoubleTap={
                      handleDoubleTap
                    }
                    onLongPress={(
                      msg
                    ) => {
                      Keyboard.dismiss();

                      setSelectedMsg(
                        msg
                      );

                      setReactionMsg({
                        ...msg,
                        x: msg.x,
                        y: msg.y,
                        width:
                          msg.width,
                        height:
                          msg.height,
                      });
                    }}
                  />
                )}
{typing && (
  <TypingDots
  theme={theme}
    typing={true}
    avatar={typing.user?.image}
  />
)}
                <MenuModal
                  selectedMsg={
                    selectedMsg
                  }
                  reactionMsg={
                    reactionMsg
                  }
                  setReactionMsg={
                    setReactionMsg
                  }
                setSelectedMsg={(v: Message | null) => {
                    setSelectedMsg(v);

                    if (!v)
                      setReactionMsg(
                        null
                      );
                  }}
                  setReplyMsg={
                    setReplyMsg
                  }
                  setDeleteConfirm={() => {}}
                  currentUserId={
                    currentUserId
                  }
                />
              </View>

              {replyMsg && (
                <View
                  style={{
                    padding: 8,
                    backgroundColor:
                      theme.inputBg,

                    borderLeftColor:
                      theme.bubbleMe,

                    borderLeftWidth: 3,
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme.headerText,
                    }}
                  >
                    Replying:{" "}
                    {replyMsg.text}
                  </Text>

                  <Text
                    onPress={() =>
                      setReplyMsg(null)
                    }
                    style={{
                      color:
                        "#f87171",

                      marginTop: 4,
                    }}
                  >
                    Cancel
                  </Text>
                </View>
              )}

              <ChatInput
                text={text}
                  userId={userId}
                setText={setText}
                onSend={handleSend}
                theme={theme}
              />
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </ImageBackground>
    ) : theme.gradient ? (
      <LinearGradient
        colors={theme.gradient}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor:
              "#00000055",
          }}
        >
          {renderChatContent()}
        </Animated.View>
      </LinearGradient>
    ) : (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor:
            theme.background,
        }}
      >
        {renderChatContent()}
      </Animated.View>
    )}
  </View>
)}