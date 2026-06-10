import { Ionicons } from "@expo/vector-icons";
import React, {
  useEffect,
  useRef,
} from "react";

import * as Clipboard from "expo-clipboard";
import {
  Animated,
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { useOverlay } from "../hooks/useOverlay";

type Props = {
  currentUserId?: string;

  onReply: (msg: any) => void;

  onDelete: (msg: any) => void;

  onCopy: (msg: any) => void;

  onEdit?: (msg: any) => void;

onPin?: (
  msg: any
) => void;

pinnedMessageId?: string;
}

export default function MessageMenu({
  currentUserId,

  onReply,
  onDelete,
  onCopy,
onEdit,
onPin,
pinnedMessageId,
}: Props) {
  const {
    overlay,
    closeOverlay,
  } = useOverlay();

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const scale = useRef(
    new Animated.Value(0.92)
  ).current;

const [keyboardHeight,
setKeyboardHeight] =
  React.useState(0);

  const [
  keyboardVisible,
  setKeyboardVisible,
] = React.useState(false);


const SCREEN_HEIGHT =
  Dimensions.get(
    "window"
  ).height;

  const [copied,
setCopied] =
  React.useState(false);

  const [justPinned,
setJustPinned] =
  React.useState(
    false
  );

  const [lastPinnedId,
setLastPinnedId] =
  React.useState<
    string | null
  >(null);

  const visible =
    overlay.type === "menu" &&
    overlay.message;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);

      scale.setValue(0.92);
    }
  }, [visible]);

  
  useEffect(() => {
  const showSub =
    Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(
          e.endCoordinates
            .height
        );
        setKeyboardVisible(true);
      }
    );

  const hideSub =
    Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


  if (!visible) return null;

  const msg = overlay.message;

  const formattedTime =
  msg?.createdAt
    ? new Date(
        msg.createdAt
      ).toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "";

  const isMine =
    msg?.senderId === currentUserId;

    const canModify =
  msg?.createdAt &&
  Date.now() -
    msg.createdAt <
    15 *
      60 *
      1000;

const emojiOnly =
  /^[\p{Emoji}\s]+$/u.test(
    msg?.text?.trim() ||
      ""
  );
const isPinned =
  pinnedMessageId ===
  String(msg?._id);

const canUnpin =
  isPinned;




  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
    >
      {/* BACKDROP */}
 <Pressable
  style={
    StyleSheet.absoluteFill
  }
  onPress={closeOverlay}
>
  <BlurView
    intensity={25}
    tint="dark"
    style={
      StyleSheet.absoluteFill
    }
  >
    <View
      style={
        styles.backdrop
      }
    />
  </BlurView>
</Pressable>

      {/* MENU */}
      <Animated.View
      pointerEvents="box-none"
  style={[
  styles.menu,

  {
maxHeight:
  SCREEN_HEIGHT -
  keyboardHeight -
  32,

top:
  keyboardHeight > 0
    ? 40
    : SCREEN_HEIGHT *
      0.28,

    opacity,

    transform: [
      { scale },
    ],
  },
]}
      >
  <View
  style={{
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    paddingHorizontal: 18,

    paddingTop: 14,

    paddingBottom: 12,

    borderBottomWidth: 1,

    borderBottomColor:
      "#ffffff10",
  }}
>
  <Text
    style={{
      color: "#8e8e93",

      fontSize: 13,

      fontWeight: "500",
    }}
  >
    Sent at{" "}
    {formattedTime}
  </Text>

  {isMine &&
    msg?.seenAt && (
      <Text
        style={{
          color: "#00b7ff",

          fontSize: 13,

          fontWeight: "600",
        }}
      >
        {"  •  "}Seen at{" "}
        {new Date(
          msg.seenAt
        ).toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute:
              "2-digit",
          }
        )}
      </Text>
    )}
</View>
        <Action
          icon="arrow-undo"
          text="Reply"
          onPress={() => {
            onReply(msg);

            closeOverlay();
          }}
        />

      <Action
  icon={
    copied
      ? "clipboard-outline"
      : "copy-outline"
  }
  text={
    copied
      ? "Copied"
      : "Copy"
  }
  success={copied}
  onPress={async () => {
    await Clipboard.setStringAsync(
      msg?.text || ""
    );

    setCopied(true);

    setTimeout(() => {
      closeOverlay();

      setCopied(false);
    }, 450);
  }}
/>

        {isMine &&
  canModify && (
          <>
          {!emojiOnly &&
  !msg?.edited && (
            <Action
              icon="create-outline"
              text="Edit"
              onPress={() => {
                onEdit?.(msg);

                closeOverlay();
              }}
            />)}

            <Action
              icon="trash-outline"
              text="Delete"
              danger
              onPress={() => {
                onDelete(msg);

                closeOverlay();
              }}
            />
          </>
        )}


{(!isPinned ||
  canUnpin) && (
<Action
  icon={
    justPinned &&
lastPinnedId ===
  String(msg?._id)
      ? "checkmark-circle"
      : isPinned
      ? "remove-circle-outline"
      : "bookmark-outline"
  }

  iconColor={
    justPinned &&
lastPinnedId ===
  String(msg?._id)
      ? "#22c55e"
      : isPinned
      ? "#ff4d4f"
      : "#fff"
  }

  text={
    justPinned &&
lastPinnedId ===
  String(msg?._id)
      ? "Pinned"
      : isPinned
      ? "Unpin"
      : "Pin"
  }

  textColor={
    justPinned &&
lastPinnedId ===
  String(msg?._id)
      ? "#22c55e"
      : isPinned
      ? "#ff4d4f"
      : "#fff"
  }

  onPress={() => {
  setLastPinnedId(
  String(msg?._id)
);

setJustPinned(
  !isPinned
);

    onPin?.(msg);

    setTimeout(() => {
      closeOverlay();
    }, 500);
  }}
/>
  )}
      </Animated.View>
    </View>
  );
}

function Action({
  icon,
  text,
  danger,
  success,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.action}
    >
      <Ionicons
        name={icon}
        size={20}
    color={
  danger
    ? "#ff453a"
    : "#fff"
}
        style={{
          width: 26,
        }}
      />

      <Text
        style={[
          styles.actionText,

         danger && {
  color: "#ff453a",
},

success && {
  color: "#22c55e",
},
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
  "#00000060",
  },

  menu: {
    position: "absolute",

    width: 240,

    backgroundColor: "#1c1c1e",

    borderRadius: 24,

    paddingVertical: 8,

    alignSelf: "center",

    overflow: "hidden",
    paddingBottom: 8,

    shadowColor: "#000",

    shadowOpacity: 0.25,

    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 14,
  },

  action: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 18,

    paddingVertical: 15,
  },

  actionText: {
    color: "#fff",

    fontSize: 16,

    fontWeight: "500",
  },
});