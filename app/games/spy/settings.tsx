import { StyleSheet, Text, View } from "react-native";

export default function SpySettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Spy Settings
      </Text>

      <Text style={styles.subtitle}>
        Settings coming soon
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
    color: "#F2A900",
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#888",
    marginTop: 8,
    fontSize: 13,
  },
});