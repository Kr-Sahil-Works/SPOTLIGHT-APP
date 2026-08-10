import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function Toggle({
  value,
  onChange,
}: ToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);
const thumbScale = useSharedValue(1);

useEffect(() => {
  progress.value = withTiming(
    value ? 1 : 0,
    {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    }
  );

  thumbScale.value = withSequence(
    withTiming(0.92, {
      duration: 90,
    }),
    withSpring(1, {
      damping: 12,
      stiffness: 260,
    })
  );
}, [value]);

const thumbStyle = useAnimatedStyle(() => ({
  transform: [
    {
      translateX: progress.value * 24,
    },
    {
      scale:
  thumbScale.value *
  (value ? 1.06 : 1),
    },
  ],

  backgroundColor: value
    ? "#F2A900"
    : "#555",

  shadowColor: "#F2A900",
  shadowOpacity: progress.value * 0.35,
  shadowRadius: 10,
}));


  const trackStyle = useAnimatedStyle(() => ({
   backgroundColor: withTiming(
  value
    ? "rgba(242,169,0,0.22)"
    : "#111",
  {
    duration: 240,
  }
),

    borderColor: value
      ? "#F2A900"
      : "#2B2B2B",
  }));

  return (
    <Pressable
      hitSlop={8}
      onPress={() => onChange(!value)}
    >
      <Animated.View
        style={[
          styles.track,
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 56,
    height: 32,

    borderRadius: 16,

    borderWidth: 1,

    justifyContent: "center",

    paddingHorizontal: 3,
  },

  thumb: {
    width: 24,
    height: 24,

    borderRadius: 12,

    elevation: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});