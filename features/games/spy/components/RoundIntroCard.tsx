import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  roundNumber: number;
};

export default function RoundIntroCard({
  roundNumber,
}: Props) {
  const { width, height } =
    useWindowDimensions();

  // Responsive card size
  const cardWidth = Math.min(
    width * 0.78,
    420
  );

  const cardHeight =
    cardWidth * 0.68;

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
      {/* SPY + BOARD */}
      <Image
        source={require("@/assets/images/games/spy/boards/round_intro.png")}
        contentFit="contain"
        style={StyleSheet.absoluteFill}
      />

      {/* ROUND PILL */}
      <View
        style={[
          styles.roundPill,
          {
            width: cardWidth * 0.32,
            minWidth: 105,
            maxWidth: 150,
          },
        ]}
      >
        <Text style={styles.roundText}>
          ROUND {roundNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  roundPill: {
    position: "absolute",

    top: "57%",

    transform: [
      {
        translateY: -2,
      },
    ],

    minHeight: 30,

    paddingHorizontal: 12,

    borderRadius: 999,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(5,5,7,0.72)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.72)",

    shadowColor: "#F2A900",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.16,

    shadowRadius: 6,

    elevation: 4,
  },

  roundText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1.4,

    includeFontPadding: false,
  },
});