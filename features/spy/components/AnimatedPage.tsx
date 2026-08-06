import { Dimensions } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

type Props = {
  children: React.ReactNode;
  index: number;
  scrollX: SharedValue<number>;
};

export default function AnimatedPage({
  children,
  index,
  scrollX,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ],
      [0.96, 1, 0.96],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ],
      [0.55, 1, 0.55],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      scrollX.value,
      [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ],
      [35, 0, -35],
      Extrapolation.CLAMP
    );

    return {
      opacity,

      transform: [
        {
          scale,
        },
        {
          translateX,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          flex: 1,
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}