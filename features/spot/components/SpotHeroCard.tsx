import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SpotHeroCard() {
  return (
    <Pressable style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../../../assets/images/spot/moments.png")}
          style={styles.image}
          contentFit="contain"
        />

        <View style={styles.content}>
          <Text style={styles.title}>Moments</Text>
          <Text style={styles.subtitle}>
            Shared memories
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#6E6E6E"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 86,

    marginBottom: 18,

    paddingHorizontal: 18,

    borderRadius: 22,

    backgroundColor: "#171717",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232323",
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 58,
    height: 58,

    marginRight: 14,
  },

  content: {
    justifyContent: "center",
  },

  title: {
    color: "#cdac36",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 2,

    color: "#bbb882",

    fontSize: 13,

    fontWeight: "500",
  },
});