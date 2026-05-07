import { ChatTheme } from "@/constants/chatThemes";

import {
  Animated,
  ScrollView,
  View,
} from "react-native";

import {
  useEffect,
  useRef,
} from "react";

type Props = {
  theme: ChatTheme;
};

export default function ChatSkeleton({
  theme,
}: Props) {
  const shimmer = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,

        duration: 1200,

        useNativeDriver: false,
      })
    ).start();
  }, []);

const opacity =
  shimmer.interpolate({
    inputRange: [0, 0.5, 1],

    outputRange: [0.55, 1, 0.55],
  });

  return (
    <View
      style={{
        flex: 1,

backgroundColor:
  theme.wallpaper
    ? "transparent"
    : theme.background,
      }}
    >

      {/* 💬 CHAT */}
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal: 12,

          paddingTop: 14,

          paddingBottom: 20,
        }}
      >
        {[
          false,
          false,
          true,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
           false,
          true,
           false,
          true,
        
    
        ].map((isMe, i) => (
          <Animated.View
            key={i}
            style={{
              transform: [
  {
    scale:
      isMe ? 0.96 : 1,
  },
],
              opacity,

              alignItems: isMe
                ? "flex-end"
                : "flex-start",

              marginBottom: 10,
            }}
          >
            <View
              style={{
         width: isMe
  ? 110 +
    ((i * 37) % 140)
  : 110 +
    ((i * 29) % 170),

               height: 40,

                borderRadius: 16,

                backgroundColor:
                  isMe
                    ?theme.bubbleMe + "18"
                    : "#1a1a1a",
              }}
            />
          </Animated.View>
        ))}
      </ScrollView>

    </View>
  );
}