import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";

export default function MessageItem({
  item,
  isMe,
  theme,
  avatar,
  onLongPress,
  onReact,
  onReply,
  onScrollTo, // 🔥 NEW
  highlightId, // 🔥 NEW
  isGrouped, // 🔥 NEW (for grouping)
}: any) {
  const entryX = useRef(new Animated.Value(isMe ? 40 : -40)).current;
  const panX = useRef(new Animated.Value(0)).current;
  const replied = useRef(false);

  useEffect(() => {
    Animated.spring(entryX, {
      toValue: 0,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  /* 🔥 OPACITY FADE */
  const opacity = panX.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.6],
    extrapolate: "clamp",
  });

  /* 🔥 ARROW OPACITY */
  const arrowOpacity = panX.interpolate({
    inputRange: [20, 70],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  /* 🔥 PAN */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,

      onPanResponderMove: (_, g) => {
        if (g.dx > 0) {
          const dx = g.dx;
          const resistance = dx > 80 ? 80 + (dx - 80) * 0.2 : dx;
          panX.setValue(Math.max(0, resistance));
        }

        if (g.dx > 75 && !replied.current) {
          replied.current = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onReply(item);
        }
      },

      onPanResponderRelease: () => {
        Animated.spring(panX, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }).start();

        replied.current = false;
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: entryX }, { translateX: panX }],
        opacity,
      }}
      {...panResponder.panHandlers}
    >
      <Pressable
        onLongPress={() => onLongPress(item)}
        onPress={() => onReact(item)}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: isMe ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            marginBottom: isGrouped ? 6 : 22, // 🔥 grouping spacing
          }}
        >
          {!isMe && !isGrouped && (
            <Image
              source={{ uri: avatar }}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                marginRight: 6,
              }}
            />
          )}

          {/* 🔥 REPLY ARROW */}
          <Animated.View
            style={{
              position: "absolute",
              left: -30,
              bottom: 10,
              opacity: arrowOpacity,
            }}
          >
            <Ionicons name="arrow-undo" size={18} color="#4ade80" />
          </Animated.View>

          {/* 🔥 WRAPPER */}
          <View style={{ position: "relative", maxWidth: "75%" }}>

            {/* 🔗 REPLY CONNECTOR LINE */}
            {item.replyTo && (
              <View
                style={{
                  position: "absolute",
                  left: -6,
                  top: 0,
                  bottom: -6,
                  width: 2,
                  backgroundColor: "#4ade80",
                  opacity: 0.4,
                }}
              />
            )}

            {/* 🔁 REPLY PREVIEW (CLICKABLE) */}
            {item.replyToText&& (
              <Pressable
                onPress={() => onScrollTo(item.replyTo)}
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: "#4ade80",
                  paddingLeft: 6,
                  marginBottom: 6,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                  }}
                >
                  {item.replyToText}
                </Text>
              </Pressable>
            )}

            {/* 💬 BUBBLE */}
            <View
              style={{
                backgroundColor:
                  highlightId === item._id
                    ? "#333" // 🔥 highlight flash
                    : isMe
                    ? theme.bubbleMe
                    : theme.bubbleOther,

                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: isGrouped ? 14 : 20,
              }}
            >
              <Text style={{ color: "#fff" }}>{item.text}</Text>

              {item.edited && (
                <Text
                  style={{
                    fontSize: 10,
                    color: "#aaa",
                    marginTop: 4,
                    alignSelf: "flex-end",
                  }}
                >
                  edited
                </Text>
              )}
            </View>

            {/* 🔥 REACTIONS */}
            {item.reactions?.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  bottom: -16,
                  left: isMe ? undefined : 0,
                  right: isMe ? 0 : undefined,
                  backgroundColor: "#000",
                  borderRadius: 12,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  flexDirection: "row",
                }}
              >
                {item.reactions.map((r: any, i: number) => (
                  <Text key={i} style={{ fontSize: 11 }}>
                    {r.value}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}