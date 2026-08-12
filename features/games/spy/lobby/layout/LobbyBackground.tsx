import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import lobbyWall from "@/assets/images/games/spy/backgrounds/1.png";

export default function LobbyBackground() {
  return (
    <Image
      source={lobbyWall}
      style={styles.background}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
});
