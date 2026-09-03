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

  maxPlayers?: number;

  votingStarted?: boolean;

  currentSpeakerUserId?: string;

  isPlaying?: boolean;

  currentPlayerId?: string;

  hasVoted?: boolean;

  allOtherPlayersReady?: boolean;
  onVote?: (
    playerId: string
  ) => void;

  onSkipVote?: () => void;
};

export default function DefaultSeatLayout({
  players,
  maxPlayers = 4,
  votingStarted = false,
  currentSpeakerUserId,
  isPlaying = false,
  currentPlayerId,
  hasVoted = false,
  allOtherPlayersReady = false,
  onVote,
  onSkipVote,
}: Props) {
  const { width } = useWindowDimensions();

  const safeMaxPlayers = Math.min(
    Math.max(maxPlayers, 4),
    8
  );

  const safePlayers = players.slice(
    0,
    safeMaxPlayers
  );

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
        (p) =>
          p.id === player.id
      );

    return index === -1
      ? undefined
      : index + 1;
  };

  const leftSeats =
    seats.slice(
      0,
      splitIndex
    );

  const rightSeats =
    seats.slice(
      splitIndex
    );

  const avatarSize =
    safePlayers.length <= 4
      ? Math.round(
          Math.min(
            Math.max(
              width * 0.129,
              49
            ),
            54
          )
        )
      : safePlayers.length <= 6
      ? Math.round(
          Math.min(
            Math.max(
              width * 0.118,
              46
            ),
            50
          )
        )
      : Math.round(
          Math.min(
            Math.max(
              width * 0.103,
              40
            ),
            45
          )
        );

  const columnWidth =
    Math.min(
      Math.max(
        width * 0.18,
        72
      ),
      92
    );

  return (
    <View style={styles.container}>

      {/* =========================
          LEFT
      ========================= */}

      <View
        style={[
          styles.column,
          {
            width:
              columnWidth,
          },
        ]}
      >
        {leftSeats.map(
          (
            player,
            index
          ) => {
            const seatNumber =
              getPlayerNumber(
                player
              );

            return (
              <PlayerSlot
                key={
                  player?.id ??
                  `left-empty-${index}`
                }

                currentPlayerId={
                  currentPlayerId
                }

                hasVoted={
                  hasVoted
                }

                onVote={
                  onVote
                }

                player={
                  player
                }

                avatarSize={
                  avatarSize
                }

                isPlaying={
                  isPlaying
                }

                disabled={
                  !player
                }

                seatNumber={
                  seatNumber
                }

                votingStarted={
                  votingStarted
                }

                isCurrentSpeaker={
                  player?.userId ===
                  currentSpeakerUserId
                }
allOtherPlayersReady={
  allOtherPlayersReady
}
              />
            );
          }
        )}
      </View>

      {/* =========================
          CENTER
      ========================= */}

      <View
        style={styles.center}
      >
        <VotingSkipButton
          visible={
            votingStarted &&
            !hasVoted
          }
          onPress={
            onSkipVote
          }
        />
      </View>

      {/* =========================
          RIGHT
      ========================= */}

      <View
        style={[
          styles.column,
          {
            width:
              columnWidth,
          },
        ]}
      >
        {rightSeats.map(
          (
            player,
            index
          ) => {
            const seatNumber =
              getPlayerNumber(
                player
              );

            return (
              <PlayerSlot
                key={
                  player?.id ??
                  `right-empty-${index}`
                }

                currentPlayerId={
                  currentPlayerId
                }

                hasVoted={
                  hasVoted
                }

                onVote={
                  onVote
                }

                player={
                  player
                }

                avatarSize={
                  avatarSize
                }

                disabled={
                  !player
                }

                seatNumber={
                  seatNumber
                }

                isPlaying={
                  isPlaying
                }

                votingStarted={
                  votingStarted
                }

                isCurrentSpeaker={
                  player?.userId ===
                  currentSpeakerUserId
                }
allOtherPlayersReady={
  allOtherPlayersReady
}
              />
            );
          }
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

      alignItems:
        "stretch",

      justifyContent:
        "space-between",

      paddingHorizontal: 8,

      paddingVertical: 14,

      minHeight: 0,
    },

    column: {
      justifyContent:
        "space-around",

      alignItems:
        "center",

      minHeight: 0,

      marginHorizontal: 2,
    },

    center: {
      flex: 1,

      minWidth: 0,

      minHeight: 0,

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      paddingBottom: 8,
    },
  });