import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size: number;
  animate?: boolean;
};

export default function EmptyPlayerSlot({
  size,
  animate = true,
}: Props) {
  const radius = size * 0.28;

  /*
   * Very subtle breathing animation.
   *
   * 0 = resting
   * 1 = slightly brighter
   */

  const breathe = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(breathe);
      breathe.value = 0;
      return;
    }

    breathe.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1800,
        }),

        withTiming(0, {
          duration: 1800,
        })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(breathe);
    };
  }, [animate]);

  /*
   * Outer ring breathing.
   */

  const ringAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity: interpolate(
        breathe.value,
        [0, 1],
        [0.22, 0.52]
      ),

      transform: [
        {
          scale: interpolate(
            breathe.value,
            [0, 1],
            [0.98, 1.025]
          ),
        },
      ],
    }));

  /*
   * Inner glow is even more subtle.
   */

  const glowAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity: interpolate(
        breathe.value,
        [0, 1],
        [0.025, 0.075]
      ),
    }));

  return (
    <View
      style={[
        styles.container,
        {
          width: size + 10,
          minHeight: size + 12,
        },
      ]}
    >
      <View
        style={[
          styles.slotWrapper,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        {/* =========================
            BREATHING OUTER RING
        ========================= */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.breathRing,
            {
              width: size + 8,
              height: size + 8,
              borderRadius: radius + 4,
            },
            ringAnimatedStyle,
          ]}
        />

        {/* =========================
            SLOT
        ========================= */}

        <View
          style={[
            styles.slot,
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
          ]}
        >
          {/* Soft breathing glow */}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                borderRadius: radius - 1,
              },
              glowAnimatedStyle,
            ]}
          />

          {/* Inner panel */}

          <View
            style={[
              styles.inner,
              {
                width: size - 8,
                height: size - 8,
                borderRadius:
                  Math.max(
                    radius - 4,
                    8
                  ),
              },
            ]}
          >
            {/* Plus */}

            <View style={styles.plusCircle}>
              <Ionicons
                name="add"
                size={Math.max(
                  18,
                  size * 0.34
                )}
                color="rgba(242,169,0,0.78)"
              />
            </View>
          </View>
        </View>
      </View>

      {/* =========================
          WAITING LABEL
      ========================= */}

      <View style={styles.waitingChip}>
        <View style={styles.dot} />

        <Text style={styles.waitingText}>
          WAITING
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  slotWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * This is the only element that
   * noticeably breathes.
   */

  breathRing: {
    position: "absolute",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.75)",

    shadowColor: "#F2A900",

    shadowOpacity: 0.15,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 2,
  },

  slot: {
    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
    "rgba(2, 2, 2, 0.91)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.24)",
  },

  /*
   * Soft internal glow.
   */

  glow: {
    position: "absolute",

    top: 1,
    left: 1,
    right: 1,
    bottom: 1,

    backgroundColor:
      "rgba(242,169,0,1)",
  },

  inner: {
    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      "rgba(242,169,0,0.035)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.055)",
  },

  plusCircle: {
    width: 31,

    height: 31,

    borderRadius: 15.5,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor:
      "rgba(242,169,0,0.075)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.30)",
  },

  waitingChip: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 4,

    paddingHorizontal: 6,

    paddingVertical: 2,

    borderRadius: 7,

    backgroundColor:
      "rgba(8,8,11,0.72)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.055)",
  },

  dot: {
    width: 4,

    height: 4,

    borderRadius: 2,

    marginRight: 3,

    backgroundColor:
      "rgba(242,169,0,0.65)",
  },

  waitingText: {
    color:
      "rgba(255,255,255,0.38)",

    fontSize: 7,

    fontWeight: "700",

    letterSpacing: 0.55,
  },
});