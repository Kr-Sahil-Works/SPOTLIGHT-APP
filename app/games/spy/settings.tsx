import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import LeaveRoomDialog from "@/features/games/spy/components/LeaveRoomDialog";
import { useLobby } from "@/features/games/spy/lobby/hooks/useLobby";
import { useLobbyPlayers } from "@/features/games/spy/lobby/hooks/useLobbyPlayers";

export default function RoomSettingsScreen() {
  const { roomId } = useLocalSearchParams<{
    roomId?: string;
  }>();

  const validRoomId = roomId
    ? (roomId as Id<"gameRooms">)
    : undefined;

  const { room } = useLobby(roomId);
  const { players } = useLobbyPlayers(roomId);

  const currentPlayer = useQuery(
    api.games.spy.rooms.getCurrentPlayer,
    validRoomId
      ? {
          roomId: validRoomId,
        }
      : "skip"
  );

const updateRoomMaxPlayers = useMutation(
    api.games.spy.rooms.updateRoomMaxPlayers
  );

  const leaveRoom = useMutation(
    api.games.spy.rooms.leaveRoom
  );

  const isHost =
    currentPlayer?.isHost === true;

  const isLobby =
    room?.status === "lobby";

  const [selectedPlayers, setSelectedPlayers] =
    useState<number | null>(null);

 const [saving, setSaving] =
    useState(false);

const [
  showLeaveDialog,
  setShowLeaveDialog,
] = useState(false);


  const [error, setError] =
    useState<string | null>(null);

  const playerLimit =
    selectedPlayers ??
    room?.maxPlayers ??
    4;

const roomDisplayName =
    room?.roomCode ?? "—";

const handleExitRoom = () => {
  if (!validRoomId) {
    return;
  }

  setShowLeaveDialog(true);
};


const handleConfirmLeaveRoom = async () => {
  if (!validRoomId) {
    return;
  }

  try {
    setShowLeaveDialog(false);

   await leaveRoom({
  roomId: validRoomId,
});

router.replace("/games/spy");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to exit room."
    );
  }
};

const handlePlayerLimitChange = (
  next: number
) => {
  setSelectedPlayers(
    Math.min(
      8,
      Math.max(4, next)
    )
  );
};

