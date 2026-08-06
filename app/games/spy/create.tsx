
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { useState } from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import createpagebgc from "@/assets/images/games/spy/backgrounds/createpagebgc.webp";
import notesIcon from "@/assets/images/games/spy/icons/notes.webp";
import AdvancedOptionsSelector from "@/shared/components/ui/AdvancedOptionsSelector";
import GameModeSelector from "@/shared/components/ui/GameModeSelector";
import Toggle from "@/shared/components/ui/Toogle";

const modeIcons = {
  spy: require("@/assets/images/games/spy/modes/spy_mode.webp"),

  wordless: require("@/assets/images/games/spy/modes/wordless_mode.webp"),

  master: require("@/assets/images/games/spy/modes/master_mode.webp"),

  y2: require("@/assets/images/games/spy/modes/y2_mode.webp"),
};

const modeTitles = {
  spy: "Who's the Spy",

  wordless: "Wordless",

  master: "Master",

  y2: "Y2 Spy",
};

const modeDescriptions = {
  spy: "Classic mode",

  wordless: "Guess silently",

  master: "Advanced roles",

  y2: "Fast rounds",
};

export default function CreateRoomScreen() {
type GameMode =
  | "spy"
  | "wordless"
  | "master"
  | "y2";

const [selectedMode, setSelectedMode] =
  useState<GameMode>("spy");

  const [players, setPlayers] =
    useState(6);

  const [passwordEnabled, setPasswordEnabled] =
    useState(false);

  const [advancedEnabled, setAdvancedEnabled] =
    useState(false);

  const [expandedFeatures, setExpandedFeatures] =
    useState(false);

  const [expandedModes, setExpandedModes] =
    useState(false);


  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right"]}
    >
      {/* Background */}

      <Image
        source={createpagebgc}
        style={styles.background}
        contentFit="cover"
      />

      <View style={styles.overlay} />

      {/* Floating Back */}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color="#F2A900"
        />
      </Pressable>

      <Pressable
    style={styles.rulesButton}
    onPress={() =>
        router.push("/games/spy/how-to-play")
    }
>
<Image
source={notesIcon}
style={{
width:22,
height:22,
}}
contentFit="contain"
/>
</Pressable>

        {/* Floating Card */}

       <View style={styles.content}>
  <View style={styles.card}>

 <View style={styles.glassHighlight} />

<View
  pointerEvents="none"
  style={styles.innerBorder}
/>

          <Text style={styles.title}>
            CREATE ROOM
          </Text>

          <View style={styles.divider} />

          {/* Game Mode */}

 {/* ================= GAME MODE ================= */}

{!advancedEnabled && (
  <>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionRow}>
        <Ionicons
          name="game-controller-outline"
          size={13}
          color="#C79B14"
        />

        <Text style={styles.section}>
          GAME MODE
        </Text>
      </View>

      <Pressable
        style={styles.expandButton}
        onPress={() =>
          setExpandedModes(!expandedModes)
        }
      >
        <Ionicons
          name={
            expandedModes
              ? "chevron-up"
              : "chevron-down"
          }
          size={18}
          color="#C79B14"
        />
      </Pressable>
    </View>

    {expandedModes ? (
      <GameModeSelector
        selectedMode={selectedMode}
        onSelect={(mode) => {
          setSelectedMode(mode);
          setExpandedModes(false);
        }}
      />
    ) : (
      <Pressable
        style={styles.selectedModeCard}
        onPress={() =>
          setExpandedModes(true)
        }
      >
        <Image
          source={modeIcons[selectedMode]}
          style={styles.modeIcon}
          contentFit="cover"
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.selectedTitle}>
            {modeTitles[selectedMode]}
          </Text>

          <Text style={styles.selectedSubtitle}>
            {
              modeDescriptions[
                selectedMode
              ]
            }
          </Text>
        </View>
      </Pressable>
    )}
  </>
)}

{/* ================= PLAYERS ================= */}

