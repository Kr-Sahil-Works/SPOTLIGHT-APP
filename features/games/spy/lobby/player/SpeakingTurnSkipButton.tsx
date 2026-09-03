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
    height: 25,

    paddingHorizontal: 14,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.07)",

    borderWidth: 1,
    borderColor:
      "rgba(242,169,0,0.30)",

    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 1,
    },

    elevation: 2,
  },

  text: {
    color: "#D09A00",

    fontSize: 7.5,
    fontWeight: "900",

    letterSpacing: 0.8,
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  disabled: {
    opacity: 0.35,
  },
});