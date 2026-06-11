import { ChatTheme } from "@/constants/chatThemes";

import {
  Ionicons
} from "@expo/vector-icons";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import useNetwork from "@/hooks/useNetwork";
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
  userId: any;
};

export default function ChatInput({
  text,
  setText,
  onSend,
  theme,
  userId,
}: Props) {
  const tilt = useRef(
    new Animated.Value(0)
  ).current;

  const widthAnim = useRef(
    new Animated.Value(42)
  ).current;

  const inputRef =
  useRef<TextInput>(
    null
  );


  const hasSentOnce =
    useRef(false);
    const isOnline =
  useNetwork();

  const disabled =
  !text.trim() ||
  !isOnline;

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

  isTypingRef.current = false;

  setTyping({
    receiverId: userId,
    isTyping: false,
  });

  if (typingTimeout.current) {
    clearTimeout(
      typingTimeout.current
    );
  }

  onSend();
};
useEffect(() => {
  return () => {
    if (typingTimeout.current) {
      clearTimeout(
        typingTimeout.current
      );
    }
  };
}, []);


const setTyping = useMutation(
  api.messages.index.setTyping
);
const typingTimeout = useRef<any>(null);

const isTypingRef = useRef(false);

const handleTyping = (value: string) => {
  if (!isOnline) {
  setText(value);
  return;
}
  setText(value);

  // already typing
  if (!isTypingRef.current) {
    isTypingRef.current = true;

    setTyping({
      receiverId: userId,
      isTyping: true,
    });
  }

  // reset timer
  if (typingTimeout.current) {
    clearTimeout(
      typingTimeout.current
    );
  }

  typingTimeout.current =
    setTimeout(() => {
      isTypingRef.current = false;

      setTyping({
        receiverId: userId,
        isTyping: false,
      });
    }, 1800);
};

  return (
    <View
     style={{
  paddingHorizontal: 10,
  paddingTop: 10,

  paddingBottom:
    isOnline
      ? 10
      : 35,

  backgroundColor:
    "transparent",
}}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* 💬 INPUT */}
        <View
          // intensity={25}
          // tint="dark"
          style={{
            flex: 1,

            borderRadius: 30,
            
            overflow: "visible",

            marginRight: 8,

            borderWidth: 1,

            backgroundColor: "#00000040",

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
  ref={inputRef}
  underlineColorAndroid="transparent"
              value={text}
              onFocus={() =>
                setFocused(true)
              }
              onBlur={() =>
                setFocused(false)
              }
              onChangeText={handleTyping}
              placeholder={
  isOnline
    ? "Message..."
    : "Reconnect to send"
}
              placeholderTextColor="#bdbdbd"
              style={{
                color:
                  theme.headerText,

                fontSize: 16,
                paddingVertical: 8,
              }}
            />
          </View>
        </View>

        {/* 🚀 MORPH BUTTON */}
<Animated.View
  style={{
    width: disabled
  ? 55
  : 60,

    height: disabled
      ? 44
      : 44,

borderRadius: disabled
  ? 16
  : 30,
  }}
>
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={handleSend}
    disabled={disabled}
    style={{
      flex: 1,
borderRadius: 20,
overflow: "hidden",
   backgroundColor: disabled
  ? "#ffffff12"
  : theme.sendBtn,

borderWidth: disabled
  ? 1
  : 0,

borderColor: disabled
  ? "#ffffff18"
  : "transparent",



      alignItems: "center",

      justifyContent: "center",

      shadowColor: theme.sendBtn,

shadowOpacity: disabled
  ? 0
  : 0.22,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 0,
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
  size={
    disabled
      ? 24
      : 30
  }
  color={
  disabled
    ? "#ffffff90"
    : theme.sendIcon
}
style={{
  transform: [
    {
      translateX: -2,
    },
  ],
}}
/>
    </Animated.View>
  </TouchableOpacity>
</Animated.View>
      </View>
    </View>
  );
}