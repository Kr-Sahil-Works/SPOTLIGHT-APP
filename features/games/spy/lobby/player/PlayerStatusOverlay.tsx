import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  isHost: boolean;
  isReady: boolean;
  isSpeaking: boolean;
  isPlaying?: boolean;
  isEliminated?: boolean;
};

export default function PlayerStatusOverlay({
  isHost,
  isReady,
  isSpeaking,
  isPlaying = false,
  isEliminated = false,
}: Props) {

  if (isPlaying) {
  if (!isEliminated) {
    return null;
  }

  return null;
}

  return (
    <>
      {/* =========================
          👑 HOST
      ========================= */}

      {isHost && (
        <View style={styles.hostDot}>
          <Ionicons
            name="star"
            size={6}
            color="#F2A900"
          />
        </View>
      )}

      {/* =========================
          ✅ READY
      ========================= */}

      {isReady && (
        <View style={styles.readyDot}>
          <Ionicons
            name="checkmark"
            size={7}
            color="#FFF"
          />
        </View>
      )}

      {/* =========================
          🎤 SPEAKING
          
          No separate badge.
          PlayerAvatar handles the
          speaking/turn indicator.
      ========================= */}
    </>
  );
}

const styles = StyleSheet.create({
  /*
   * =========================
   * 👑 HOST
   * =========================
   */

  hostDot: {
    position: "absolute",

    top: -2,
    left: -2,

    width: 11,
    height: 11,

    borderRadius: 5.5,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(18,18,22,0.94)",

    borderWidth: 1,

    borderColor:
      "#F2A900",

    zIndex: 20,
  },

  /*
   * =========================
   * ✅ READY
   * =========================
   */

  readyDot: {
    position: "absolute",

    bottom: -2,
    right: -2,

    width: 11,
    height: 11,

    borderRadius: 5.5,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "#2ED428",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.25)",

    zIndex: 20,
  },
});