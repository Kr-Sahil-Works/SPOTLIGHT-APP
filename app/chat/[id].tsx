import useNetwork from "@/hooks/useNetwork";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

import {
  useAuth,
} from "@clerk/clerk-expo";


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Animated,
} from "react-native";

import { storage } from "@/lib/mmkv";

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

import { Ionicons } from "@expo/vector-icons";
import useTheme from "./hooks/useTheme";

export default function ChatScreen() {
  const {
  isLoaded,
  isSignedIn,
} = useAuth();
  const insets =
  useSafeAreaInsets();
  const isOnline =
  useNetwork();

  const params =
    useLocalSearchParams<{
      id: string;
    }>();

    const flatListRef =
  React.useRef<any>(
    null
  );

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
  highlightedId,
  setHighlightedId,
] = useState<
  string | null
>(null);


const [
  editingMessage,
  setEditingMessage,
] = useState<any>(
  null
);

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
  const value =
    storage.getString(
      `chat-theme-${userId}`
    );

  if (value !== undefined) {
    setCachedThemeIndex(
      Number(value)
    );
  }
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

const typing =
  useQuery(
    api.messages.index
      .getTyping,

    conversationId &&
    conversationId !==
      ("undefined" as any)
      ? {
          conversationId,
        }
      : "skip"
  );


const conversation =
  useQuery(
    api.conversations
      .index
      .getConversation,

    conversationId &&
    conversationId !==
      ("undefined" as any)
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
const editMessage =
  useMutation(
    api.messages.index
      .editMessage
  );

  const setPinnedMessage =
  useMutation(
    api.conversations
      .index
      .setPinnedMessage
  );

const deleteMessage =
  useMutation(
    api.messages.index
      .deleteMessage
  );

useEffect(() => {
  if (
    !userId ||
    !isLoaded ||
    !isSignedIn ||
    !isOnline
  ) {
    return;
  }

  const run =
    async () => {
      try {
        await markAsDelivered({
          userId,
        });

        await markAsSeen({
          userId,
        });
      } catch {}
    };

  run();
}, [
  messages.length,
  isLoaded,
  isSignedIn,
  isOnline,
  userId,
]);
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
  setReplyMsg,
  editingMessage,
  setEditingMessage
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
onUnpin={async () => {
  if (!conversationId)
    return;

  await setPinnedMessage(
    {
      conversationId,

      text:
        undefined,

      messageId:
        undefined,
    }
  );
}}
  theme={theme}

  pinnedMessages={
    conversation
      ?.pinnedMessageText
      ? [
          {
            text:
              conversation.pinnedMessageText,
          },
        ]
      : []
  }

  onPinPress={() => {
    const target =
      messages.find(
        (m) =>
          String(m._id) ===
          String(
            conversation
              ?.pinnedMessageId
          )
      );

    if (!target)
      return;

    const scrollIndex =
      messages.findIndex(
        (m) =>
          String(m._id) ===
          String(
            target._id
          )
      );
if (
  scrollIndex >= 0
) {
  flatListRef.current?.scrollToIndex(
    {
      index:
        scrollIndex,

      animated: true,
    }
  );

  setHighlightedId(
    String(target._id)
  );

  setTimeout(() => {
    setHighlightedId(
      null
    );
  }, 1800);
}
  }}
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

       storage.set(
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
    Platform.OS === "ios"
      ? "padding"
      : "padding"
  }
  keyboardVerticalOffset={
    Platform.OS === "android"
      ? 40
      : 0
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
                  flatListRef={
  flatListRef
}
highlightId={
  highlightedId ||
  undefined
}
 
onScrollTo={(
  targetId: string
) => {
  const target =
    messages.find(
      (m) =>
        String(m._id) ===
        String(
          targetId
        )
    );

  if (!target)
    return;

  const scrollIndex =
    messages.findIndex(
      (m) =>
        String(m._id) ===
        String(
          targetId
        )
    );

  if (
    scrollIndex >= 0
  ) {
    flatListRef.current?.scrollToIndex(
      {
        index:
          scrollIndex,

        animated: true,
      }
    );

    setHighlightedId(
      String(
        targetId
      )
    );

    setTimeout(() => {
      setHighlightedId(
        null
      );
    }, 1800);
  }
}}


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
                  

onPin={async (msg) => {
  if (!isOnline)
  return;
  if (!conversationId)
    return;

  const alreadyPinned =
    String(
      conversation
        ?.pinnedMessageId
    ) ===
    String(msg._id);

 await setPinnedMessage(
  {
    conversationId,

    text:
      alreadyPinned
        ? undefined
        : msg.text,

    messageId:
      alreadyPinned
        ? undefined
        : msg._id,

    pinnedBy:
      currentUserId,
  }
);
}}

onReply={
                    setReplyMsg
                  }
onEdit={(msg) => {
  if (!isOnline)
    return;

  setEditingMessage(
    msg
  );

  setText(msg.text);
}}
onReact={async ({
  messageId,
  reaction,
}) => {
  if (!isOnline)
    return;

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
                onDelete={async (
  msg
) => {
  if (!isOnline)
  return;
  try {
    const target =
      messages.find(
        (m) =>
          m._id ===
          msg._id
      );

    if (target) {
      target.deleting =
        true;
    }

    setTimeout(
      async () => {
        await deleteMessage(
          {
            messageId:
              msg._id,
          }
        );
      },
      260
    );
  } catch (e) {
    console.log(e);
  }
}}
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


{editingMessage && (
  <View
    style={{
      backgroundColor:
        "#111",

      borderTopWidth: 1,

      borderTopColor:
        "#ffffff10",

      paddingHorizontal: 16,

      paddingVertical: 10,

      flexDirection: "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    }}
  >
    <View>
      <Text
        style={{
          color: "#00b7ff",

          fontSize: 12,

          fontWeight: "700",
        }}
      >
        EDITING MESSAGE
      </Text>

      <Text
        numberOfLines={1}
        style={{
          color: "#fff",

          marginTop: 2,

          fontSize: 13,
        }}
      >
        {
          editingMessage.text
        }
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => {
        setEditingMessage(
          null
        );

        setText("");
      }}
    >
      <Ionicons
        name="close"
        size={22}
        color="#fff"
      />
    </TouchableOpacity>
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
paddingBottom:
  Platform.OS === "android"
    ? 40
    : 0,
  }}
>
{theme.wallpaper ? (
  <View
    style={{
      flex: 1,
    }}
  >
    <Image
      source={theme.wallpaper}
      contentFit="cover"
      cachePolicy="memory-disk"
      allowDownscaling
      transition={0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />

    <Animated.View
      renderToHardwareTextureAndroid={false}
      style={{
        flex: 1,
        backgroundColor: "#00000055",
      }}
    >
      {renderContent()}
    </Animated.View>
  </View>
) : theme.gradient ? (
  <LinearGradient
    colors={theme.gradient}
    style={{
      flex: 1,
    }}
  >
    <Animated.View
      renderToHardwareTextureAndroid={false}
      style={{
        flex: 1,
        backgroundColor: "#00000055",
      }}
    >
      {renderContent()}
    </Animated.View>
  </LinearGradient>
) : (
  <Animated.View
    renderToHardwareTextureAndroid={false}
    style={{
      flex: 1,
      backgroundColor: theme.background,
    }}
  >
    {renderContent()}
  </Animated.View>
)}
      </View>
    </ChatOverlayProvider>
  );
}