{!expandedModes && !advancedEnabled && (
  <>
    <View style={styles.sectionRow}>
      <Ionicons
        name="people-outline"
        size={13}
        color="#C79B14"
      />

      <Text style={styles.section}>
        PLAYERS
      </Text>
    </View>

    <View style={styles.playersRow}>
      <Pressable
        style={styles.circle}
        onPress={() =>
          setPlayers((p) =>
            Math.max(4, p - 1)
          )
        }
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color="#FFF"
        />
      </Pressable>

      <Text style={styles.players}>
        {players}
      </Text>

      <Pressable
        style={styles.circle}
        onPress={() =>
          setPlayers((p) =>
            Math.min(12, p + 1)
          )
        }
      >
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#FFF"
        />
      </Pressable>
    </View>
  </>
)}



{/* ================= EXTRA FEATURES ================= */}

{!expandedModes && (
  <>
    <View style={styles.sectionRow}>
      <Ionicons
        name="sparkles-outline"
        size={13}
        color="#C79B14"
      />

      <Text style={styles.section}>
        EXTRA FEATURES
      </Text>
    </View>

    {/* Advanced Room Toggle */}

    <View style={styles.optionRow}>
      <View>
        <Text style={styles.optionTitle}>
          Advanced Room
        </Text>

        <Text style={styles.optionSubtitle}>
          Unlock extra gameplay settings
        </Text>
      </View>

      <Toggle
        value={advancedEnabled}
        onChange={setAdvancedEnabled}
      />
    </View>

    {/* Advanced Options */}

    {advancedEnabled && (
      <AdvancedOptionsSelector
        passwordEnabled={passwordEnabled}
        setPasswordEnabled={setPasswordEnabled}
      />
    )}
  </>
)}

<View style={{ flex: 1 }} />


          {/* Create Button */}
          <View style={{ flex: 1 }} />

      <View style={styles.buttonWrapper}>

  <View style={styles.buttonGlow} />

  <Pressable
    style={styles.createButton}
  >
            <Ionicons
              name="add-circle"
              size={18}
              color="#111"
            />

            <Text style={styles.createText}>
              CREATE ROOM
            </Text>

          </Pressable>

        </View>
        </View>
        </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  backButton: {
    position: "absolute",

    top: 18,
    left: 22,

    width: 30,
    height: 30,

    borderRadius: 10,

    backgroundColor: "#121212E8",

    borderWidth: 1,
    borderColor: "#2F2F2F",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
  },

 content: {
  flex: 1,

  justifyContent: "center",
  alignItems: "center",

  paddingHorizontal: 20,

  paddingTop: 12,
},

card: {
  width: "90%",
  maxWidth: 520,
  minHeight: 500,
  maxHeight: 540,

  backgroundColor: "#141414c7",

  borderRadius: 20,

  borderWidth: 1,
  borderColor: "#b19600",

  overflow: "hidden",

  paddingHorizontal: 22,
  paddingTop: 24,
  paddingBottom: 30,
},

rulesButton: {
    position: "absolute",

    top: 18,
    right: 22,

    width: 30,
    height: 30,

    borderRadius: 10,

    backgroundColor: "#121212E8",

    borderWidth: 1,
    borderColor: "#2F2F2F",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
},


title: {
  textAlign: "center",

  color: "#FFFFFF",

  fontSize: 20,

  fontWeight: "900",

  letterSpacing: 2.4,
},

glassHighlight: {
  position: "absolute",

  top: -55,

  left: -40,

  width: "145%",

  height: 170,

  borderRadius: 200,

  backgroundColor: "rgba(255,255,255,0.055)",

  transform: [
    {
      rotate: "-10deg",
    },
  ],
},

