import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function FloatingWordCard({
  title,
  subtitle,
}: Props) {
  const { width } = useWindowDimensions();

  const scale = Math.min(
    Math.max(width / 390, 0.85),
    1.08
  );

const boardWidth = Math.min(
  Math.max(width * 0.72, 270),
  310
);

const boardHeight = boardWidth * 0.408;


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
      <Image
        source={require("@/assets/images/games/spy/mascot/f2.png")}
        style={styles.boardImage}
        contentFit="fill"
      />

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
          style={[
            styles.title,
            {
              fontSize: 16 * scale,
            },
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            style={[
              styles.subtitle,
              {
                fontSize: 10 * scale,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 wrapper: {
  position: "absolute",
  top: 14,
  alignSelf: "center",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 40,
},

boardImage: {
  position: "absolute",
  width: "62%",
  height: "74%",
},

content: {
  position: "absolute",

  left: "17%",
  right: "17%",
  top: "18%",
  bottom: "18%",

  alignItems: "center",
  justifyContent: "center",

  zIndex: 2,
},

  title: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.45,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 4,
    color: "#cd9a00",
    fontWeight: "600",
    letterSpacing: 0.15,
    textAlign: "center",
  },
});