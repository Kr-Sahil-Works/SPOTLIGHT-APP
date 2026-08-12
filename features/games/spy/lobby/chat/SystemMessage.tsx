import { StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
};

export default function SystemMessage({
  message,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    paddingVertical: 8,

    paddingHorizontal: 20,
  },

  text: {
    color: "#8E8E8E",

    fontSize: 12,

    fontWeight: "600",

    textAlign: "center",
  },
});
