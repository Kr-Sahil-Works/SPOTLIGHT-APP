import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SpotGrid from "./components/SpotGrid";
import SpotHeader from "./components/SpotHeader";
import SpotHeroCard from "./components/SpotHeroCard";

import { router } from "expo-router";

import MagicLever from "./components/magiclever/MagicLever";


export default function SpotScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close whenever user leaves this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setMenuOpen(false);
      };
    }, [])
  );

  // Android back closes menu first
  useEffect(() => {
    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (menuOpen) {
          closeMenu();
          return true;
        }

        return false;
      }
    );

    return () => sub.remove();
  }, [menuOpen]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SpotHeader />

        <SpotHeroCard />

        <SpotGrid />
      </ScrollView>

<MagicLever
  onToolPress={(tool) => {
    router.push(tool.route as never);
  }}
/>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090909",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,

    paddingBottom: 140,
  },
});