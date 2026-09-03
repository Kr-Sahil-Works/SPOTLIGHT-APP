import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

type Props = {
  playerName: string;
  playerAvatar: string | number;

  voteCount: number;

  role?: "spy" | "villager";

  showRole?: boolean;
};

export default function VotingResultCard({
  playerName,
  playerAvatar,
  voteCount,
  role,
  showRole = false,
}: Props) {
  const { width } =
    useWindowDimensions();

  const cardWidth = Math.min(
    Math.max(width * 0.76, 280),
    340
  );

  const cardHeight =
    cardWidth / 1.55;

  const avatarSize =
    Math.min(
      Math.max(cardWidth * 0.19, 58),
      72
    );

  const roleIsSpy =
    role === "spy";

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
        source={require(
          "@/assets/images/games/spy/boards/round_intro.png"
        )}
        contentFit="fill"
        style={styles.board}
      />

      {/* =========================
          CONTENT
      ========================= */}

      <View style={styles.content}>
        {/* TITLE */}

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          VOTED OUT
        </Text>

        {/* AVATAR */}

        <View
          style={[
            styles.avatarFrame,
            {
              width:
                avatarSize + 8,
              height:
                avatarSize + 8,
              borderRadius: 12,
            },
          ]}
        >
          <Image
            source={
              typeof playerAvatar ===
              "string"
                ? {
                    uri:
                      playerAvatar,
                  }
                : playerAvatar
            }
            contentFit="cover"
            style={{
              width:
                avatarSize,
              height:
                avatarSize,
              borderRadius: 9,
            }}
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

        {!showRole ? (
          <Text
            style={styles.votes}
          >
            Got {voteCount}{" "}
            {voteCount === 1
              ? "vote"
              : "votes"}
          </Text>
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
      position:
        "absolute",

      left: "15%",
      right: "15%",

      top: "18%",
      bottom: "12%",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    title: {
      color: "#D09A00",

      fontSize: 19,

      fontWeight: "900",

      letterSpacing: 1.4,

      textAlign:
        "center",

      marginBottom: 8,
    },

    avatarFrame: {
      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth: 1.8,

      borderColor:
        "#F2A900",

      backgroundColor:
        "rgba(10,10,10,0.9)",

      shadowColor:
        "#F2A900",

      shadowOpacity:
        0.45,

      shadowRadius: 7,

      elevation: 7,
    },

    name: {
      marginTop: 6,

      color: "#FFFFFF",

      fontSize: 17,

      fontWeight: "900",

      letterSpacing: 0.2,

      textAlign:
        "center",
    },

    votes: {
      marginTop: 3,

      color: "#D09A00",

      fontSize: 10,

      fontWeight: "700",

      letterSpacing: 0.3,
    },

    rolePlate: {
      marginTop: 8,

      minWidth: 145,

      paddingHorizontal: 16,
      paddingVertical: 5,

      borderRadius: 14,

      alignItems:
        "center",
      justifyContent:
        "center",

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