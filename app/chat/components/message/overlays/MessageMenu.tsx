import { Ionicons } from "@expo/vector-icons";
import React, {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
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
};

export default function MessageMenu({
  currentUserId,

  onReply,
  onDelete,
  onCopy,
  onEdit,
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

  if (!visible) return null;

  const msg = overlay.message;

  const isMine =
    msg?.senderId === currentUserId;

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
    intensity={38}
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
        style={[
          styles.menu,

          {
            opacity,

            transform: [{ scale }],
          },
        ]}
      >
        <Action
          icon="arrow-undo"
          text="Reply"
          onPress={() => {
            onReply(msg);

            closeOverlay();
          }}
        />

        <Action
          icon="copy-outline"
          text="Copy"
          onPress={() => {
            onCopy(msg);

            closeOverlay();
          }}
        />

        {isMine && (
          <>
            <Action
              icon="create-outline"
              text="Edit"
              onPress={() => {
                onEdit?.(msg);

                closeOverlay();
              }}
            />

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

        <Action
          icon="bookmark-outline"
          text="Pin"
          onPress={closeOverlay}
        />

        <Action
          icon="flag-outline"
          text="Report"
          danger
          onPress={closeOverlay}
        />
      </Animated.View>
    </View>
  );
}

function Action({
  icon,
  text,
  danger,
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
          danger ? "#ff453a" : "#fff"
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
  "#00000080",
  },

  menu: {
    position: "absolute",

    width: 240,

    backgroundColor: "#1c1c1e",

    borderRadius: 24,

    paddingVertical: 8,

    alignSelf: "center",

    top: "28%",

    overflow: "hidden",

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