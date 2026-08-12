import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type Props = {
  avatar: string | number;

  size: number;

  isHost?: boolean;

  isReady?: boolean;

  isConnected?: boolean;

  isSpeaking?: boolean;
};

export default function PlayerAvatar({
  avatar,
  size,
  isHost = false,
  isReady = false,
  isConnected = true,
  isSpeaking = false,
}: Props) {
  const source =
    typeof avatar === "string"
      ? { uri: avatar }
      : avatar;

  const radius = size * 0.28;

  let borderColor = "rgba(255,255,255,0.08)";

  if (isHost) {
    borderColor = "#F2A900";
  }

  if (isSpeaking) {
    borderColor = "#A855F7";
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,

          borderRadius: radius,

          borderColor,

          opacity: isConnected
            ? 1
            : 0.45,

          shadowColor: isReady
            ? "#22C55E"
            : "#000",

          shadowOpacity: isReady
            ? 0.9
            : 0.35,

        shadowRadius: isReady
  ? 9.5
  : 6.5,
        },
      ]}
    >
      <Image
        source={source}
        contentFit="cover"
        style={{
          width: size - 7,
          height: size - 7,

          borderRadius:
            radius - 3,
        }}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      justifyContent:
        "center",

      alignItems: "center",

      overflow: "hidden",

      backgroundColor:
        "rgba(20,20,28,0.65)",

      borderWidth: 1.6,

      elevation: 8,
    },
  });
