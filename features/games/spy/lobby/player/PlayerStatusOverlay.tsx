import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  isHost: boolean;
  isReady: boolean;
  isSpeaking: boolean;
};

export default function PlayerStatusOverlay({
  isHost,
  isReady,
  isSpeaking,
}: Props) {
  return (
    <>
      {isHost && (
        <View style={[styles.badge, styles.host]}>
          <Ionicons
            name="star"
            size={7}
            color="#FFF"
          />
        </View>
      )}

      {isReady && (
        <View style={[styles.badge, styles.ready]}>
          <Ionicons
            name="checkmark"
            size={7}
            color="#FFF"
          />
        </View>
      )}

      {isSpeaking && (
        <View style={styles.voice}>
          <Ionicons
            name="mic"
            size={7}
            color="#FFF"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",

    width: 12,
    height: 12,

    borderRadius: 6,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
  },

  host: {
    top: -3,
    left: -3,

    backgroundColor: "#F2A900",
  },

  ready: {
    bottom: -3,
    right: -3,

    backgroundColor: "#22C55E",
  },

  voice: {
    position: "absolute",

    bottom: 1,
    left: 1,

    width: 12,
    height: 12,

    borderRadius: 6,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#8B5CF6",

    zIndex: 20,
  },
});