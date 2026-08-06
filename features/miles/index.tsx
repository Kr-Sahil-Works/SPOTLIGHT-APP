import { Image } from "expo-image";
import {
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import GameCard from "./components/GameCard";
import GamesHeader from "./components/GameHeader";
import MilesHeader from "./components/MilesHeader";
import QuickStats from "./components/QuickStats";

import { router } from "expo-router";

export default function MilesScreen() {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={["bottom", "left", "right"]}
    >
      <View style={styles.container}>
        {/* Background */}
        <Image
          source={require("@/assets/images/miles/milebg.webp")}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />

        {/* Optional dark overlay */}
        <View style={styles.overlay} />

        <Animated.ScrollView
          entering={FadeIn.duration(350)}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <MilesHeader />

          <QuickStats />

          <GamesHeader />

        <GameCard
  image={require("@/assets/images/miles/spy.png")}
  onPress={() => router.push("/games/spy")}
/>

          <GameCard
            image={require("@/assets/images/miles/blind_cards.png")}
          />
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.20)", // Adjust 0–0.35
  },

  content: {
    paddingBottom: 110,
  },
});