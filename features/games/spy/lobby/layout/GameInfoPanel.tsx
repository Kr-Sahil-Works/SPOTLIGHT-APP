import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  INFO_PANEL_MARGIN,
  INFO_PANEL_RADIUS,
} from "../../constants/lobbyLayout";

type Props = {
  roomCode: string;

  gameMode: string;

  players: number;

  maxPlayers: number;

  host: string;

  roomType?: "Public" | "Private";

  onInvite: () => void;

  onReady: () => void;
};

export default function GameInfoPanel({
  roomCode,
  gameMode,
  players,
  maxPlayers,
  host,
  roomType = "Public",
  onInvite,
  onReady,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.roomRow}>
          <Ionicons
            name="key"
            size={16}
            color="#F2A900"
          />

          <Text style={styles.roomCode}>
            {roomCode}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="people"
              size={16}
              color="#F2A900"
            />

            <Text style={styles.infoText}>
              {players}/{maxPlayers}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="game-controller"
              size={16}
              color="#F2A900"
            />

            <Text style={styles.infoText}>
              {gameMode}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="star"
              size={16}
              color="#F2A900"
            />

            <Text
              numberOfLines={1}
              style={styles.infoText}
            >
              {host}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="globe-outline"
              size={16}
              color="#F2A900"
            />

            <Text style={styles.infoText}>
              {roomType}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={onInvite}
          style={styles.secondaryButton}
        >
          <Text
            style={styles.secondaryText}
          >
            Invite
          </Text>
        </Pressable>

        <Pressable
          onPress={onReady}
          style={styles.primaryButton}
        >
          <Text
            style={styles.primaryText}
          >
            Ready
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal:
      INFO_PANEL_MARGIN,

    marginTop: 12,
  },

  card: {
    borderRadius:
      INFO_PANEL_RADIUS,

    padding: 18,

    backgroundColor:
      "rgba(8,8,12,0.72)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },

  roomRow: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 18,

    gap: 8,
  },

  roomCode: {
    color: "#FFF",

    fontSize: 21,

    fontWeight: "900",

    letterSpacing: 2,
  },

  infoRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    marginBottom: 12,
  },

  infoItem: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    flex: 1,
  },

  infoText: {
    color: "#FFF",

    fontSize: 14,

    fontWeight: "700",
  },

  buttonRow: {
    flexDirection: "row",

    gap: 12,

    marginTop: 16,
  },

  secondaryButton: {
    flex: 1,

    height: 48,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "#1A1A1A",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },

  primaryButton: {
    flex: 1,

    height: 48,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "#F2A900",
  },

  secondaryText: {
    color: "#FFF",

    fontSize: 15,

    fontWeight: "700",
  },

  primaryText: {
    color: "#111",

    fontSize: 15,

    fontWeight: "900",
  },
});
