import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function NoPosts() {
  return (
    <View style={styles.noPostsContainer}>
      <Ionicons name="images-outline" size={44} color="#555" />

      <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
        No posts yet
      </Text>

      <Text style={{ color: "#888", fontSize: 14 }}>
        Share your first moment ✨
      </Text>
    </View>
  );
}