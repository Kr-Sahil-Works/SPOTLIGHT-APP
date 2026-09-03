import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";


import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";


type Props = {
  onNumberPress: (digit: string) => void;
  onBackspace: () => void;
  onClose: () => void;
};

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["close", "0", "back"],
];

type KeyProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "number" | "back" | "close";
};

function Key({
  children,
  onPress,
  variant = "number",
}: KeyProps) {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  const yellowStyle = useAnimatedStyle(() => ({
    opacity: pressed.value,
  }));

  const handlePressIn = async () => {
    scale.value = withSpring(0.95, {
      damping: 18,
      stiffness: 320,
    });

    if (variant === "number") {
      pressed.value = withTiming(1, {
        duration: 80,
      });
    }

    try {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light
      );
    } catch {}
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 280,
    });

    if (variant === "number") {
      pressed.value = withTiming(0, {
        duration: 180,
      });
    }
  };

  return (
    <Animated.View
      style={[
        styles.keyWrapper,
        animatedStyle,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.key}
      >
        {/* Existing key decoration */}
        <View style={styles.outerFrame} />
        <View style={styles.innerFrame} />
        <View style={styles.topLine} />

        {/* Yellow pressed overlay */}
        {variant === "number" && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pressedTint,
              yellowStyle,
            ]}
          />
        )}

        <View style={styles.content}>
          {variant === "number" ? (
            <Text style={styles.number}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}



export default function PinKeypad({
  onNumberPress,
  onBackspace,
  onClose,
}: Props) {
  const { height } =
    useWindowDimensions();

  const keypadHeight = Math.min(
    height * 0.40,
    360
  );

  return (
    <View
      style={[
        styles.container,
        {
          height: keypadHeight,
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={styles.gridOverlay}
      />

      <View style={styles.grid}>
        {keys.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={styles.row}
          >
            {row.map((item) => {
              /* =========================
                 CLOSE
              ========================= */

              if (item === "close") {
                return (
                  <Key
                    key={item}
                    variant="close"
                    onPress={onClose}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={22}
                      color="#C79B14"
                    />
                  </Key>
                );
              }

              /* =========================
                 BACKSPACE
              ========================= */

              if (item === "back") {
                return (
                  <Key
                    key={item}
                    variant="back"
                    onPress={onBackspace}
                  >
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color="#F1F1F1"
                    />
                  </Key>
                );
              }

              /* =========================
                 NUMBER
              ========================= */

              return (
                <Key
                  key={item}
                  variant="number"
                  onPress={() =>
                    onNumberPress(item)
                  }
                >
                  <Text style={styles.number}>
                    {item}
                  </Text>
                </Key>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* =====================================================
     MAIN KEYPAD
  ===================================================== */

  container: {
    width: "100%",

    backgroundColor:
      "rgba(7, 7, 7, 0.94)",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    borderTopWidth: 1,

    borderColor:
      "rgba(199, 155, 20, 0.18)",

    overflow: "hidden",

    shadowColor: "#000",

    shadowOpacity: 0.5,

    shadowRadius: 22,

    shadowOffset: {
      width: 0,
      height: -8,
    },

    elevation: 20,
  },

  /* =====================================================
     SUBTLE GRID
  ===================================================== */

  gridOverlay: {
    ...StyleSheet.absoluteFillObject,

    opacity: 0.13,

    backgroundColor:
      "rgba(199,155,20,0.025)",
  },

  /* =====================================================
     GRID
  ===================================================== */

  grid: {
    flex: 1,

    paddingHorizontal: 14,

    paddingTop: 14,

    paddingBottom: 12,
  },

  row: {
    flex: 1,

    flexDirection: "row",

    marginBottom: 9,
  },

  pressedTint: {
  ...StyleSheet.absoluteFillObject,

  backgroundColor: "#c591002e",

  opacity: 0,

  borderRadius: 7,
},

  /* =====================================================
     KEY WRAPPER
  ===================================================== */

  keyWrapper: {
    flex: 1,

    marginHorizontal: 5,

    minWidth: 0,

    minHeight: 0,
  },

  /* =====================================================
     KEY
  ===================================================== */

  key: {
    flex: 1,

    position: "relative",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    backgroundColor:
      "rgba(24, 21, 15, 0.94)",

    borderWidth: 1,

    borderColor:
      "rgba(199, 155, 20, 0.24)",

    borderRadius: 7,
  },

  /* =====================================================
     OUTER FRAME
  ===================================================== */

  outerFrame: {
    ...StyleSheet.absoluteFillObject,

    borderWidth: 1,

    borderColor:
      "rgba(199, 155, 20, 0.08)",

    borderRadius: 6,
  },

  /* =====================================================
     INNER FRAME
  ===================================================== */

  innerFrame: {
    position: "absolute",

    top: 5,

    left: 5,

    right: 5,

    bottom: 5,

    borderWidth: 1,

    borderColor:
      "rgba(199, 155, 20, 0.09)",

    borderRadius: 4,
  },

  /* =====================================================
     TOP HIGHLIGHT
  ===================================================== */

  topLine: {
    position: "absolute",

    top: 0,

    left: 10,

    right: 10,

    height: 1,

    backgroundColor:
      "rgba(199, 155, 20, 0.22)",
  },
  /* =====================================================
     CONTENT
  ===================================================== */

  content: {
    alignItems: "center",

    justifyContent: "center",

    width: "100%",

    height: "100%",
  },

  closeContent: {
    opacity: 0.9,
  },

  backContent: {
    opacity: 0.95,
  },

  /* =====================================================
     NUMBER
  ===================================================== */

  number: {
    color: "#F3F3F3",

    fontSize: 24,

    fontWeight: "800",

    letterSpacing: 1,

    textShadowColor:
      "rgba(199,155,20,0.18)",

    textShadowOffset: {
      width: 0,

      height: 1,
    },

    textShadowRadius: 4,
  },
});