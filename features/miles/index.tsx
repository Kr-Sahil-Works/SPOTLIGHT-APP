import { SafeAreaView } from "react-native-safe-area-context";

import MilesHeader from "./components/header/MilesHeader";
import MilesGrid from "./components/layout/MilesGrid";

export default function MilesScreen() {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <MilesHeader />

      <MilesGrid />
    </SafeAreaView>
  );
}