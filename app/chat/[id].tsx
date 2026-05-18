import { useLocalSearchParams } from "expo-router";

import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

import {
  CHAT_THEMES,
} from "@/constants/chatThemes";

import {
  Id,
} from "@/convex/_generated/dataModel";

import {
  Message,
} from "@/types/chat";

import {
  useMutation,
  useQuery,
} from "convex/react";

import * as Haptics from "expo-haptics";

import {
  LinearGradient,
} from "expo-linear-gradient";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Animated,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  api,
} from "@/convex/_generated/api";

import ChatHeader from "./components/layout/ChatHeader";

import ChatInput from "./components/layout/ChatInput";

import ChatSkeleton from "./components/layout/ChatSkeleton";

import TypingDots from "./components/layout/TypingDots";

import MessageList from "./components/message/MessageList";


import {
  ChatOverlayProvider,
} from "./components/message";

import ThemeModal from "./components/ThemeModal";

import useMessages from "./hooks/useMessages";

import useSend from "./hooks/useSend";

import useTheme from "./hooks/useTheme";

export default function ChatScreen() {
  const params =
    useLocalSearchParams<{
      id: string;
    }>();

  const userId =
    params.id as Id<"users">;

    useEffect(() => {
  (global as any)
    .currentChatId = userId;

  return () => {
    (global as any)
      .currentChatId = null;
  };
}, [userId]);

  const [
    replyMsg,
    setReplyMsg,
  ] = useState<
    Message | null
  >(null);

  const [
    themeOpen,
    setThemeOpen,
  ] = useState(false);

  const [
    cachedThemeIndex,
    setCachedThemeIndex,
  ] = useState<
    number | null
  >(null);

  const [
    previewThemeIndex,
    setPreviewThemeIndex,
  ] = useState<
    number | null
  >(null);

  const { applyTheme } =
    useTheme();

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
    api.messages.index
      .getTyping,
    conversationId
      ? {
          conversationId,
        }
      : "skip"
  );

  const markAsDelivered =
    useMutation(
      api.messages.index
        .markAsDelivered
    );

  const markAsSeen =
    useMutation(
      api.messages.index
        .markAsSeen
    );

  const toggleReaction =
    useMutation(
      api.messages.index
        .toggleReaction
    );

  useEffect(() => {
    if (!userId) {
      return;
    }

    markAsDelivered({
      userId,
    }).catch(() => {});

    markAsSeen({
      userId,
    }).catch(() => {});
  }, [messages.length]);

  const resolvedThemeIndex =
    previewThemeIndex !==
    null
      ? previewThemeIndex
      : typeof themeIndex ===
        "number"
      ? themeIndex
      : cachedThemeIndex ??
        0;

  const theme = useMemo(
    () => {
      return (
        CHAT_THEMES[
          resolvedThemeIndex
        ] || CHAT_THEMES[0]
      );
    },
    [resolvedThemeIndex]
  );

  const {
    text,

    setText,

    handleSend,
  } = useSend(
    userId,
    replyMsg,
    setReplyMsg
  );

  if (!userId) {
    return (
      <Text>
        Invalid chat
      </Text>
    );
  }

  const renderContent =
    () => (
      <>
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
            resolvedThemeIndex ??
            0
          }
          onPreview={(i) =>
            setPreviewThemeIndex(
              i
            )
          }
          onClose={() => {
            setPreviewThemeIndex(
              null
            );

            setThemeOpen(
              false
            );
          }}
          onApply={async (
            i
          ) => {
            setCachedThemeIndex(
              i
            );

            await AsyncStorage.setItem(
              `chat-theme-${userId}`,
              String(i)
            );

            applyTheme(
              userId,
              i
            );

            setPreviewThemeIndex(
              null
            );

            setThemeOpen(
              false
            );
          }}
        />

        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={
            Platform.OS ===
            "ios"
              ? "padding"
              : "height"
          }
          keyboardVerticalOffset={
            56
          }
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              {isLoading ? (
                <ChatSkeleton
                  theme={theme}
                />
              ) : messages.length ===
                0 ? (
              <View
  style={{
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 32,
  }}
>
  <View
    style={{
      width: 88,

      height: 88,

      borderRadius: 44,

      backgroundColor:
        "rgba(255,255,255,0.08)",

      justifyContent: "center",

      alignItems: "center",

      marginBottom: 20,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",
    }}
  >
    <Text
      style={{
        fontSize: 34,
      }}
    >
      💬
    </Text>
  </View>

  <Text
    style={{
      color:
        theme.headerText,

      fontSize: 22,

      fontWeight: "700",

      marginBottom: 8,
    }}
  >
    Your chat starts here
  </Text>

  <Text
    style={{
      color:
        "#999",

      textAlign: "center",

      lineHeight: 22,

      fontSize: 14,
    }}
  >
    Send a message, share
    thoughts, and Say Hi !
  </Text>
</View>
              ) : (
                <MessageList
                  messages={
                    messages
                  }
                  theme={theme}
                  loadOlder={
                    loadOlder
                  }
                  loadingMore={
                    loadingMore
                  }
                  currentUserId={
                    currentUserId
                  }
                  onReply={
                    setReplyMsg
                  }
                onReact={async ({
  messageId,
  reaction,
}) => {
  try {
    await Haptics.impactAsync(
      Haptics
        .ImpactFeedbackStyle
        .Medium
    );

    await toggleReaction({
      messageId,
      reaction,
    });
  } catch (e) {
    console.log(
      "REACTION ERROR",
      e
    );
  }
}}
                  onDelete={() =>
                    {}
                  }
                  onCopy={() =>
                    {}
                  }
                  onLongPress={(
                    msg
                  ) => {
                    Keyboard.dismiss();
                  }}
                  toggleReaction={
                    toggleReaction
                  }
                />
              )}

              {typing && (
                <TypingDots
                  theme={theme}
                  typing
                  avatar={
                    typing.user
                      ?.image
                  }
                />
              )}
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
                  {
                    replyMsg.text
                  }
                </Text>

                <Text
                  onPress={() =>
                    setReplyMsg(
                      null
                    )
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
              setText={
                setText
              }
              onSend={
                handleSend
              }
              theme={theme}
            />

          </View>
        </KeyboardAvoidingView>
      </>
    );

  return (
    <ChatOverlayProvider>
      <View
        style={{
          flex: 1,
        }}
      >
        {theme.wallpaper ? (
          <ImageBackground
            source={
              theme.wallpaper
            }
            resizeMode="cover"
            style={{
              flex: 1,
            }}
          >
            <Animated.View
              style={{
                flex: 1,

                backgroundColor:
                  "#00000055",
              }}
            >
         {renderContent()}
            </Animated.View>
          </ImageBackground>
        ) : theme.gradient ? (
          <LinearGradient
            colors={
              theme.gradient
            }
            style={{
              flex: 1,
            }}
          >
            <Animated.View
              style={{
                flex: 1,

                backgroundColor:
                  "#00000055",
              }}
            >
            {renderContent()}
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
          {renderContent()}
          </Animated.View>
        )}
      </View>
    </ChatOverlayProvider>
  );
}