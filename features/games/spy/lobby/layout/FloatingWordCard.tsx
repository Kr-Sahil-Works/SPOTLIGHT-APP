import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  word?: string;
  title?: string;
  subtitle?: string;
};

export default function FloatingWordCard({
  word,
  title,
  subtitle,
}: Props) {

  const { width } = useWindowDimensions();

const scale = Math.min(
  Math.max(width / 390, 0.88),
  1.05
);

const boardWidth = Math.min(
  Math.max(width * 0.45, 158),
  188
);

const boardHeight = boardWidth / 1.55;

const isWordMode = !!word;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrapper,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
    >
      {/* =========================
          🖼️ FRAME
      ========================= */}

      <Image
        source={require(
          "@/assets/images/games/spy/mascot/floatingword.png"
        )}
        style={styles.boardImage}
        contentFit="fill"
      />

      {/* =========================
          📝 CONTENT
      ========================= */}

      <View style={styles.content}>
        {isWordMode ? (
          /* =========================
             🔐 PLAYER WORD
          ========================= */

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            style={[
              styles.word,
              {
                fontSize: 18 * scale,
              },
            ]}
          >
            {word}
          </Text>
        ) : (
          /* =========================
             ⏳ WAITING ROOM
          ========================= */

          <>
            {!!title && (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.55}
                style={[
                  styles.title,
                  {
                    fontSize:
                      13 * scale,
                  },
                ]}
              >
                {title}
              </Text>
            )}

            {!!subtitle && (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
                style={[
                  styles.subtitle,
                  {
                    fontSize:
                      10 * scale,
                  },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
wrapper: {
  position: "absolute",

  top: -12, 

  alignSelf: "center",

  justifyContent: "center",
  alignItems: "center",

  zIndex: 40,

  overflow: "visible",
},

  boardImage: {
    position: "absolute",

    left: 0,
    top: 0,

    width: "100%",
    height: "100%",

    zIndex: 1,
  },

  /*
   * Actual black/gold plaque area.
   *
   * The floating PNG contains a lot of empty/wire area,
   * so the text must NOT be centered across the whole PNG.
   */
  content: {
    position: "absolute",

    left: "17%",
    right: "17%",

    top: "55%",
    bottom: "20%",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 5,

    paddingHorizontal: 2,
  },

  word: {
    color: "#FFFFFF",

    fontWeight: "900",

    letterSpacing: 0.6,

    textAlign: "center",

    textTransform: "uppercase",

    includeFontPadding: false,
  },

  title: {
    color: "#FFFFFF",

    fontWeight: "900",

    letterSpacing: 0.35,

    textAlign: "center",

    textTransform: "uppercase",

    includeFontPadding: false,
  },

  subtitle: {
    marginTop: 3,

    color: "#D09A00",

    fontWeight: "600",

    letterSpacing: 0.1,

    textAlign: "center",

    includeFontPadding: false,
  },
});