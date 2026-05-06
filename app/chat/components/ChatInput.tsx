import { ChatTheme } from "@/constants/chatThemes";

import {
  Ionicons
} from "@expo/vector-icons";

import { BlurView } from "expo-blur";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  text: string;

  setText: (t: string) => void;

  onSend: () => void;

  theme: ChatTheme;
};

export default function ChatInput({
  text,
  setText,
  onSend,
  theme,
}: Props) {
  const tilt = useRef(
    new Animated.Value(0)
  ).current;

  const widthAnim = useRef(
    new Animated.Value(42)
  ).current;

  const hasSentOnce =
    useRef(false);

  const disabled = !text.trim();

  const [focused, setFocused] =
    useState(false);

  useEffect(() => {
    Animated.timing(tilt, {
      toValue: disabled ? 0 : 1,

      duration: 140,

      useNativeDriver: true,
    }).start();

Animated.timing(widthAnim, {
  toValue: disabled ? 48 : 68,

  duration: 180,

  useNativeDriver: false,
}).start();
  }, [disabled]);

  const handleSend = () => {
    if (disabled) return;

    onSend();
  };

  return (
    <View
      style={{
        padding: 10,

        backgroundColor:
          theme.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* 💬 INPUT */}
        <BlurView
          intensity={25}
          tint="dark"
          style={{
            flex: 1,

            borderRadius: 30,

            overflow: "hidden",

            marginRight: 8,

            borderWidth: 1,

            borderColor: focused
              ? theme.sendBtn
              : "#ffffff20",

            shadowColor:
              theme.sendBtn,

            shadowOpacity: disabled
              ? 0
              : focused
              ? 0.4
              : 0.2,

            shadowRadius: 10,

            shadowOffset: {
              width: 0,
              height: 0,
            },

            elevation: 3,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,

              paddingVertical: 2,
            }}
          >
            <TextInput
              value={text}
              onFocus={() =>
                setFocused(true)
              }
              onBlur={() =>
                setFocused(false)
              }
              onChangeText={setText}
              placeholder="Message..."
              placeholderTextColor="#aaa"
              style={{
                color:
                  theme.headerText,

                fontSize: 14,
              }}
            />
          </View>
        </BlurView>

        {/* 🚀 MORPH BUTTON */}
<Animated.View
  style={{
    width: widthAnim,

    height: 42,

    borderRadius: 20,

    overflow: "hidden",
  }}
>
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={handleSend}
    disabled={disabled}
    style={{
      flex: 1,

      backgroundColor: disabled
        ? "#3a3a3a"
        : theme.sendBtn,

      alignItems: "center",

      justifyContent: "center",

      shadowColor: theme.sendBtn,

      shadowOpacity: disabled
        ? 0
        : 0.35,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 6,
    }}
  >
    <Animated.View
      style={{
        transform: [
          {
            rotate:
              tilt.interpolate({
                inputRange: [0, 1],

                outputRange: [
                  "10deg",
                  "40deg",
                ],
              }),
          },
        ],
      }}
    >
      <Ionicons
  name="paper-plane"
  size={24}
  color={theme.sendIcon}
/>
    </Animated.View>
  </TouchableOpacity>
</Animated.View>
      </View>
    </View>
  );
}