import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable, Image as RNImage, View
} from "react-native";

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
      duration: 3000,
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
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          backgroundColor: "#000",
          transform: [{ translateY }],
        }}
      >
        {/* 🔥 PROGRESS */}
        <View style={{ flexDirection: "row", marginTop: 50, padding: 8 }}>
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

        {/* 🔥 STORY IMAGE */}
       <RNImage
  source={{ uri: story.story }}
  style={{ width: "100%", height: height * 0.85 }}
  resizeMode="cover"
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