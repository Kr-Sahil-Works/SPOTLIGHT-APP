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

      outputRange: [0.3, 0.6, 0.3],
    });

  return (
    <View
      style={{
        flex: 1,

        backgroundColor:
          theme.background,
      }}
    >
      {/* 🔝 HEADER */}
      <Animated.View
        style={{
          opacity,

          height: 72,

          paddingHorizontal: 14,

          flexDirection: "row",

          alignItems: "center",

          borderBottomWidth: 1,

          borderBottomColor:
            "#232323",
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,

            borderRadius: 21,

            backgroundColor:
              "#1a1a1a",
          }}
        />

        <View
          style={{
            marginLeft: 12,
          }}
        >
          <View
            style={{
              width: 110,
              height: 14,

              borderRadius: 8,

              backgroundColor:
                "#1a1a1a",

              marginBottom: 6,
            }}
          />

          <View
            style={{
              width: 70,
              height: 10,

              borderRadius: 8,

              backgroundColor:
                "#232323",
            }}
          />
        </View>
      </Animated.View>

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
          false,
          false,
          true,
          true,
          false,
          true,
        ].map((isMe, i) => (
          <Animated.View
            key={i}
            style={{
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
                  ? 90 +
                    ((i * 17) % 70)
                  : 120 +
                    ((i * 13) % 80),

                height:
                  i % 5 === 0
                    ? 44
                    : 34,

                borderRadius: 18,

                backgroundColor:
                  isMe
                    ? theme.bubbleMe +
                      "35"
                    : "#1a1a1a",
              }}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* ⌨️ INPUT */}
      <Animated.View
        style={{
          opacity,

          paddingHorizontal: 10,

          paddingVertical: 10,

          borderTopWidth: 1,

          borderTopColor:
            "#232323",

          flexDirection: "row",

          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,

            height: 44,

            borderRadius: 24,

            backgroundColor:
              "#1a1a1a",
          }}
        />

        <View
          style={{
            width: 42,
            height: 42,

            borderRadius: 21,

            marginLeft: 8,

            backgroundColor:
              "#ffffff12"
          }}
        />
      </Animated.View>
    </View>
  );
}