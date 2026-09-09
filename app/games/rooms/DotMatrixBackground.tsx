import { Image } from "expo-image";
import { StyleSheet } from "react-native";

export default function DotMatrixBackground() {
  return (
    <Image
      source={require("@/assets/images/games/spy/backgrounds/dots_martix.png")}
      style={styles.background}
      contentFit="cover"
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,

    width: "100%",
    height: "100%",

    zIndex: 0,
  },
});