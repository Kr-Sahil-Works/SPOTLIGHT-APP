import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  currentPlayers: number;
  maxPlayers: number;
  roomStatus: string;
  isHost?: boolean;
  onInvite?: () => void;
  onReady?: () => void;
};

export default function LobbyInfoPanel({
  currentPlayers,
  maxPlayers,
  roomStatus,
  isHost = false,
  onInvite,
  onReady,
}: Props) {
  const compact = currentPlayers >= 7;

  return (
    <View
      style={[
        styles.container,
        compact && styles.compactContainer,
      ]}
    >
      {!compact && (
        <View style={styles.left}>
          <Ionicons
            name="people-outline"
            size={14}
            color="#F2A900"
          />

          <Text style={styles.players}>
            {currentPlayers}/{maxPlayers}
          </Text>

          <View style={styles.dot} />

          <Text
            numberOfLines={1}
            style={styles.status}
          >
            {roomStatus}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.right,
          compact && styles.compactRight,
        ]}
      >
        <Pressable
          onPress={onInvite}
          style={({ pressed }) => [
            styles.inviteButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="person-add-outline"
            size={14}
            color="#FFF"
          />

          <Text style={styles.inviteText}>
            Invite
          </Text>
        </Pressable>

        <Pressable
          onPress={onReady}
          style={({ pressed }) => [
            styles.readyButton,
            pressed && styles.readyPressed,
          ]}
        >
          <Text style={styles.readyText}>
            {isHost ? "Start" : "Ready"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,

    marginHorizontal: 26,

    paddingHorizontal: 18,

    borderRadius: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(12,12,17,0.78)",

    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.22)",
  },

  compactContainer: {
    height: 44,

    justifyContent: "center",

    paddingHorizontal: 10,

    marginHorizontal: 90,

    borderRadius: 22,

    backgroundColor: "rgba(10,10,15,0.82)",

    borderColor: "rgba(242,169,0,0.18)",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",

    minWidth: 0,
    flexShrink: 1,
  },

  players: {
    marginLeft: 5,

    color: "#FFF",

    fontSize: 12,
    fontWeight: "800",
  },

  dot: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: "#F2A900",

    marginHorizontal: 7,
  },

  status: {
    color: "#A8A8A8",

    fontSize: 10,
    fontWeight: "600",

    flexShrink: 1,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",

    marginLeft: 8,
  },

  compactRight: {
    marginLeft: 0,

    justifyContent: "center",
  },

  inviteButton: {
    height: 29,

    paddingHorizontal: 10,

    borderRadius: 15,

    backgroundColor: "rgba(255,255,255,0.07)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginRight: 6,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  inviteText: {
    color: "#FFF",

    marginLeft: 4,

    fontSize: 10,
    fontWeight: "700",
  },

  readyButton: {
    height: 29,

    minWidth: 58,

    paddingHorizontal: 12,

    borderRadius: 15,

    backgroundColor: "#F2A900",

    justifyContent: "center",
    alignItems: "center",
  },

  readyText: {
    color: "#111",

    fontSize: 11,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  readyPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },
});