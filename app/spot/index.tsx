import { StyleSheet, Text, View } from "react-native";

export default function SpotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Spot
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
  },
});