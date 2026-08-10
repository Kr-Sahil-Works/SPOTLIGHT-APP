import { StyleSheet, Text, View } from "react-native";

type Props = {
  username?: string;
  visible?: boolean;
};

export default function TypingIndicator({
  username = "Someone",
  visible = false,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {username} is typing...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,

    paddingBottom: 8,
  },

  text: {
    color: "#888",

    fontSize: 12,

    fontStyle: "italic",
  },
});