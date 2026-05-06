import { ChatTheme } from "@/constants/chatThemes";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
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
  const scale = useRef(new Animated.Value(0.9)).current;
  const tilt = useRef(new Animated.Value(0)).current; // 0 = down, 1 = up
const hasSentOnce = useRef(false);
  const disabled = !text.trim();
const [focused, setFocused] = useState(false);



useEffect(() => {
  // 🎯 scale only before first send
  if (!hasSentOnce.current) {
    Animated.spring(scale, {
      toValue: disabled ? 0.9 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }

  // 🔥 tilt animation (always active)
  Animated.timing(tilt, {
    toValue: disabled ? 0 : 1,
    duration: 120,
    useNativeDriver: true,
  }).start();

}, [disabled]);



const handleSend = () => {
  if (disabled) return;

  // 🎯 ONLY FIRST TIME SCALE ANIMATION
  if (!hasSentOnce.current) {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    hasSentOnce.current = true;
  }

  onSend();
};



  return (
    <View
      style={{
        padding: 10,
        backgroundColor: theme.background,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        
        {/* 💬 GLASS INPUT */}
        <BlurView
          intensity={25}
          tint="dark"
          style={{
            flex: 1,
            borderRadius: 30,
            overflow: "hidden",
            marginRight: 8,

            // ✨ glass border
            borderWidth: 1,
            borderColor: focused ? theme.sendBtn : "#ffffff20",

            // ✨ glow (subtle)
            shadowColor: theme.sendBtn,
            shadowOpacity: disabled ? 0 : focused ? 0.4 : 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
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
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChangeText={setText}
              placeholder="Message..."
              placeholderTextColor="#aaa"
              style={{
                color: "#aaa",
                fontSize: 13,
              }}
            />
          </View>
        </BlurView>

        {/* 🚀 GLASS SEND BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSend}
          disabled={disabled}
        >
          <Animated.View
            style={{
              transform: [{ scale }],
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: disabled
                ? "#444"
                : theme.sendBtn,

              // ✨ neon glow
              shadowColor: theme.sendBtn,
              shadowOpacity: disabled ? 0 : 0.6,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 0 },
              elevation: 6,
            }}
          >
            <Animated.View
  style={{
    transform: [
      {
        rotate: tilt.interpolate({
          inputRange: [0, 1],
          outputRange: ["-8deg", "0deg"], // down → up
        }),
      },
    ],
  }}
>
  <Ionicons name="send" size={20} color={theme.sendIcon} />
</Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}