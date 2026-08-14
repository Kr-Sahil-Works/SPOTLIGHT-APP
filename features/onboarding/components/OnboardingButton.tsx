import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function OnboardingButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    minWidth: 132,

    paddingHorizontal: 24,

    borderRadius: 28,

    backgroundColor: "#D9A92E",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#D9A92E",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,

    elevation: 5,
  },

  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  text: {
    color: "#090909",

    fontSize: 16,
    fontWeight: "700",
  },
});