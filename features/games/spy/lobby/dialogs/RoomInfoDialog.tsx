import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  roomCode?: string;
  roomName?: string;
  currentPlayers?: number;
  maxPlayers?: number;
  gameMode?: string;
  onClose: () => void;
};

export default function RoomInfoDialog({
  visible,
  roomCode = "SPY-4821",
  roomName = "Waiting Room",
  currentPlayers = 6,
  maxPlayers = 8,
  gameMode = "Classic",
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="information-outline"
                  size={18}
                  color="#F2A900"
                />
              </View>

              <Text style={styles.title}>
                Room Info
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="close"
                size={18}
                color="#AAA"
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <InfoRow
              icon="home-outline"
              label="Room"
              value={roomName}
            />

            <InfoRow
              icon="key-outline"
              label="Room Code"
              value={roomCode}
              accent
            />

            <InfoRow
              icon="people-outline"
              label="Players"
              value={`${currentPlayers}/${maxPlayers}`}
            />

            <InfoRow
              icon="game-controller-outline"
              label="Mode"
              value={gameMode}
            />
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.doneText}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: boolean;
};

function InfoRow({
  icon,
  label,
  value,
  accent = false,
}: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={15}
          color="#888"
        />

        <Text style={styles.label}>
          {label}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.value,
          accent && styles.accentValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 24,

    backgroundColor:
      "rgba(0,0,0,0.68)",
  },

  dialog: {
    width: "100%",

    maxWidth: 340,

    padding: 16,

    borderRadius: 20,

    backgroundColor:
      "rgba(15,15,20,0.98)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.09)",

    shadowColor: "#000",

    shadowOpacity: 0.5,

    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 16,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  iconBox: {
    width: 36,

    height: 36,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.10)",
  },

  title: {
    marginLeft: 9,

    color: "#FFF",

    fontSize: 16,

    fontWeight: "900",
  },

  closeButton: {
    width: 32,

    height: 32,

    borderRadius: 10,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.05)",
  },

  content: {
    marginTop: 14,

    padding: 10,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.025)",
  },

  row: {
    minHeight: 38,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 4,

    borderBottomWidth: 1,

    borderBottomColor:
      "rgba(255,255,255,0.045)",
  },

  rowLeft: {
    flexDirection: "row",

    alignItems: "center",
  },

  label: {
    marginLeft: 8,

    color: "#888",

    fontSize: 11,

    fontWeight: "600",
  },

  value: {
    maxWidth: "52%",

    color: "#E8E8E8",

    fontSize: 11,

    fontWeight: "800",

    textAlign: "right",
  },

  accentValue: {
    color: "#F2A900",

    letterSpacing: 1,
  },

  doneButton: {
    height: 40,

    marginTop: 12,

    borderRadius: 13,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.12)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.20)",
  },

  doneText: {
    color: "#F2A900",

    fontSize: 12,

    fontWeight: "900",
  },

  pressed: {
    opacity: 0.65,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
});