import { StyleSheet, Text, View } from "react-native";

import { LobbyPlayer } from "../../types/player";

import EmptyPlayerSlot from "./EmptyPlayerSlot";
import PlayerAvatar from "./PlayerAvatar";
import PlayerStatusOverlay from "./PlayerStatusOverlay";
import VotingControls from "./VotingControls";

type Props = {
  player?: LobbyPlayer;
  avatarSize: number;
  disabled?: boolean;
  votingStarted?: boolean;
};

export default function PlayerSlot({
  player,
  avatarSize,
  disabled = false,
  votingStarted = false,
}: Props) {
  if (!player) {
    return (
      <View
        style={[
          styles.container,
          {
            width: avatarSize + 8,
            opacity: disabled ? 0.35 : 1,
          },
        ]}
      >
        <EmptyPlayerSlot size={avatarSize} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize + 8,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            width: avatarSize + 10,
            minHeight: avatarSize + 8,
            borderRadius: avatarSize * 0.28,
          },
        ]}
      >
        <PlayerAvatar
          avatar={player.avatar}
          size={avatarSize}
          isHost={player.isHost}
          isReady={player.isReady}
          isSpeaking={player.isSpeaking}
        />

        <PlayerStatusOverlay
          isHost={player.isHost}
          isReady={player.isReady}
          isSpeaking={player.isSpeaking}
        />
      </View>

      <View style={styles.nameChip}>
    <Text
      numberOfLines={1}
      style={styles.name}
    >
      {player.name}
    </Text>
  </View>

  {votingStarted && (
    <VotingControls
      visible={true}
      onVote={() => {
        console.log("Vote:", player.id);
      }}
    />
  )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  card: {
    justifyContent: "center",
    alignItems: "center",

    padding: 3,

    backgroundColor:
      "rgba(18,18,24,0.38)",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.08)",
  },

  nameChip: {
    marginTop: 3,

    maxWidth: "100%",

    paddingHorizontal: 5,
    paddingVertical: 1.5,

    borderRadius: 7,

    backgroundColor:
      "rgba(5,5,8,0.72)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.06)",
  },

  name: {
    color: "#FFF",

    fontSize: 9,
    fontWeight: "700",

    textAlign: "center",

    letterSpacing: 0.1,
  },
});