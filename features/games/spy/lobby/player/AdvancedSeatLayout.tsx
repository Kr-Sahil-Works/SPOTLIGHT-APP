import { StyleSheet, View } from "react-native";

import { LobbyPlayer } from "../../types/player";
import PlayerSlot from "./PlayerSlot";

type Props = {
  players: LobbyPlayer[];
maxPlayers?: number;
currentSpeakerUserId?: string;
isPlaying?: boolean;
};

export default function AdvancedSeatLayout({
  players,
maxPlayers = 4,
currentSpeakerUserId,
isPlaying = false,
}: Props) {
  const safeMaxPlayers = Math.min(
    Math.max(maxPlayers, 4),
    8
  );

  const safePlayers =
    players.slice(0, safeMaxPlayers);

  const seats: (
    LobbyPlayer | undefined
  )[] = Array.from(
    {
      length: safeMaxPlayers,
    },
    (_, index) =>
      safePlayers[index]
  );

const splitIndex =
  Math.ceil(
    seats.length / 2
  );

const getPlayerNumber = (
  player?: LobbyPlayer
) => {
  if (!player) {
    return undefined;
  }

  const index =
    safePlayers.findIndex(
      (p) => p.id === player.id
    );

  return index === -1
    ? undefined
    : index + 1;
};


const left =
  seats.slice(
    0,
    splitIndex
  );

const right =
  seats.slice(
    splitIndex
  );

  
  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.column}>
        {left.map(
          (player, index) => (
            <PlayerSlot
              key={
                player?.id ??
                `left-empty-${index}`
              }
              player={player}
              avatarSize={60}
              isPlaying={isPlaying}
              disabled={!player}
              isCurrentSpeaker={
  player?.userId ===
  currentSpeakerUserId
}
seatNumber={
  getPlayerNumber(player)
}
            />
          )
        )}
      </View>

      {/* CENTER */}
      <View style={styles.center} />

      {/* RIGHT */}
      <View style={styles.column}>
        {right.map(
          (player, index) => (
            <PlayerSlot
              key={
                player?.id ??
                `right-empty-${index}`
              }
              player={player}
              avatarSize={60}
              isPlaying={isPlaying}
              disabled={!player}
              isCurrentSpeaker={
  player?.userId ===
  currentSpeakerUserId
}
seatNumber={
  getPlayerNumber(player)
}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      paddingVertical: 10,
    },

    column: {
      width: 82,

      justifyContent:
        "space-evenly",

      alignItems:
        "center",
    },

    center: {
      flex: 1,
    },
  });