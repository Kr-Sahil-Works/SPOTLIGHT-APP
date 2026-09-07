import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

type GameOverPlayer = {
  playerId: string;
  name: string;
  avatar?: string;
  role?: "spy" | "villager";
  isAlive: boolean;
};

type GameOverBoardProps = {
  winner: "spy" | "villagers";
  villagerWord: string;
  spyWord: string;
  players: GameOverPlayer[];
};

const BOARD_ASPECT_RATIO = 941 / 1671;

export default function GameOverBoard({
  winner,
  villagerWord,
  spyWord,
  players,
}: GameOverBoardProps) {
  const { width, height } = useWindowDimensions();

  const realVillagers = players.filter(
    (player) => player.role === "villager"
  );

  const realSpies = players.filter(
    (player) => player.role === "spy"
  );

const villagers = realVillagers;

  const spies = realSpies;

  /*
   * Board remains 20% smaller than original.
   */
  const maxBoardWidth = width * 0.768;
  const maxBoardHeight = height * 0.752;

  const boardWidth = Math.min(
    maxBoardWidth,
    maxBoardHeight * BOARD_ASPECT_RATIO
  );

  const boardHeight =
    boardWidth / BOARD_ASPECT_RATIO;

  /*
   * For 4+ villagers we hide ALL names.
   */
//   const showVillagerNames =
//     villagers.length <= 3;

const showVillagerNames = true;

  return (
    <View
      style={[
        styles.container,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
    >
      {/* =========================================
          BOARD IMAGE
      ========================================= */}

      <Image
        source={
          winner === "villagers"
            ? require("@/assets/images/games/spy/boards/villagerWonBoard.png")
            : require("@/assets/images/games/spy/boards/spyWonBoard.png")
        }
        contentFit="contain"
        style={StyleSheet.absoluteFill}
      />

      {/* =========================================
          WORD REVEAL
      ========================================= */}

      <View style={styles.wordReveal}>
        {/* VILLAGER WORD */}
        <View style={styles.villagerWordSlot}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            style={styles.villagerWord}
          >
            {villagerWord}
          </Text>
        </View>

        {/* SPY WORD */}
        <View style={styles.spyWordSlot}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            style={styles.spyWord}
          >
            {spyWord}
          </Text>
        </View>
      </View>

      {/* =========================================
          VILLAGER PLAYERS
      ========================================= */}

      <View
        style={[
          styles.villagerPlayers,

          /*
           * Different vertical arrangement depending
           * on the number of villagers.
           */
          villagers.length <= 3 &&
            styles.villagerPlayersThree,

          villagers.length >= 4 &&
            styles.villagerPlayersMany,
        ]}
      >
      {villagers.map((player, index) => (
  <VillagerPlayer
    key={player.playerId}
    player={player}
    index={index}
    totalPlayers={villagers.length}
    showName={showVillagerNames}
  />
))}
      </View>

      {/* =========================================
          SPY
      ========================================= */}

      <View style={styles.spyPlayers}>
        {spies.map((player) => (
          <SpyPlayer
            key={player.playerId}
            player={player}
          />
        ))}
      </View>
    </View>
  );
}

/* =================================================
   VILLAGER PLAYER
================================================= */

function VillagerPlayer({
  player,
  index,
  totalPlayers,
  showName,
}: {
  player: GameOverPlayer;
  index: number;
  totalPlayers: number;
  showName: boolean;
}) {
  const isThreePlayerArch =
    totalPlayers === 1 ||
    totalPlayers === 2 ||
    totalPlayers === 3;

  const isSevenPlayer =
    totalPlayers === 7;

  const isCenterPlayer =
    isThreePlayerArch &&
    totalPlayers === 3 &&
    index === 1;

  const isSevenBottomRow =
    isSevenPlayer &&
    index >= 3;

  return (
    <View
      style={[
        styles.villagerPlayer,

        isThreePlayerArch &&
          styles.threePlayerVillager,

        isCenterPlayer &&
          styles.archCenterPlayer,

        isSevenPlayer &&
          styles.sevenPlayerVillager,

        isSevenBottomRow &&
          styles.sevenBottomPlayer,
      ]}
    >
      {player.avatar ? (
        <Image
          source={{ uri: player.avatar }}
          contentFit="cover"
          style={[
            styles.villagerAvatar,

            isThreePlayerArch &&
              styles.largeVillagerAvatar,

            isSevenPlayer &&
              styles.sevenVillagerAvatar,
          ]}
        />
      ) : (
        <View
          style={[
            styles.villagerAvatarFallback,

            isThreePlayerArch &&
              styles.largeVillagerAvatar,

            isSevenPlayer &&
              styles.sevenVillagerAvatar,
          ]}
        >
          <Text style={styles.avatarLetter}>
            {player.name
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>
      )}

      {showName && (
        <Text
          numberOfLines={1}
          style={styles.villagerName}
        >
          {formatPlayerName(player.name)}
        </Text>
      )}
    </View>
  );
}

/* =================================================
   SPY PLAYER
================================================= */

function SpyPlayer({
  player,
}: {
  player: GameOverPlayer;
}) {
  return (
    <View style={styles.spyPlayer}>
      {player.avatar ? (
        <Image
          source={{ uri: player.avatar }}
          contentFit="cover"
          style={styles.spyAvatar}
        />
      ) : (
        <View style={styles.spyAvatarFallback}>
          <Text style={styles.spyAvatarLetter}>
            {player.name
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>
      )}

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={styles.spyName}
      >
        {formatPlayerName(player.name)}
      </Text>
    </View>
  );
}

/* =================================================
   NAME FORMAT
================================================= */

function formatPlayerName(name: string): string {
  if (name.length <= 8) {
    return name;
  }

  return `${name.slice(0, 6)}..`;
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  /* ===============================================
     BOARD
  =============================================== */

  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ===============================================
     WORDS
  =============================================== */

  wordReveal: {
    position: "absolute",

top: "20%",
left: "20%",
right: "16%",
height: "7.2%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  villagerWordSlot: {
    width: "41%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  spyWordSlot: {
    width: "41%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  villagerWord: {
    width: "100%",

    textAlign: "center",

    fontSize: 16,
    fontWeight: "900",

    /*
     * BLUE TINT ONLY
     */
    color: "#e5d160",

    textShadowColor: "#06182E",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },

  spyWord: {
    width: "100%",

    textAlign: "center",

    fontSize: 16,
    fontWeight: "900",

    /*
     * RED TINT ONLY
     */
    color: "#c63636",

    textShadowColor: "#350808",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },

  /* ===============================================
     VILLAGER AREA
  =============================================== */

villagerPlayers: {
    position: "absolute",
    left: "17%",
    right: "17%",

    alignItems: "center",
    justifyContent: "center",
  },


villagerPlayersThree: {
    top: "33.5%",
    height: "19%",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },


villagerPlayersMany: {
    top: "32.5%",
    height: "23%",

    flexDirection: "row",
    flexWrap: "wrap",

    alignContent: "flex-start",
    alignItems: "center",
    justifyContent: "center",

    columnGap: 3,
    rowGap: 7,
  },

  /* ===============================================
     VILLAGER PLAYER
  =============================================== */

villagerPlayer: {
    width: "31%",

    alignItems: "center",
    justifyContent: "center",

    minHeight: 42,
  },

  threePlayerVillager: {
    width: "31%",
  },

  /*
   * Center player sits slightly higher,
   * creating the reverse-U / arch shape.
   */
  archCenterPlayer: {
    transform: [
      {
        translateY: -10,
      },
    ],
  },

  /*
   * Seven-player layout.
   * 3 players on row one,
   * 4 players on row two.
   */
  sevenPlayerVillager: {
    width: "25%",
  },

  /*
   * Pull the four bottom players closer together.
   */
  sevenBottomPlayer: {
    marginLeft: -2,
    marginRight: -2,
  },

  /* ===============================================
     VILLAGER AVATAR
  =============================================== */

 villagerAvatar: {
    width: 32,
    height: 32,

    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: "#F2A900",

    backgroundColor: "#111111",
  },

  /*
   * 1–3 players:
   * approximately 2× the normal avatar.
   */
  largeVillagerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  /*
   * 7 players:
   * approximately 10% larger than normal.
   */
  sevenVillagerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },

  villagerAvatarFallback: {
    width: 32,
    height: 32,

    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: "#F2A900",

    backgroundColor: "#111111",

    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetter: {
    color: "#F5E7C5",
    fontSize: 12,
    fontWeight: "900",
  },

  /* ===============================================
     VILLAGER NAME
  =============================================== */

  villagerName: {
    marginTop: 2,

    maxWidth: 54,

    textAlign: "center",

    color: "#F5E7C5",

    fontSize: 8,
    fontWeight: "800",

    textShadowColor: "#000000",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },

  /* ===============================================
     SPY AREA
  =============================================== */

spyPlayers: {
    position: "absolute",
  top: "66.5%",
left: "16%",
right: "16%",
height: "18.5%",

    alignItems: "center",
    justifyContent: "center",
  },

  spyPlayer: {
    alignItems: "center",
    justifyContent: "center",

    width: "60%",
  },

  /* ===============================================
     SPY AVATAR
  =============================================== */

spyAvatar: {
    width: 60,
    height: 60,

    borderRadius: 30,

    borderWidth: 2,
    borderColor: "#F2A900",

    backgroundColor: "#111111",
  },

  spyAvatarFallback: {
    width: 60,
    height: 60,

    borderRadius: 30,

    borderWidth: 2,
    borderColor: "#F2A900",

    backgroundColor: "#111111",

    alignItems: "center",
    justifyContent: "center",
  },

  spyAvatarLetter: {
    color: "#F5E7C5",
    fontSize: 25,
    fontWeight: "900",
  },

  /* ===============================================
     SPY NAME
  =============================================== */

  spyName: {
    marginTop: 4,

    maxWidth: 90,

    textAlign: "center",

    color: "#F5E7C5",

    fontSize: 12,
    fontWeight: "900",

    textShadowColor: "#000000",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
});