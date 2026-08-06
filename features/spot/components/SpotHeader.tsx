import { StyleSheet, Text, View } from "react-native";

export default function SpotHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spot</Text>

      <View style={styles.iconContainer}>
      <Text style={styles.sparkle}>
        ✦
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginBottom: 16,
    position: "relative",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#c9961f",
    letterSpacing: 0.3,
  },

  iconContainer: {
    position: "absolute",
    top: -3,
    right: -16,
  },
  sparkle : {
    color:"#d79119"
  },
});