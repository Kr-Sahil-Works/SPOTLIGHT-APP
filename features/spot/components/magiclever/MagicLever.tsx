import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  runOnJS,
} from "react-native-reanimated";

import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

import MagicDot from "./MagicDot";
import type { QuickTool } from "./QuickTools";
import { QUICK_TOOLS } from "./QuickTools";

type Props = {
  onToolPress?: (tool: QuickTool) => void;
};

export default function MagicLever({
  onToolPress,
}: Props) {
const [selected, setSelected] = useState<number | null>(null);

const insets = useSafeAreaInsets();

const swipeTo = (direction: "left" | "right") => {
  setSelected((current) => {
    if (current === null) {
      Haptics.selectionAsync();
      return 0;
    }

    const next =
      direction === "left"
        ? Math.min(current + 1, QUICK_TOOLS.length - 1)
        : Math.max(current - 1, 0);

    if (next !== current) {
      Haptics.selectionAsync();
    }

    return next;
  });
};


const handlePress = (index: number) => {
  if (index === selected) {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    onToolPress?.(QUICK_TOOLS[index]);
    return;
  }

  Haptics.selectionAsync();

  setSelected(index);
};



  const pan = Gesture.Pan()
  .activeOffsetX([-20, 20])
  .failOffsetY([-20, 20])
  .onEnd((event) => {
    if (event.translationX < -40) {
      runOnJS(swipeTo)("left");
    } else if (event.translationX > 40) {
      runOnJS(swipeTo)("right");
    }
  });

  return (
  <>
    {selected !== null && (
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setSelected(null)}
      />
    )}
    <View
      style={[
        styles.container,
        {
        bottom: insets.bottom + 70,
        },
      ]}
    >
<Animated.Text
  key={selected !== null ? QUICK_TOOLS[selected].id : "none"}
  entering={FadeInDown.springify()}
  exiting={FadeOutUp.duration(120)}
  layout={Layout.springify()}
  style={styles.label}
>
  {selected !== null ? QUICK_TOOLS[selected].title : ""}
</Animated.Text>

<GestureDetector gesture={pan}>
  <Animated.View
    layout={Layout.springify()}
    style={styles.row}
  >
        {QUICK_TOOLS.map((tool, index) => (
     <Animated.View
  key={tool.id}
  layout={Layout.springify()}
 style={[
  styles.slot,
  {
    marginTop:
      selected === null
        ? 8
        : Math.abs(index - selected) === 0
        ? 0
        : Math.abs(index - selected) === 1
        ? 6
        : 12,

 opacity:
  selected === null
    ? 0.68
    : Math.abs(index - selected) === 0
    ? 1
    : Math.abs(index - selected) === 1
    ? 0.72
    : 0.38,
  },
]}
>
            <MagicDot
              icon={tool.icon}
              selected={selected === index}
              onPress={() => handlePress(index)}
            />
        </Animated.View>
        ))}
  </Animated.View>
</GestureDetector>
</View>
  </>
);
}

const styles = StyleSheet.create({
container: {
  position: "absolute",
  left: 20,
  right: 20,
  alignItems: "center",

  zIndex: 10,

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 8,
  },

  elevation: 8,
},

label: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "600",

  marginBottom: 12,

  letterSpacing: 0.3,
},

row: {
  flexDirection: "row",
  justifyContent: "space-evenly",
  width: "100%",

  backgroundColor: "rgba(255,255,255,0.025)",

  borderRadius: 28,

  paddingHorizontal: 10,
  paddingVertical: 8,

  borderWidth: StyleSheet.hairlineWidth,
  borderColor: "rgba(255,255,255,0.05)",
},

slot: {
  width: 52,
  alignItems: "center",
  justifyContent: "center",
},

  icon: {
  padding: 11,
  borderRadius: 20,
},
});