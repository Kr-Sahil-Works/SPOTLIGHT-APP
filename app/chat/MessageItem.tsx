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
  onScrollTo,
  highlightId,
  isGrouped,
}: any) {
  const entryX = useRef(new Animated.Value(isMe ? 40 : -40)).current;
  const panX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const replied = useRef(false);

  useEffect(() => {
    Animated.spring(entryX, {
      toValue: 0,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const opacity = panX.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });

  const arrowOpacity = panX.interpolate({
    inputRange: [20, 70],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

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
        onPressIn={() => {
          Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        onLongPress={() => onLongPress(item)}
        onPress={() => onReact(item)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              marginBottom: isGrouped ? 6 : 20,
            }}
          >
            {!isMe && !isGrouped && (
              <Image
                source={{ uri: avatar }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  marginRight: 6,
                }}
              />
            )}

            {/* REPLY ARROW */}
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

            <View style={{ maxWidth: "75%" }}>

              {/* REPLY PREVIEW */}
              {item.replyToText && (
                <Pressable
                  onPress={() => onScrollTo(item.replyTo)}
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: "#4ade80",
                    paddingLeft: 8,
                    marginBottom: 6,
                    opacity: 0.9,
                  }}
                >
                  <Text numberOfLines={1} style={{ fontSize: 11, color: "#aaa" }}>
                    {item.replyToText}
                  </Text>
                </Pressable>
              )}

              {/* BUBBLE */}
              <View
                style={{
                  backgroundColor:
                    highlightId === item._id
                      ? "#2a2a2a"
                      : isMe
                      ? theme.bubbleMe
                      : theme.bubbleOther,

                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: isGrouped ? 16 : 22,

                  shadowColor: isMe ? theme.bubbleMe : "#000",
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 18,
                  }}
                >
                  {item.text}
                </Text>

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

              {/* REACTIONS */}
              {item.reactions?.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -18,
                    left: isMe ? undefined : 0,
                    right: isMe ? 0 : undefined,

                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    flexDirection: "row",
                  }}
                >
                  {item.reactions.map((r: any, i: number) => (
                    <Text key={i} style={{ fontSize: 12 }}>
                      {r.value}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}