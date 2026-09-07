import {
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  isCurrentSpeaker?: boolean;

  seatNumber?: number;

  isPlaying?: boolean;

  currentPlayerId?: string;

  hasVoted?: boolean;
  allOtherPlayersReady?: boolean;

isTieBreak?: boolean;

isTieBreakVoting?: boolean;

tieBreakPlayerIds?: string[];

  onVote?: (
    playerId: string
  ) => void;
};

export default function PlayerSlot({
  player,
  avatarSize,
  disabled = false,
  votingStarted = false,
  isCurrentSpeaker = false,
  seatNumber,
  isPlaying = false,
  currentPlayerId,
  hasVoted = false,
allOtherPlayersReady = false,
isTieBreak = false,
isTieBreakVoting = false,
tieBreakPlayerIds = [],
onVote,
}: Props) {
  /*
   * =========================
   * EMPTY SEAT
   * =========================
   */

  if (!player) {
    return (
      <View
        style={[
          styles.container,
          {
            width:
              avatarSize + 18,
          },
        ]}
      >
        <View
          style={styles.seatWrapper}
        >
          {seatNumber !==
            undefined && (
   <SeatBadge
  number={seatNumber}
  empty
/>
          )}

          <EmptyPlayerSlot
            size={avatarSize}
            animate={true}
          />
        </View>
      </View>
    );
  }

  /*
   * =========================
   * PLAYER STATE
   * =========================
   */

  const isEliminated =
    isPlaying &&
    !player.isAlive;

  const isSelf =
    player.id ===
    currentPlayerId;

const isTieBreakVoter =
  !isTieBreak ||
  !tieBreakPlayerIds.includes(
    currentPlayerId ?? ""
  );

const isValidTieBreakTarget =
  !isTieBreak ||
  tieBreakPlayerIds.includes(
    player.id
  );

const canVote =
  votingStarted &&
  (
    !isTieBreak ||
    isTieBreakVoting
  ) &&
  !hasVoted &&
  !isEliminated &&
  !isSelf &&
  isTieBreakVoter &&
  isValidTieBreakTarget;

  /*
   * =========================
   * PLAYER
   * =========================
   */

  return (
    <View
      style={[
        styles.container,
        {
          width:
            avatarSize + 18,
        },
      ]}
    >
      <View
        style={styles.seatWrapper}
      >
        {seatNumber !==
          undefined && (
       <SeatBadge
  number={seatNumber}
  active={
    isCurrentSpeaker &&
    !isEliminated
  }
  isTie={
    isTieBreak &&
    tieBreakPlayerIds.includes(
      player.id
    )
  }
/>
        )}

        {/* =========================
            PLAYER CARD
        ========================= */}

        <View
          style={[
            styles.card,
            {
              width:
                avatarSize + 10,

              minHeight:
                avatarSize + 8,

              borderRadius:
                avatarSize * 0.28,

              opacity:
                isEliminated
                  ? 0.42
                  : 1,
            },
          ]}
        >
          {/* =========================
              AVATAR
          ========================= */}

<PlayerAvatar
  avatar={player.avatar}
  size={avatarSize}
  isHost={
    player.isHost &&
    !isPlaying
  }
  isSelf={isSelf}
  allOtherPlayersReady={
    allOtherPlayersReady
  }
  isReady={
    player.isReady &&
    !isPlaying
  }
  isSpeaking={
    isCurrentSpeaker &&
    player.isAlive
  }
  isPlaying={isPlaying}
  isEliminated={isEliminated}
/>

          {/* =========================
              STATUS
          ========================= */}

          <PlayerStatusOverlay
            isHost={
              player.isHost &&
              !isPlaying
            }
            isReady={
              player.isReady &&
              !isPlaying
            }
            isSpeaking={
              isCurrentSpeaker &&
              player.isAlive
            }
            isPlaying={
              isPlaying
            }
            isEliminated={
              isEliminated
            }
          />
        </View>
      </View>

      {/* =========================
          NAME / VOTE
      ========================= */}

 {votingStarted &&
 !hasVoted &&
 !isEliminated &&
 !isSelf &&
 canVote ? (
        <VotingControls
          visible={
            true
          }
          disabled={
            !canVote
          }
          onVote={() => {
            if (
              !canVote
            ) {
              return;
            }

            onVote?.(
              player.id
            );
          }}
        />
      ) : (
        <View
          style={
            styles.nameChip
          }
        >
<Text
  numberOfLines={1}
 style={[
  styles.name,

  !isPlaying &&
    isSelf &&
    !player.isHost &&
    styles.selfName,

  isEliminated &&
    styles.eliminatedName,
]}
>
  {!isPlaying && isSelf && !player.isHost
    ? "YOU"
    : player.name.length > 14
    ? `${player.name.slice(0, 14)}...`
    : player.name}
</Text>
        </View>
      )}
    </View>
  );
}

/* =========================
   SEAT NUMBER BADGE
========================= */

function SeatBadge({
  number,
  empty = false,
  active = false,
  isTie = false,
}: {
  number: number;
  empty?: boolean;
  active?: boolean;
  isTie?: boolean;
}) {
  return (
    <View
      style={[
        styles.seatBadge,
        empty &&
          styles.emptySeatBadge,
    active &&
  styles.activeSeatBadge,

isTie &&
  styles.tieSeatBadge,
      ]}
    >
      <Text
        style={[
         styles.seatNumber,
          active &&
            styles.activeSeatNumber,
          isTie &&
            styles.tieSeatNumber,
        ]}
      >
        {isTie ? "T" : number}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      alignItems:
        "center",
    },

    seatWrapper: {
      position:
        "relative",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    /* =========================
       SEAT NUMBER
    ========================= */

    seatBadge: {
      position:
        "absolute",

      top: -4,
      right: -5,

      zIndex: 20,

      width: 14,
      height: 14,

      borderRadius: 7,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(10,10,14,0.94)",

      borderWidth: 1.2,

      borderColor:
        "#f2a9008c",

      shadowColor:
        "#000",

      shadowOpacity:
        0.3,

      shadowRadius: 3,

      shadowOffset: {
        width: 0,
        height: 1,
      },

      elevation: 4,
    },

    emptySeatBadge: {
      borderColor:
        "rgba(255,255,255,0.14)",

      backgroundColor:
        "rgba(10,10,14,0.72)",
    },

    activeSeatBadge: {
      backgroundColor:
        "#F2A900",

      borderColor:
        "#F2A900",

      shadowColor:
        "#F2A900",

      shadowOpacity:
        0.65,

      shadowRadius: 4,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 6,
    },

   activeSeatNumber: {
  color: "#111111",
},

tieSeatNumber: {
  color: "#000000",
},


tieSeatBadge: {
  backgroundColor:
    "#FF3B30",

  borderColor:
    "#FF3B30",

  shadowColor:
    "#FF3B30",

  shadowOpacity:
    0.45,

  shadowRadius: 3,

  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 5,
},

    seatNumber: {
      color: "#F2A900",

      fontSize: 7.5,

      fontWeight: "900",

      lineHeight: 8,

      textAlign:
        "center",
    },

    /* =========================
       PLAYER CARD
    ========================= */

    card: {
      justifyContent:
        "center",

      alignItems:
        "center",

      padding: 3,

      backgroundColor:
        "rgba(18,18,24,0.38)",

      borderWidth: 0.8,

      borderColor:
        "rgba(255,255,255,0.08)",
    },

    /* =========================
       NAME
    ========================= */

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

selfName: {
  color: "#d49800",
},

eliminatedName: {
  opacity: 0.55,
},
  });