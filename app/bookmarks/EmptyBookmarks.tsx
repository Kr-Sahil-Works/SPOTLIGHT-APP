import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type EmptyBookmarksProps = {
  onExplore: () => void;
};

export default function EmptyBookmarks({
  onExplore,
}: EmptyBookmarksProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name="bookmark-outline"
          size={40}
          color="#555"
        />
      </View>

      <Text style={styles.title}>
        No bookmarks yet
      </Text>

      <Text style={styles.subtitle}>
        Save posts to view them later.
      </Text>

      <TouchableOpacity
        onPress={onExplore}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Explore Posts
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  icon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  button: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#00ff6a",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});