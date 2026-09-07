import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Voter = {
  id: string;
  avatar: string | number;
};

type ResultType =
  | "no_elimination"
  | "eliminated"
  | "game_over"
  | "tie_break"
  | "super_tie"
  | "tie_break_no_elimination"
  | "tie_limit_reached";

type Props = {
  resultType?: ResultType;

  tieRoundCount?: number;

  tiedPlayerIds?: string[];

  playerName: string;
  playerAvatar?: string | number;

  voteCount: number;
  voters?: Voter[];

  role?: "spy" | "villager";

  showRole?: boolean;
};

export default function VotingResultCard({
  resultType,
  tieRoundCount,
  tiedPlayerIds = [],
  playerName,
  playerAvatar,
  voteCount,
  voters = [],
  role,
  showRole = false,
}: Props) {
  const { width } =
    useWindowDimensions();

const cardWidth = Math.min(
  Math.max(width * 0.90, 320),
  430
);

const cardHeight =
  cardWidth / 1.72;

const illustrationScale =
  resultType === "super_tie"
    ? 0.80
    : 1;

const roleIsSpy =
  role === "spy";

const isTieResult =
  resultType === "tie_break" ||
  resultType === "super_tie" ||
  resultType === "tie_break_no_elimination";

const isSuperTie =
  resultType === "super_tie";

const isTieBreakNoElimination =
  resultType ===
  "tie_break_no_elimination";

const isTieLimitReached =
  resultType ===
  "tie_limit_reached";

const noElimination =
  !isTieResult &&
  !isTieLimitReached &&
  (
    voteCount === 0 ||
    playerName === "NO ONE"
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: cardWidth,
          height: cardHeight,
        },
      ]}
    >
      {/* =========================
          🕵️ BOARD
      ========================= */}

      <Image
      source={
  resultType === "super_tie"
    ? require("@/assets/images/games/spy/boards/super_tie.png")
    : isTieResult
      ? require("@/assets/images/games/spy/boards/tie_match.png")
      : require("@/assets/images/games/spy/boards/votedout.png")
}
        contentFit="fill"
       style={[
  styles.board,
  resultType === "super_tie" && {
    transform: [{ scale: illustrationScale }],
  },
]}
      />

      {/* =========================
          CONTENT
      ========================= */}

      <View style={styles.content}>
   {/* =========================
    RESULT CONTENT
========================= */}

