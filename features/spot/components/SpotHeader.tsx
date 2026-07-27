import { StyleSheet, Text, View } from "react-native";

export default function SpotHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MagicSpot</Text>

      <View style={styles.sparkleContainer}>
        <Text style={styles.sparkle}>✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
    position: "relative",
    alignSelf: "flex-start",
  },

  title: {
    fontSize: 26,
    fontWeight: "400",
    color: "#F1F3F3",
    letterSpacing: 1.5,
  },

  sparkleContainer: {
    position: "absolute",
    right: -22,
    top: -8,
  },

  sparkle: {
    fontSize: 18,
  },
});