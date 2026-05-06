import { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";

const { width } = Dimensions.get("window");

export default function useProfileTabs() {
  const [activeTab, setActiveTab] = useState<
    "grid" | "reels" | "tags"
  >("grid");

  const tabIndex = useRef(new Animated.Value(0)).current;
  const containerX = useRef(new Animated.Value(0)).current;
  const [tabLayouts, setTabLayouts] = useState<
    { x: number; width: number }[]
  >([]);

  const switchTab = (index: number) => {
Animated.spring(tabIndex, {
  toValue: index,
  stiffness: 120,
  damping: 14,
  mass: 0.6,
  useNativeDriver: true,
}).start();

Animated.spring(containerX, {
  toValue: -index * width,
  stiffness: 100,
  damping: 18,
  mass: 0.7,
  useNativeDriver: true,
}).start();

    setActiveTab(
      index === 0 ? "grid" : index === 1 ? "reels" : "tags"
    );
  };

  // 🔥 swipe gesture
  const tabPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dy) < 8,

    onPanResponderRelease: (_, g) => {
  const threshold = width * 0.25;

  if (g.dx < -threshold) {
    if (activeTab === "grid") switchTab(1);
    else if (activeTab === "reels") switchTab(2);
  } else if (g.dx > threshold) {
    if (activeTab === "tags") switchTab(1);
    else if (activeTab === "reels") switchTab(0);
  }
}
    })
  ).current;

  return {
    activeTab,
    tabIndex,
    containerX,
    tabLayouts,
    setTabLayouts,
    switchTab,
    tabPan,
    width,
  };
}