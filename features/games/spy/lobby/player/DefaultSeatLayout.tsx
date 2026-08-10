import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { LobbyPlayer } from "../../types/player";
import PlayerSlot from "./PlayerSlot";
import VotingSkipButton from "./VotingSkipButton";

type Props = {
  players: LobbyPlayer[];
  votingStarted?: boolean;
};

export default function DefaultSeatLayout({
  players,
  votingStarted = false,
}: Props) {
  const { width } = useWindowDimensions();

  const safePlayers = players.slice(0, 8);

  const playerCount = Math.max(
    safePlayers.length,
    4
  );

  const slotCount =
    playerCount <= 4
      ? 4
      : playerCount <= 6
      ? 6
      : 8;

  /*
   * Fewer players get slightly larger avatars.
   *
   * The player AREA itself does not change.
   * Only the internal distribution changes.
   */
const avatarSize =
safePlayers.length <= 4
? Math.round(
Math.min(
Math.max(width * 0.115, 44),
48
)
)
: safePlayers.length <= 6
? Math.round(
Math.min(
Math.max(width * 0.105, 41),
45
)
)
: Math.round(
Math.min(
Math.max(width * 0.092, 36),
40
)
);

  const seats: (LobbyPlayer | undefined)[] =
    Array.from(
      { length: slotCount },
      (_, index) => safePlayers[index]
    );

  const leftSeats = seats.filter(
    (_, index) => index % 2 === 0
  );

  const rightSeats = seats.filter(
    (_, index) => index % 2 === 1
  );

  const columnWidth = Math.min(
    Math.max(width * 0.18, 72),
    92
  );

  return (
    <View style={styles.container}>
      {/* LEFT */}

      <View
        style={[
          styles.column,
          {
            width: columnWidth,
          },
        ]}
      >
        {leftSeats.map((player, index) => (
          <PlayerSlot
            key={
              player?.id ??
              `left-locked-${index}`
            }
            player={player}
            avatarSize={avatarSize}
            disabled={!player}
          />
        ))}
      </View>



   {/* CENTER GAME AREA */}

<View style={styles.center}>
  <VotingSkipButton
    visible={true}
    onPress={() => {
      console.log("Voting skipped");
    }}
  />
</View>

      {/* RIGHT */}

      <View
        style={[
          styles.column,
          {
            width: columnWidth,
          },
        ]}
      >
        {rightSeats.map((player, index) => (
          <PlayerSlot
            key={
              player?.id ??
              `right-locked-${index}`
            }
            player={player}
            avatarSize={avatarSize}
            disabled={!player}
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

    alignItems: "stretch",
    justifyContent: "space-between",

    paddingHorizontal: 0,
    paddingVertical: 14,

    minHeight: 0,
  },

column: {
  justifyContent: "space-around",
  alignItems: "center",
  minHeight: 0,
  marginHorizontal: 2,
},


center: {
  flex: 1,

  minWidth: 0,
  minHeight: 0,

  alignItems: "center",
  justifyContent: "flex-end",

  paddingBottom: 8,
},
});