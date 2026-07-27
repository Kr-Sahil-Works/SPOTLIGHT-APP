import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function SpotHeroCard() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../../../assets/images/spot/moments.png")}
          style={styles.image}
          contentFit="contain"
        />

        <View>
          <Text style={styles.title}>Moments</Text>
          <Text style={styles.subtitle}>
            Your shared memories
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="#8A8A8A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,

    marginBottom: 20,

    paddingHorizontal: 18,

    borderRadius: 28,

    backgroundColor: "#171717",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  image: {
    width: 64,
    height: 64,

    marginRight: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 3,

    color: "#8F8F8F",

    fontSize: 14,
    fontWeight: "500",
  },
});