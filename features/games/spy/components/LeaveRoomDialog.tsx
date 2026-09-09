import React from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import LobbyOverlay from "@/features/games/spy/lobby/layout/LobbyOverlay";

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
    <LobbyOverlay
      visible={visible}
      onClose={onStay}
    >
      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Leave Room?
          </Text>

          <Text style={styles.message}>
            Are you sure you want to leave this room?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onStay}
              style={styles.stayButton}
            >
              <Text style={styles.stayText}>
                Stay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onLeave}
              style={styles.leaveButton}
            >
              <Text style={styles.leaveText}>
                Leave
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LobbyOverlay>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "82%",
    backgroundColor: "#1c1c1e",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  message: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  stayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },

  stayText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "600",
  },

  leaveButton: {
    backgroundColor: "#ff453a",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  leaveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});