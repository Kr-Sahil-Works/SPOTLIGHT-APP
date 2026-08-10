import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onStay: () => void;
  onLeave: () => void;
};

export default function LeaveRoomDialog({
  visible,
  onStay,
  onLeave,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onStay}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.icon}>
            <Ionicons
              name="exit-outline"
              size={22}
              color="#F2A900"
            />
          </View>

          <Text style={styles.title}>
            Leave room?
          </Text>

          <Text style={styles.message}>
            Are you sure you want to leave
            this game room?
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onStay}
              style={({ pressed }) => [
                styles.stayButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.stayText}>
                Stay
              </Text>
            </Pressable>

            <Pressable
              onPress={onLeave}
              style={({ pressed }) => [
                styles.leaveButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.leaveText}>
                Leave
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

    padding: 20,

    borderRadius: 22,

    alignItems: "center",

    backgroundColor:
      "rgba(16,16,21,0.98)",

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

  icon: {
    width: 46,

    height: 46,

    borderRadius: 15,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.10)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.18)",
  },

  title: {
    marginTop: 13,

    color: "#FFF",

    fontSize: 18,

    fontWeight: "900",
  },

  message: {
    marginTop: 7,

    maxWidth: 270,

    color: "#9D9DA3",

    fontSize: 12,

    lineHeight: 18,

    textAlign: "center",

    fontWeight: "500",
  },

  actions: {
    width: "100%",

    flexDirection: "row",

    gap: 8,

    marginTop: 20,
  },

  stayButton: {
    flex: 1,

    height: 42,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.07)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },

  leaveButton: {
    flex: 1,

    height: 42,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(255,70,70,0.12)",

    borderWidth: 1,

    borderColor:
      "rgba(255,80,80,0.25)",
  },

  stayText: {
    color: "#FFF",

    fontSize: 12,

    fontWeight: "800",
  },

  leaveText: {
    color: "#FF6666",

    fontSize: 12,

    fontWeight: "800",
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