const handleSavePlayers = async () => {
    if (
      !validRoomId ||
      !isHost ||
      !isLobby ||
      playerLimit === room?.maxPlayers
    ) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateRoomMaxPlayers({
        roomId: validRoomId,
        maxPlayers: playerLimit,
      });

      setSelectedPlayers(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update room settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
   <>
  <SafeAreaView
    style={styles.container}
    edges={["top", "left", "right"]}
  >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#D6D6D6"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
      <SettingRow
  label="Room Name"
  value={roomDisplayName}
/>

        <SettingRow
          label="Room ID"
          value={room?.roomCode ?? "—"}
          showChevron
        />

        <SettingRow
          label="Password"
          value={
            room?.passwordEnabled
              ? "Enabled"
              : "Off"
          }
        />

        <SettingRow
          label="Game Mode"
          value={
            room?.gameMode === "spy"
              ? "Who's the Spy"
              : room?.gameMode ?? "—"
          }
          showChevron
        />

        <View style={styles.separator} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            ROOM SIZE
          </Text>

          {isHost && isLobby && (
            <Text style={styles.hostLabel}>
              HOST
            </Text>
          )}
        </View>

        <View style={styles.settingCard}>
          <View>
            <Text style={styles.rowTitle}>
              Players
            </Text>

            <Text style={styles.rowSubtitle}>
              {players.length} / {playerLimit} players
            </Text>
          </View>

          {isHost && isLobby ? (
            <View style={styles.playerCounter}>
              <Pressable
                style={[
                  styles.counterButton,
                  playerLimit <= 4 &&
                    styles.counterButtonDisabled,
                ]}
                disabled={playerLimit <= 4}
                onPress={() =>
                  handlePlayerLimitChange(
                    playerLimit - 1
                  )
                }
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={
                    playerLimit <= 4
                      ? "#555"
                      : "#FFF"
                  }
                />
              </Pressable>

              <Text style={styles.playerCount}>
                {playerLimit}
              </Text>

              <Pressable
                style={[
                  styles.counterButton,
                  playerLimit >= 8 &&
                    styles.counterButtonDisabled,
                ]}
                disabled={playerLimit >= 8}
                onPress={() =>
                  handlePlayerLimitChange(
                    playerLimit + 1
                  )
                }
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={
                    playerLimit >= 8
                      ? "#555"
                      : "#FFF"
                  }
                />
              </Pressable>
            </View>
          ) : (
            <View style={styles.readOnlyValue}>
              <Text style={styles.readOnlyText}>
                {playerLimit}
              </Text>
            </View>
          )}
        </View>

        {isHost && isLobby && (
          <View style={styles.requirementCard}>
            <Ionicons
              name="people-outline"
              size={18}
              color="#F2A900"
            />

            <Text
              style={styles.requirementText}
            >
              The game starts only when all{" "}
              {playerLimit} seats are filled.
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#E66B5D"
            />

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {isHost && isLobby && (
          <Pressable
            style={[
              styles.saveButton,
              (saving ||
                playerLimit ===
                  room?.maxPlayers) &&
                styles.saveButtonDisabled,
            ]}
            disabled={
              saving ||
              playerLimit ===
                room?.maxPlayers
            }
            onPress={handleSavePlayers}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? "SAVING..."
                : "SAVE ROOM SETTINGS"}
            </Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            ROOM FEATURES
          </Text>
        </View>

     <SettingRow
  label="New Msg Notify"
  value="Off"
  showToggle
  toggleOn={false}
  disabled
/>

        {isHost && (
          <>
          <SettingRow
  label="Advanced Room Features"
  value="Disabled"
  showChevron
  disabled
/>

          <SettingRow
  label="Background"
  value="Disabled"
  showChevron
  disabled
/>

         <SettingRow
  label="Announcement"
  value="Disabled"
  showChevron
  disabled
/>

          <SettingRow
  label="Admin"
  value="Disabled"
  showChevron
  disabled
/>
          </>
        )}

        {!isHost && (
          <View style={styles.playerNotice}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color="#777"
            />

            <Text style={styles.playerNoticeText}>
              Room configuration is controlled
              by the host.
            </Text>
          </View>
        )}

        <Pressable
  style={styles.exitButton}
  onPress={handleExitRoom}
>
  <Text style={styles.exitButtonText}>
    EXIT ROOM
  </Text>
</Pressable>

<View style={styles.bottomSpace} />
      </ScrollView>
       </SafeAreaView>

    <LeaveRoomDialog
      visible={showLeaveDialog}
      onStay={() => {
        setShowLeaveDialog(false);
      }}
      onLeave={handleConfirmLeaveRoom}
    />
  </>
  );
}

function SettingRow({
  label,
  value,
  showChevron,
  showToggle,
  toggleOn,
  disabled = false,
}: {
  label: string;
  value?: string;
  showChevron?: boolean;
  showToggle?: boolean;
  toggleOn?: boolean;
  disabled?: boolean;
}) {
  return (
    <View
  style={[
    styles.settingRow,
    disabled && styles.settingRowDisabled,
  ]}
>
 <Text
  style={[
    styles.rowTitle,
    disabled && styles.disabledText,
  ]}
>
  {label}
</Text>

      <View style={styles.rowRight}>
        {value && (
        <Text
  style={[
    styles.rowValue,
    disabled && styles.disabledText,
  ]}
>
  {value}
</Text>
        )}

        {showToggle ? (
          <View
            style={[
              styles.toggle,
              toggleOn &&
                styles.toggleOn,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                toggleOn &&
                  styles.toggleThumbOn,
              ]}
            />
          </View>
        ) : showChevron ? (
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#BDBDBD"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#191600",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },

 headerTitle: {
    flex: 1,
    color: "#D8CFAE",
    fontSize: 19,
    fontWeight: "500",
    marginLeft: 6,
  },

  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: 36,
  },
  separator: {
    height: 1,
    backgroundColor: "#1F1F1F",
  },

  settingRow: {
    minHeight: 64,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingRowDisabled: {
    opacity: 0.42,
  },
  settingCard: {
    minHeight: 64,
    paddingHorizontal: 30,
    backgroundColor: "#090909",
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

rowTitle: {
    color: "#CFC7AB",
    fontSize: 14,
    fontWeight: "400",
  },

  disabledText: {
    color: "#66615A",
  },
rowSubtitle: {
    marginTop: 3,
    color: "#625F58",
    fontSize: 9,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

rowValue: {
    color: "#BDB59B",
    fontSize: 13,
  },

sectionHeader: {
    height: 43,
    paddingHorizontal: 30,
    backgroundColor: "#121108",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

sectionHeaderText: {
    color: "#8D855F",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  hostLabel: {
    color: "#F2A900",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  hostLabelText: {
    color: "#F2A900",
  },
playerCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#191805",
    borderWidth: 1,
    borderColor: "#403A13",
    alignItems: "center",
    justifyContent: "center",
  },

  counterButtonDisabled: {
    opacity: 0.55,
  },

playerCount: {
    minWidth: 24,
    textAlign: "center",
    color: "#E8DDAF",
    fontSize: 15,
    fontWeight: "700",
  },

  readOnlyValue: {
    minWidth: 44,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
  },

  readOnlyText: {
    color: "#C8C8C8",
    fontSize: 17,
    fontWeight: "700",
  },

requirementCard: {
    marginHorizontal: 30,
    marginTop: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#0D0C05",
    borderWidth: 1,
    borderColor: "#302A0C",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

requirementText: {
    flex: 1,
    color: "#817A5E",
    fontSize: 10,
    lineHeight: 14,
  },

  errorCard: {
    marginHorizontal: 24,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#211211",
    borderWidth: 1,
    borderColor: "#54221D",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  errorText: {
    flex: 1,
    color: "#E7A19A",
    fontSize: 13,
  },

 saveButton: {
    marginHorizontal: 30,
    marginTop: 14,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#C58A00",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonDisabled: {
    opacity: 0.35,
  },

saveButtonText: {
    color: "#0A0905",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  toggle: {
    width: 54,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#303030",
    padding: 3,
    justifyContent: "center",
  },

  toggleOn: {
    backgroundColor: "#13BDE8",
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#101010",
  },

  toggleThumbOn: {
    alignSelf: "flex-end",
  },

  playerNotice: {
    marginHorizontal: 24,
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  playerNoticeText: {
    flex: 1,
    color: "#777",
    fontSize: 13,
  },

exitButton: {
    marginHorizontal: 30,
    marginTop: 28,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#541B16",
    borderWidth: 1,
    borderColor: "#7A2A20",
    alignItems: "center",
    justifyContent: "center",
  },

  exitButtonText: {
    color: "#E47A6D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  bottomSpace: {
    height: 32,
  },
});