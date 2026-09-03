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
                opacity: 0.96,
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
                      12 * scale,
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

content: {
  position: "absolute",

  left: "18%",
  right: "18%",

  top: "42%",

  height: 44,

  alignItems: "center",
  justifyContent: "center",

  zIndex: 5,

  paddingHorizontal: 4,

  transform: [
    {
      translateY: 8,
    },
  ],
},



word: {
  color: "#F5E8C8",

  fontWeight: "900",

  letterSpacing: 0.8,

  textAlign: "center",

  // textTransform: "uppercase",

  includeFontPadding: false,

  textShadowColor:
    "rgba(55,32,0,0.9)",

  textShadowOffset: {
    width: 1,
    height: 1.5,
  },

  textShadowRadius: 0.6,
},




 title: {
  color: "#F8F3E4",

  fontWeight: "900",

  letterSpacing: 0.45,

  textAlign: "center",

  textTransform: "uppercase",

  includeFontPadding: false,

  textShadowColor:
    "#3d3421bc",

  textShadowOffset: {
    width: 0,
    height: 0,
  },

  textShadowRadius: 4,
},

 subtitle: {
  marginTop: 3,

  color: "#C99418",

  fontWeight: "600",

  letterSpacing: 0.1,

  textAlign: "center",

  includeFontPadding: false,

  opacity: 0.9,
},
});