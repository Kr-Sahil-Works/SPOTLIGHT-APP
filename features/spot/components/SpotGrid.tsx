import { StyleSheet, View } from "react-native";

import SpotMiniCard from "./SpotMiniCard";

export default function SpotGrid() {
  return (
    <View style={styles.container}>
        <SpotMiniCard
        title="Mystery"
        image={require("@/assets/images/spot/mystery.png")}
      />
      <SpotMiniCard
        title="Family"
        image={require("@/assets/images/spot/family.png")}
      />

    

      <SpotMiniCard
        title="Themes"
        image={require("@/assets/images/spot/themes.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 4,
  },
});