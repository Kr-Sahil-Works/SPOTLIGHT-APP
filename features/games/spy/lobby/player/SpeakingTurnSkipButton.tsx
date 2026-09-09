import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  visible: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function SpeakingTurnSkipButton({
  visible,
  disabled = false,
  onPress,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>
        SKIP TURN
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 68,
    height: 28,

    paddingHorizontal: 16,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "#080808e1",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.24)",

    transform: [
      {
        translateY: 8,
      },
    ],
  },

  text: {
    color: "#9b7305",

    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 0.8,
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        translateY: 8,
      },
      {
        scale: 0.94,
      },
    ],
  },

  disabled: {
    opacity: 0.35,
  },
});