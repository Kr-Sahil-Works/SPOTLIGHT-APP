import { Ionicons } from "@expo/vector-icons";
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
  ["", "0", "back"],
];

type KeyProps = {
  children: React.ReactNode;
  onPress?: () => void;
  borderRight: boolean;
  borderBottom: boolean;
  cellHeight: number;
};

function Key({
  children,
  onPress,
  borderRight,
  borderBottom,
  cellHeight,
}: KeyProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          flex: 1,
        },
      ]}
    >
      <Pressable
        android_ripple={{
          color: "#1A1A1A",
        }}
        onPressIn={() => {
          scale.value = withSpring(0.94, {
            damping: 18,
            stiffness: 320,
          });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, {
            damping: 14,
            stiffness: 260,
          });
        }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cell,
          {
            height: cellHeight,
            borderRightWidth: borderRight ? 1 : 0,
            borderBottomWidth: borderBottom ? 1 : 0,
          },
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function PinKeypad({
  onNumberPress,
  onBackspace,
  onClose,
}: Props) {
  const { width, height } = useWindowDimensions();

  const keypadHeight = Math.min(height * 0.40, 360);
  const cellHeight = keypadHeight / 4;

 return (
  <View
    style={[
      styles.container,
      {
        height: keypadHeight,
      },
    ]}
  >
    {keys.map((row, rowIndex) => (
      <View
        key={rowIndex}
        style={styles.row}
      >
        {row.map((item, colIndex) => {
          const borderRight = colIndex !== 2;
          const borderBottom = rowIndex !== 3;

       if (item === "") {
  return (
    <Key
      key={`${rowIndex}-${colIndex}`}
      onPress={onClose}
      borderRight={borderRight}
      borderBottom={borderBottom}
      cellHeight={cellHeight}
    >
      <Ionicons
        name="arrow-down-left-box-outline"
        size={20}
        color="#673602"
      />
    </Key>
  );
}

          if (item === "back") {
            return (
              <Key
                key={item}
                onPress={onBackspace}
                borderRight={borderRight}
                borderBottom={borderBottom}
                cellHeight={cellHeight}
              >
                <Ionicons
                  name="arrow-back"
                  size={26}
                  color="#F5F5F5"
                />
              </Key>
            );
          }

          return (
            <Key
              key={item}
              onPress={() =>
                onNumberPress(item)
              }
              borderRight={borderRight}
              borderBottom={borderBottom}
              cellHeight={cellHeight}
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
);
}

const styles = StyleSheet.create({
container: {
  width: "100%",

  backgroundColor: "#050404",

  borderTopWidth: 1,

  borderColor: "#2B2B2B",
},


  row: {
    flex: 1,
    flexDirection: "row",
  },

  cell: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

borderColor: "#f8f8f8a1",
  },

pressed: {
  backgroundColor: "#f2a90014",
},

  number: {
    color: "#F5F5F5",

   fontSize: 22,
fontWeight: "800",
letterSpacing: 0.4,
  },
});