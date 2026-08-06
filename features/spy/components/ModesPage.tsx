import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { GAME_MODES } from "../constants/rules";

export default function ModesPage() {
  return (
    <View style={styles.container}>
      {GAME_MODES.map((mode) => (
        <View
          key={mode.id}
          style={styles.modeCard}
        >
          <Image
            source={mode.image}
            style={styles.image}
            contentFit="contain"
          />

          <View style={styles.content}>
            <Text style={styles.title}>
              {mode.title}
            </Text>

            <Text style={styles.description}>
              {mode.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "space-evenly",
  },

  modeCard: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#1D1D1D",
  },

  image: {
    width: 120,
    height: 120,

    marginRight: 18,
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 22,

    fontWeight: "900",

    marginBottom: 8,
  },

  description: {
    color: "#A8A8A8",

    fontSize: 14,

    lineHeight: 22,
  },
});