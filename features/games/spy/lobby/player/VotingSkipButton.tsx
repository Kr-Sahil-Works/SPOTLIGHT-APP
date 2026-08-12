import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  visible: boolean;
  onPress?: () => void;
};

export default function VotingSkipButton({
  visible,
  onPress,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>SKIP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 58,
    height: 28,
    paddingHorizontal: 16,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.08)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  text: {
    color: "#C8C8C8",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
});
