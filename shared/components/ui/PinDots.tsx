import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  length: number;

  maxLength?: number;

  success?: boolean;
};

function Capsule({
  filled,
  success,
}: {
  filled: boolean;
  success: boolean;
}) {
  const progress = useSharedValue(
    filled ? 1 : 0
  );

  useEffect(() => {
    progress.value = withSpring(
      filled ? 1 : 0,
      {
        damping: 12,
        stiffness: 220,
      }
    );
  }, [filled]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: 0.92 + progress.value * 0.08,
        },
      ],

     backgroundColor: success
  ? "#FFD84D"
  : filled
  ? "#F2A900"
  : "#191919",

      borderColor: filled
        ? "#F2A900"
        : "#404040",

      shadowColor: "#F2A900",

      shadowOpacity:
        progress.value * 0.35,

      shadowRadius:
        progress.value * 8,

      elevation:
        progress.value * 6,
    }));

  return (
    <Animated.View
      style={[
        styles.capsule,
        animatedStyle,
      ]}
    />
  );
}

export default function PinDots({
  length,
  maxLength = 4,
  success = false,
}: Props) {
  return (
    <View style={styles.container}>
      {Array.from({
        length: maxLength,
      }).map((_, index) => (
        <Capsule
          key={index}
          filled={index < length}
          success={success}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 12,

    marginTop: 18,

    marginBottom: 18,
  },

  capsule: {
    width: 28,

    height: 16,

    borderRadius: 8,

    borderWidth: 1.5,
  },
});