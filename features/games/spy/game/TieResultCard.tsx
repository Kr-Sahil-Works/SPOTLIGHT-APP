import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

type TieResultType =
  | "tie"
  | "superTie"
  | "tieBreakNoElimination"
  | "tieLimitReached";

type Props = {
  type: TieResultType;
  tieRoundCount: number;
};

export default function TieResultCard({
  type,
  tieRoundCount,
}: Props) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(
    Math.max(width * 0.88, 300),
    420
  );

  const cardHeight =
    cardWidth / 1.72;

  const isSuperTie =
    type === "superTie";

  const isTieLimit =
    type === "tieLimitReached";

  const isTieBreakNoElimination =
    type === "tieBreakNoElimination";

  const title = isTieLimit
    ? "TIE LIMIT"
    : isSuperTie
    ? "SUPER TIE"
    : isTieBreakNoElimination
    ? "TIE-BREAK TIED"
    : "TIE!";

  const subtitle = isTieLimit
    ? "SPY WINS"
    : isSuperTie
    ? "NO PLAYER ELIMINATED"
    : isTieBreakNoElimination
    ? "NO PLAYER ELIMINATED"
    : "VOTE TIED";

  const description = isTieLimit
    ? "The maximum number of tie rounds has been reached."
    : isSuperTie
    ? "Everyone received the same number of votes."
    : isTieBreakNoElimination
    ? "The tie-break vote remained tied."
    : "The tied players will speak again.";

  const illustration =
    isSuperTie
      ? require(
          "@/assets/images/games/spy/boards/super-tie.webp"
        )
      : require(
          "@/assets/images/games/spy/boards/tie-match.webp"
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
      <Image
        source={illustration}
        contentFit="contain"
        style={styles.illustration}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>

        <View style={styles.roundPill}>
          <Text style={styles.roundText}>
            TIE ROUND {tieRoundCount} / 15
          </Text>
        </View>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",

    alignItems: "center",
    justifyContent: "center",
  },

  illustration: {
    ...StyleSheet.absoluteFillObject,

    width: "100%",
    height: "100%",
  },

  content: {
    position: "absolute",

    left: "12%",
    right: "12%",

    top: "12%",
    bottom: "8%",

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#F2A900",

    fontSize: 23,

    fontWeight: "900",

    letterSpacing: 2.2,

    textAlign: "center",

    textShadowColor:
      "rgba(242,169,0,0.35)",

    textShadowOffset: {
      width: 0,
      height: 0,
    },

    textShadowRadius: 8,
  },

  subtitle: {
    marginTop: 3,

    color: "#FFFFFF",

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.3,

    textAlign: "center",
  },

  roundPill: {
    marginTop: 10,

    minWidth: 118,

    paddingHorizontal: 13,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor:
      "rgba(5,5,7,0.82)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.72)",

    shadowColor: "#F2A900",

    shadowOpacity: 0.18,

    shadowRadius: 6,

    elevation: 4,
  },

  roundText: {
    color: "#F2A900",

    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.1,

    textAlign: "center",
  },

  description: {
    marginTop: 9,

    maxWidth: "90%",

    color: "#A9A49C",

    fontSize: 9,

    fontWeight: "600",

    lineHeight: 13,

    letterSpacing: 0.2,

    textAlign: "center",
  },
});