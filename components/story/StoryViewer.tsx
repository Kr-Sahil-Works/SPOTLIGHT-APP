import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Image } from "expo-image";

const { height } = Dimensions.get("window");

export default function StoryViewer({
  visible,
  stories,
  startIndex,
  onClose,
}: any) {
  const [current, setCurrent] = useState<number>(startIndex || 0);

  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<any>(null);

  const translateY = useRef(new Animated.Value(0)).current;

  // 🔥 RESET INDEX
  useEffect(() => {
    setCurrent(startIndex || 0);
  }, [startIndex]);

  // 🔥 AUTO PROGRESS
  useEffect(() => {
    if (!visible) return;

    progress.setValue(0);

    animation.current = Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    });

    animation.current.start(({ finished }: any) => {
      if (finished) next();
    });

    return () => animation.current?.stop();
  }, [current, visible]);

  // 🔥 FIXED NAVIGATION
  const next = () => {
    if (current < stories.length - 1) {
      setCurrent((prev: number) => prev + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((prev: number) => prev - 1); // ✅ FIXED
    }
  };

  // 🔥 HOLD PAUSE (INSTA STYLE)
  const pause = () => {
    animation.current?.stop();
  };

  const resume = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) next();
    });
  };

  // 🔥 SWIPE DOWN CLOSE
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          onClose();
          translateY.setValue(0);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const story = stories[current];
  if (!story) return null;

  return (
    <Modal
  visible={visible}
  transparent={false}
  animationType="fade"
  statusBarTranslucent
>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          backgroundColor: "#000",
          transform: [{ translateY }],
        }}
      >
        <View
  style={{
    position: "absolute",
    top: 50,
    left: 12,
    right: 12,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <Image
      source={
        typeof story.avatar === "number"
          ? story.avatar
          : { uri: story.avatar }
      }
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
      }}
      contentFit="cover"
      cachePolicy="memory-disk"
      allowDownscaling
    />

    <Text
      style={{
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 10,
      }}
    >
      {story.username}
    </Text>
  </View>

  <TouchableOpacity
    onPress={onClose}
    activeOpacity={0.8}
    style={{
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Ionicons
      name="close"
      size={18}
      color="#fff"
    />
  </TouchableOpacity>
</View>
        {/* 🔥 PROGRESS */}
        <View style={{ flexDirection: "row", marginTop: 95, padding: 8 }}>
          {stories.map((_: any, i: number) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                backgroundColor: "rgba(255,255,255,0.3)",
                marginHorizontal: 2,
                overflow: "hidden",
              }}
            >
              {i === current && (
                <Animated.View
                  style={{
                    height: 3,
                    backgroundColor: "#fff",
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              )}
              {i < current && (
                <View style={{ flex: 1, backgroundColor: "#fff" }} />
              )}
            </View>
          ))}
        </View>

<Image
  source={
    typeof story.story === "number"
      ? story.story
      : story.story?.trim()
      ? { uri: story.story }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={{
    width: "100%",
    height: height * 0.85,
  }}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>

        {/* 🔥 TAP ZONES (FIXED + HOLD SUPPORT) */}
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            flexDirection: "row",
            width: "100%",
          }}
        >
          {/* LEFT */}
          <Pressable
            style={{ flex: 1 }}
            onPress={prev}
            onPressIn={pause}
            onPressOut={resume}
          />

          {/* RIGHT */}
          <Pressable
            style={{ flex: 1 }}
            onPress={next}
            onPressIn={pause}
            onPressOut={resume}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}