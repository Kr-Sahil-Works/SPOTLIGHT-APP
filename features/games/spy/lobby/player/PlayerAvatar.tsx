import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type Props = {
  avatar: string | number;
  size: number;
  isHost?: boolean;
  isSelf?: boolean;
  isReady?: boolean;
  isConnected?: boolean;
  isSpeaking?: boolean;
  isPlaying?: boolean;
  isEliminated?: boolean;
  allOtherPlayersReady?: boolean;
};

export default function PlayerAvatar({
  avatar,
  size,
  isHost = false,
  isSelf = false,
  isReady = false,
  isConnected = true,
  isSpeaking = false,
  isPlaying = false,
  isEliminated = false,
  allOtherPlayersReady = false,
}: Props) {
  const source =
    typeof avatar === "string"
      ? { uri: avatar }
      : avatar;

  const radius = size * 0.28;

const showReady =
  isReady &&
  !isPlaying &&
  (
    !isHost ||
    allOtherPlayersReady
  );

  const showTurn =
    isPlaying && isSpeaking;

  const showEliminated =
    isPlaying && isEliminated;

  const showIdentityBorder =
    !isPlaying &&
    (
      isHost
        ? !allOtherPlayersReady
        : !showReady
    );

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,

          borderRadius: radius,

          opacity:
            isConnected
              ? 1
              : 0.45,

          shadowColor:
            showReady
              ? "#22C55E"
              : "#000",

          shadowOpacity:
            showReady
              ? 0.95
              : 0.30,

          shadowRadius:
            showReady
              ? 10
              : 5,

          elevation:
            showReady
              ? 10
              : 5,
        },
      ]}
    >
      <Image
        source={source}
        contentFit="cover"
        style={[
          {
            width: size - 7,
            height: size - 7,
            borderRadius: radius - 3,
          },

          showEliminated && {
            opacity: 0.28,
          },
        ]}
      />

      {showIdentityBorder && (
        <View
          pointerEvents="none"
          style={[
            styles.identityRing,
            {
              width: size - 7,
              height: size - 7,
              borderRadius: radius - 3,

              borderColor:
                isSelf
                  ? "#FFD15A"
                  : "#F2A900",

              borderWidth:
                isSelf
                  ? 1.8
                  : 1.4,
            },
          ]}
        />
      )}

      {showTurn && (
        <View
          pointerEvents="none"
          style={[
            styles.turnRing,
            {
              width: size - 7,
              height: size - 7,
              borderRadius: radius - 3,
            },
          ]}
        />
      )}

         {showEliminated && (
  <Image
    pointerEvents="none"
    source={require(
      "@/assets/images/games/spy/icons/eliminated_emoji.png"
    )}
    contentFit="contain"
    style={[
      styles.eliminatedEmoji,
      {
        width: size * 0.78,
        height: size * 0.78,
      },
    ]}
  />
)}

{showEliminated && (
  <View
    pointerEvents="none"
    style={[
      styles.eliminatedOverlay,
      {
        width: size - 7,
        height: size - 7,
        borderRadius: radius - 3,
      },
    ]}
  />
)}

  
    </View>
  );
}


const styles =
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",

      position: "relative",

      overflow: "visible",

      backgroundColor:
        "rgba(20,20,28,0.65)",
    },

    identityRing: {
      position: "absolute",

      top: 3.5,
      left: 3.5,

      backgroundColor:
        "transparent",

      zIndex: 2,
    },

    turnRing: {
      position: "absolute",

      top: 3.5,
      left: 3.5,

      borderWidth: 1.6,

      borderColor: "#F2A900",

      backgroundColor:
        "transparent",

      shadowColor:
        "transparent",

      shadowOffset: {
        width: 0,
        height: 0,
      },

      shadowOpacity: 0,

      shadowRadius: 0,

      elevation: 0,

      zIndex: 2,
    },

    eliminatedOverlay: {
      position: "absolute",

      top: 3.5,
      left: 3.5,

      borderWidth: 1.6,

      borderColor:
        "rgba(255,255,255,0.35)",

      backgroundColor:
        "rgba(0,0,0,0.25)",

      zIndex: 3,
    },


    eliminatedEmoji: {
  position: "absolute",

  alignSelf: "center",

  opacity: 0.90,

  zIndex: 10,
},
  });