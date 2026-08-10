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
  onClose: () => void;
  onCopy?: () => void;
  onShare?: () => void;
};

export default function InviteDialog({
  visible,
  roomCode = "SPY-4821",
  onClose,
  onCopy,
  onShare,
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
                  name="person-add-outline"
                  size={18}
                  color="#F2A900"
                />
              </View>

              <View>
                <Text style={styles.title}>
                  Invite Players
                </Text>

                <Text style={styles.subtitle}>
                  Share this room with friends
                </Text>
              </View>
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

          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>
              ROOM CODE
            </Text>

            <Text style={styles.code}>
              {roomCode}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onCopy}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="copy-outline"
                size={15}
                color="#FFF"
              />

              <Text style={styles.secondaryText}>
                Copy Code
              </Text>
            </Pressable>

            <Pressable
              onPress={onShare}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="share-social-outline"
                size={15}
                color="#111"
              />

              <Text style={styles.primaryText}>
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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

    flex: 1,
  },

  iconBox: {
    width: 38,

    height: 38,

    borderRadius: 12,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.10)",
  },

  title: {
    marginLeft: 9,

    color: "#FFF",

    fontSize: 15,

    fontWeight: "900",
  },

  subtitle: {
    marginLeft: 9,

    marginTop: 2,

    color: "#888",

    fontSize: 10,

    fontWeight: "500",
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

  codeSection: {
    marginTop: 16,

    paddingVertical: 14,

    borderRadius: 14,

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.055)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.14)",
  },

  codeLabel: {
    color: "#777",

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 1.2,
  },

  code: {
    marginTop: 5,

    color: "#F2A900",

    fontSize: 23,

    fontWeight: "900",

    letterSpacing: 3,
  },

  actions: {
    flexDirection: "row",

    gap: 8,

    marginTop: 12,
  },

  secondaryButton: {
    flex: 1,

    height: 40,

    borderRadius: 13,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.06)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },

  primaryButton: {
    flex: 1,

    height: 40,

    borderRadius: 13,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F2A900",
  },

  secondaryText: {
    marginLeft: 6,

    color: "#FFF",

    fontSize: 11,

    fontWeight: "800",
  },

  primaryText: {
    marginLeft: 6,

    color: "#111",

    fontSize: 11,

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