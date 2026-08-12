import { StyleSheet, View } from "react-native";

import { LobbyPlayer } from "../../types/player";
import PlayerSlot from "./PlayerSlot";

type Props = {
  players: LobbyPlayer[];
};

export default function DefaultSeatLayout({
  players,
}: Props) {
  const left = players.filter(
    (_, index) => index % 2 === 0
  );

  const right = players.filter(
    (_, index) => index % 2 === 1
  );

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {left.map((player) => (
          <PlayerSlot
            key={player.id}
            player={player}
            avatarSize={60}
          />
        ))}
      </View>

      <View style={styles.center} />

      <View style={styles.column}>
        {right.map((player) => (
          <PlayerSlot
            key={player.id}
            player={player}
            avatarSize={60}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "space-between",

    paddingHorizontal: 10,

    paddingVertical: 10,
  },

  column: {
    width: 82,

    justifyContent: "space-evenly",

    alignItems: "center",
  },

  center: {
    flex: 1,
  },
});
