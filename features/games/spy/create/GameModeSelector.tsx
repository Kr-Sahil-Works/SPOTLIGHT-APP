import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import masterMode from "@/assets/images/games/spy/modes/master_mode.webp";
import spyMode from "@/assets/images/games/spy/modes/spy_mode.webp";
import wordlessMode from "@/assets/images/games/spy/modes/wordless_mode.webp";
import y2Mode from "@/assets/images/games/spy/modes/y2_mode.webp";


type GameMode =
  | "spy"
  | "wordless"
  | "master"
  | "y2";


  const MODES: {
  id: GameMode;
  title: string;
  subtitle: string;
  image: any;
}[] = [
  {
    id: "spy",
    title: "Who's the Spy",
    subtitle: "Classic mode",
    image: spyMode,
  },
  {
    id: "wordless",
    title: "Wordless",
    subtitle: "Guess silently",
    image: wordlessMode,
  },
  {
    id: "master",
    title: "Master",
    subtitle: "Advanced roles",
    image: masterMode,
  },
  {
    id: "y2",
    title: "Y2 Spy",
    subtitle: "Fast rounds",
    image: y2Mode,
  },
];

type Props = {
  selectedMode: string;

onSelect: (mode: GameMode) => void;
};

export default function GameModeSelector({
  selectedMode,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {MODES.map((mode) => {
        const selected =
          selectedMode === mode.id;

        return (
          <Pressable
            key={mode.id}
            onPress={() =>
              onSelect(mode.id)
            }
            style={[
              styles.card,
              selected &&
                styles.selectedCard,
            ]}
          >
            <Image
              source={mode.image}
              style={styles.image}
              contentFit="cover"
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {mode.title}
              </Text>

              <Text
                style={styles.subtitle}
              >
                {mode.subtitle}
              </Text>
            </View>

            {selected && (
              <View
                style={styles.tick}
              >
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#111"
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  card: {
    height: 82,

    borderRadius: 18,

    marginBottom: 12,

    paddingHorizontal: 14,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#100f0f",

    borderWidth: 1,

    borderColor: "#3A3A3A",
  },

  selectedCard: {
    backgroundColor:
      "#f2a90014",

    borderColor: "#F2A900",
  },

  image: {
    width: 48,

    height: 48,

    borderRadius: 14,

    marginRight: 16,
  },

  title: {
    color: "#FFF",

    fontSize: 18,

    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,

    color: "#888",

    fontSize: 12,
  },

  tick: {
    width: 34,

    height: 34,

    borderRadius: 17,

    backgroundColor: "#F2A900",

    justifyContent: "center",

    alignItems: "center",
  },
});