innerBorder: {
  position: "absolute",

  top: 1,

  left: 1,

  right: 1,

  bottom: 1,

  borderRadius: 19,

  borderWidth: 1,

  borderColor: "rgba(255,255,255,0.065)",
},

  divider: {
    width: 58,

    height: 3,

    borderRadius: 20,

    alignSelf: "center",

    marginTop: 10,
    marginBottom: 22,

    backgroundColor: "#F2A900",
  },

  expandButton: {
  width: 28,
  height: 28,

  borderRadius: 8,

  justifyContent: "center",
  alignItems: "center",

  backgroundColor: "rgba(255,255,255,0.03)",
},


  sectionHeader: {
  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: 8,
},

  sectionRow: {
  flexDirection: "row",

  alignItems: "center",

  gap: 6,

  marginBottom: 8,

  marginTop: 2,
},


section: {
  color: "#C79B14",

  fontSize: 10,

  fontWeight: "900",

  letterSpacing: 2,

  textTransform: "uppercase",
},

selectedModeCard: {
  height: 74,

  marginBottom: 18,

  borderRadius: 18,

  backgroundColor: "#100f0f",

  borderWidth: 1,

  borderColor: "#3A3A3A",

  paddingHorizontal: 16,

  flexDirection: "row",

  alignItems: "center",
},

modeIcon: {
  width: 48,

  height: 48,

  borderRadius: 12,

  marginRight: 14,
},

selectedTitle: {
  color: "#FFFFFF",

  fontSize: 18,

  fontWeight: "800",
},

selectedSubtitle: {
  marginTop: 2,

  color: "#8A8A8A",

  fontSize: 12,
},


  modeScroll: {
    paddingRight: 18,

    paddingBottom: 20,
  },

  modeButton: {
    height: 34,

    paddingHorizontal: 14,

    marginRight: 10,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#202020",

    borderWidth: 1,
    borderColor: "#383838",
  },

  modeSelected: {
    backgroundColor: "#F2A90018",

    borderColor: "#F2A900",
  },

  modeText: {
    color: "#8D8D8D",

    fontSize: 12,

    fontWeight: "700",
  },

  modeTextSelected: {
    color: "#F2A900",
  },

  playersRow: {
    height: 54,

    marginBottom: 18,

    borderRadius: 18,

    backgroundColor: "#100f0f",

    borderWidth: 1,
    borderColor: "#343434",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 18,
  },

  circle: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: "#2C2C2C",

    borderWidth: 1,
    borderColor: "#3A3A3A",

    justifyContent: "center",
    alignItems: "center",
  },

  players: {
    color: "#FFF",

    fontSize: 24,

    fontWeight: "900",
  },

  optionRow: {
    height: 58,

    marginBottom: 14,

    borderRadius: 18,

    backgroundColor: "#100f0f",

    borderWidth: 1,
    borderColor: "#333",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 16,
  },

  optionTitle: {
    color: "#F5F5F5",

    fontSize: 15,

    fontWeight: "700",
  },

  optionSubtitle: {
    marginTop: 3,

    color: "#7C7C7C",

    fontSize: 8,

    fontWeight: "500",
  },

  buttonWrapper: {
  marginTop: 8,

  alignItems: "center",

  justifyContent: "center",
},

buttonGlow: {
  position: "absolute",

  width: "100%",

  height: 58,

  borderRadius: 40,

  backgroundColor: "#F2A900",
  

  opacity: 0.18,

  transform: [
    {
      scale: 1.08,
    },
  ],

  shadowColor: "#F2A900",

  shadowOpacity: 0.55,

  shadowRadius: 34,

  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 20,
},

  createButton: {
    height: 48,
    width:"100%",

    borderRadius: 20,

    backgroundColor: "#F2A900",

    shadowColor: "#F2A900",

shadowOpacity: 0.35,

shadowRadius: 14,

shadowOffset: {
  width: 0,
  height: 6,
},

elevation: 10,
    borderWidth: 1,
    borderColor: "#FFD76A",

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 8,
  },

  createText: {
    color: "#111",

    fontSize: 14,

    fontWeight: "900",

    letterSpacing: 1,
  },
});