{isTieResult ? null : isTieLimitReached ? (
  <View style={styles.tieContent}>

    <Text style={styles.tieRoundLabel}>
      TIE ROUND {tieRoundCount ?? "—"}
    </Text>

    <Text style={styles.tieTitle}>
      {isSuperTie
        ? "SUPER TIE"
        : isTieBreakNoElimination
          ? "TIE MATCH"
          : "TIE MATCH"}
    </Text>

    <Text style={styles.tieSubtitle}>
      {isSuperTie
        ? "EVERYONE IS TIED"
        : isTieBreakNoElimination
          ? "NO PLAYER WAS ELIMINATED"
          : "TIE-BREAK REQUIRED"}
    </Text>

    <Text style={styles.tiePlayersCount}>
      {tiedPlayerIds.length}{" "}
      {tiedPlayerIds.length === 1
        ? "PLAYER"
        : "PLAYERS"}{" "}
      TIED
    </Text>

  </View>
) : isTieLimitReached ? (
  <View style={styles.tieContent}>

    <Text style={styles.tieRoundLabel}>
      TIE ROUND {tieRoundCount ?? "—"}
    </Text>

    <Text style={styles.tieTitle}>
      TIE LIMIT REACHED
    </Text>

    <Text style={styles.tieSubtitle}>
      SPY WINS
    </Text>

  </View>
) : noElimination ? (
  <>
    <Text
      style={styles.noVoteTitle}
      numberOfLines={2}
    >
      No Player
      {"\n"}
      Is{" "}
      <Text style={styles.noVoteEliminated}>
        Eliminated
      </Text>
    </Text>

    <View style={styles.noVotePlate}>
      <Text style={styles.noVoteCount}>
        0 VOTES
      </Text>
    </View>
  </>
) : (
  <>



  {/* PLAYER */}

<View
  style={[
    styles.avatarFrame,
    styles.playerAvatarPosition,
  ]}
>
  {playerAvatar && (
    <Image
      source={
        typeof playerAvatar ===
        "string"
          ? {
              uri: playerAvatar,
            }
          : playerAvatar
      }
      contentFit="cover"
      style={styles.playerImage}
    />
  )}

  <Image
    source={require(
      "@/assets/images/games/spy/boards/votedframe.png"
    )}
    contentFit="contain"
    pointerEvents="none"
    style={styles.pfpFrame}
  />
</View>

{/* NAME */}

<Text
  numberOfLines={1}
  adjustsFontSizeToFit
  minimumFontScale={0.65}
  style={styles.name}
>
  {playerName}
</Text>

<View
  pointerEvents="none"
  style={styles.resultDivider}
/>

    {/* WHO VOTED */}

{voters.length > 0 && (
  <View style={styles.voterArea}>
    <View style={styles.voterGrid}>
      <View style={styles.voterGridColumn}>
        {voters
          .slice(0, 3)
          .map((voter) => (
            <View
              key={voter.id}
              style={styles.voterAvatar}
            >
              <Image
                source={
                  typeof voter.avatar ===
                  "string"
                    ? {
                        uri:
                          voter.avatar,
                      }
                    : voter.avatar
                }
                contentFit="cover"
                style={styles.voterImage}
              />
            </View>
          ))}
      </View>

      <View style={styles.voterGridColumn}>
        {voters
          .slice(3, 6)
          .map((voter) => (
            <View
              key={voter.id}
              style={styles.voterAvatar}
            >
              <Image
                source={
                  typeof voter.avatar ===
                  "string"
                    ? {
                        uri:
                          voter.avatar,
                      }
                    : voter.avatar
                }
                contentFit="cover"
                style={styles.voterImage}
              />
            </View>
          ))}
      </View>
    </View>

    {voters.length > 6 && (
      <View style={styles.voterSeventh}>
        <View style={styles.voterAvatar}>
          <Image
            source={
              typeof voters[6].avatar ===
              "string"
                ? {
                    uri:
                      voters[6].avatar,
                  }
                : voters[6].avatar
            }
            contentFit="cover"
            style={styles.voterImage}
          />
        </View>
      </View>
    )}
  </View>
)}
  {!showRole ? (
  <View style={styles.votesPill}>
    <Text style={styles.votes}>
      Got {voteCount}{" "}
      {voteCount === 1
        ? "vote"
        : "votes"}
    </Text>
  </View>
) : (
      <View
        style={[
          styles.rolePlate,
          roleIsSpy
            ? styles.spyPlate
            : styles.villagerPlate,
        ]}
      >
        <Text
          style={[
            styles.roleText,
            roleIsSpy
              ? styles.spyText
              : styles.villagerText,
          ]}
        >
          {roleIsSpy
            ? "WAS A SPY"
            : "WAS A VILLAGER"}
        </Text>
      </View>
    )}
  </>
)}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      alignItems:
        "center",
      justifyContent:
        "center",

      overflow:
        "visible",
    },

    board: {
      position:
        "absolute",

      width: "100%",
      height: "100%",

      left: 0,
      top: 0,
    },

content: {
  position: "absolute",

  left: "8%",
  right: "8%",

  top: "12%",
  bottom: "5%",

  alignItems: "center",

  justifyContent: "center",

  backgroundColor:
    "rgba(35,27,18,0.10)",

  borderRadius: 12,
},

avatarFrame: {
  position: "relative",

  width: 105,
  height: 105,

  alignItems: "center",
  justifyContent: "center",

  overflow: "hidden",
},

playerImage: {
  width: 60,
  height: 60,

  borderRadius: 8,
},


pfpFrame: {
  position: "absolute",

  width: 94,
  height: 110,

  left: 5,
  top: -2,

  zIndex: 5,

  pointerEvents: "none",
},

    hiddenAvatar: {
  alignItems:
    "center",

  justifyContent:
    "center",

  backgroundColor:
    "rgba(8,8,8,0.92)",

  borderWidth: 1.8,

  borderColor:
    "rgba(242,169,0,0.65)",

  shadowColor:
    "#F2A900",

  shadowOpacity:
    0.25,

  shadowRadius: 6,

  elevation: 6,
},

playerAvatarPosition: {
  alignSelf: "center",

  marginTop: -20,

  marginRight: 95,
},

hiddenAvatarText: {
  color: "#D09A00",

  fontSize: 30,

  fontWeight: "900",
},

identityHidden: {
  marginTop: 6,

  color: "#77736D",

  fontSize: 9,

  fontWeight: "900",

  letterSpacing: 1,

  textAlign: "center",
},


resultDivider: {
  position: "absolute",

  right: "40%",

  top: "24%",

  width: 1,

  height: "46%",

  backgroundColor:
    "rgba(190,145,45,0.55)",
},

name: {
  marginTop: -16,

  marginRight: 80,

  color: "#e3e4d3",

  fontSize: 10,

  fontWeight: "800",

  letterSpacing: 0.2,

  textAlign: "center",
},

voterArea: {
  position: "absolute",

  right: "5%",

  top: "16%",

  width: "30%",

  height: "70%",

  alignItems: "center",

  justifyContent: "center",

  overflow: "hidden",
},

voterGrid: {
  width: "100%",

  height: "78%",

  flexDirection: "row",

  alignItems: "center",

  justifyContent: "center",

  columnGap: 4,
  marginTop : -10,
},

voterGridColumn: {
  flex: 1,

  height: "100%",

  alignItems: "center",

  justifyContent: "space-evenly",
},

voterSeventh: {
  width: "100%",

  height: "20%",

  alignItems: "center",

  justifyContent: "flex-start",

  paddingTop: 0,

  marginTop: -10,
},

   voterAvatar: {
  width: 25,
  height: 25,

  borderRadius: 12.5,

  marginHorizontal: 2,

  padding: 1.5,

  backgroundColor:
    "rgba(10,10,10,0.94)",

  borderWidth: 1,

  borderColor:
    "rgba(242,169,0,0.55)",
},

 voterImage: {
  width: "100%",
  height: "100%",

  borderRadius: 11,
},

    
  votesPill: {
  marginTop: 4,

  paddingHorizontal: 9,
  paddingVertical: 3,

  borderRadius: 10,

  backgroundColor:
    "rgba(242,169,0,0.10)",

  borderWidth: 1,
  borderColor:
    "rgba(242,169,0,0.28)",

  alignItems: "center",
  justifyContent: "center",
},

votes: {
  color: "#C99618",

  fontSize: 8.5,

  fontWeight: "800",

  letterSpacing: 0.25,
},


noVoteTitle: {
  color: "#83817e",

  fontSize: 17,

  fontWeight: "900",

  letterSpacing: 1,

  lineHeight: 20,

  textAlign: "center",

  width: "100%",
},

noVoteEliminated: {
  color: "#705b46",

  fontSize: 18,

  fontWeight: "900",

  letterSpacing: 0.8,
},


noVotePlate: {
  marginTop: 12,

  minWidth: 100,

  paddingHorizontal: 16,

  paddingVertical: 5,

  borderRadius: 14,

  alignItems: "center",

  justifyContent: "center",

  backgroundColor:
    "rgba(242,169,0,0.10)",

  borderWidth: 1,

  borderColor:
    "rgba(242,169,0,0.35)",
},

noVoteCount: {
  color: "#F2A900",

  fontSize: 9,

  fontWeight: "900",

  letterSpacing: 1,
},

tieContent: {
  width: "100%",
  height: "100%",

  alignItems: "center",
  justifyContent: "center",

  paddingHorizontal: 20,
},

tieRoundLabel: {
  color: "#D09A00",

  fontSize: 9,
  fontWeight: "900",

  letterSpacing: 1.5,

  marginBottom: 8,
},

tieTitle: {
  color: "#E3E4D3",

  fontSize: 21,
  fontWeight: "900",

  letterSpacing: 1.2,

  textAlign: "center",
},

tieSubtitle: {
  marginTop: 7,

  color: "#705B46",

  fontSize: 11,
  fontWeight: "900",

  letterSpacing: 1,

  textAlign: "center",
},

tiePlayersCount: {
  marginTop: 14,

  color: "#D09A00",

  fontSize: 9,
  fontWeight: "900",

  letterSpacing: 1.2,
},


   rolePlate: {
  position: "absolute",

  top: "108%",

  minWidth: 145,

  paddingHorizontal: 16,
  paddingVertical: 5,

  borderRadius: 14,

  alignItems: "center",
  justifyContent: "center",

  borderWidth: 1,
},

    spyPlate: {
      backgroundColor:
        "rgba(120,20,20,0.24)",

      borderColor:
        "rgba(255,70,70,0.75)",
    },

    villagerPlate: {
      backgroundColor:
        "rgba(20,100,50,0.20)",

      borderColor:
        "rgba(70,220,120,0.75)",
    },

    roleText: {
      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 0.8,
    },

    spyText: {
      color: "#FF6666",
    },

    villagerText: {
      color: "#72E69A",
    },
  });