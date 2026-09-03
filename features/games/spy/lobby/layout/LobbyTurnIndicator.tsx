import React, {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";
import SpeakingTurnSkipButton from "../player/SpeakingTurnSkipButton";

type LobbyTurnIndicatorProps = {
  visible: boolean;
  isMyTurn: boolean;
  speakerName?: string;
  speakerAvatar?: string;
  speakerNumber?: number;
  remaining: number | null;
  onSkipTurn?: () => void;
};

export default function LobbyTurnIndicator({
  visible,
  isMyTurn,
  speakerName,
  speakerAvatar,
  speakerNumber,
  remaining,
  onSkipTurn,
}: LobbyTurnIndicatorProps) {
  /*
   * =========================
   * 🎤 SPEAKING WAVE
   * =========================
   */

  const wave1 = useRef(
    new Animated.Value(0.35)
  ).current;

  const wave2 = useRef(
    new Animated.Value(0.65)
  ).current;

  const wave3 = useRef(
    new Animated.Value(0.45)
  ).current;

  const wave4 = useRef(
    new Animated.Value(0.75)
  ).current;

  const wave5 = useRef(
    new Animated.Value(0.35)
  ).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const createWave = (
      value: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            easing:
              Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0.25,
            duration: 300,
            easing:
              Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createWave(wave1, 0),
      createWave(wave2, 90),
      createWave(wave3, 180),
      createWave(wave4, 60),
      createWave(wave5, 140),
    ];

    animations.forEach((animation) =>
      animation.start()
    );

    return () => {
      animations.forEach((animation) =>
        animation.stop()
      );
    };
  }, [
    visible,
    wave1,
    wave2,
    wave3,
    wave4,
    wave5,
  ]);

  if (!visible) {
    return null;
  }

  const timerProgress =
  remaining === null
    ? 1
    : Math.min(
        1,
        Math.max(
          0,
          remaining / 30
        )
      );


  const displayName =
    isMyTurn
      ? "You"
      : speakerName ?? "Unknown";

  return (
<View
  pointerEvents="box-none"
  style={styles.container}
>
  <View style={styles.card}>

        {/* =========================
            PLAYER NUMBER
        ========================= */}

        {speakerNumber !== undefined && (
          <View style={styles.playerNumber}>
            <Text style={styles.playerNumberText}>
              {speakerNumber}
            </Text>
          </View>
        )}

        {/* =========================
            HEADER
        ========================= */}

        <View style={styles.header}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  isMyTurn
                    ? "#F2A900"
                    : "#D2A62A",
              },
            ]}
          />

          <Text style={styles.headerText}>
            {isMyTurn
              ? "YOUR TURN"
              : "SPEAKING"}
          </Text>
        </View>

        {/* =========================
            PLAYER
        ========================= */}

        <View style={styles.playerRow}>
          <View style={styles.avatarWrapper}>
            {speakerAvatar ? (
              <Image
                source={{
                  uri: speakerAvatar,
                }}
                contentFit="cover"
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                ]}
              >
                <Text
                  style={
                    styles.avatarFallbackText
                  }
                >
                  {isMyTurn
                    ? "?"
                    : displayName
                        .charAt(0)
                        .toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.playerInfo}>
            <Text
              numberOfLines={1}
              style={styles.speakerName}
            >
              {displayName}
            </Text>

            {isMyTurn && (
              <Text style={styles.subtitle}>
                Speak now
              </Text>
            )}
          </View>
        </View>

        {/* =========================
            TIMER + VOICE
        ========================= */}

        <View style={styles.bottomRow}>

          <View style={styles.timerRow}>
           <Text
  style={[
    styles.timer,
    {
      opacity:
        0.82 +
        timerProgress * 0.18,
    },
  ]}
>
  {remaining ?? 0}
</Text>

            <Text style={styles.seconds}>
              SEC
            </Text>
          </View>

          {/* =========================
              COMPACT VOICE WAVE
          ========================= */}

          <View style={styles.waveBox}>
            <Animated.View
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: wave1,
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: wave2,
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: wave3,
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: wave4,
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: wave5,
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </View>
      {isMyTurn && (
  <SpeakingTurnSkipButton
    visible={true}
    onPress={onSkipTurn}
  />
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 115,

    left: 0,
    right: 0,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 900,
    elevation: 900,
  },

  card: {
    width: 224,

    minHeight: 150,

    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,

    borderRadius: 25,

    backgroundColor:
      "rgba(5,5,7,0.94)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.13)",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.55,

    shadowRadius: 18,

    elevation: 16,
  },

  /* =========================
     PLAYER NUMBER
  ========================= */

  playerNumber: {
    position: "absolute",

    top: 11,
    right: 12,

    width: 18,
    height: 18,

    borderRadius: 6,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(242,169,0,0.14)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.55)",

    zIndex: 10,
  },

  playerNumberText: {
    color: "#F2A900",

    fontSize: 9,

    fontWeight: "900",

    lineHeight: 10,

    textAlign: "center",
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 8,
  },

  statusDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 6,
  },

  headerText: {
    color:
      "rgba(255,255,255,0.68)",

    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1,
  },

  /* =========================
     PLAYER
  ========================= */

  playerRow: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",
  },

  avatarWrapper: {
    width: 72,
    height: 72,

    borderRadius: 36,

    overflow: "hidden",

    backgroundColor:
      "rgba(255,255,255,0.08)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFallbackText: {
    color: "#FFF",

    fontSize: 23,

    fontWeight: "900",
  },

  playerInfo: {
    flex: 1,

    marginLeft: 11,

    justifyContent: "center",

    minWidth: 0,

    paddingRight: 25,
  },

  speakerName: {
    color: "#FFF",

    fontSize: 15,

    fontWeight: "900",

    maxWidth: 105,
  },

  subtitle: {
    color:
      "rgba(255,255,255,0.38)",

    fontSize: 8,

    fontWeight: "700",

    marginTop: 3,
  },

  /* =========================
     TIMER
  ========================= */

  bottomRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 6,
  },

  timerRow: {
    flexDirection: "row",

    alignItems: "baseline",
  },

timer: {
  color: "#FFF",

  fontSize: 26,

  lineHeight: 29,

  fontWeight: "900",

  letterSpacing: -0.5,
},

seconds: {
  color:
    "rgba(255,255,255,0.38)",

  fontSize: 6,
},

  /* =========================
     COMPACT WAVE
  ========================= */

  waveBox: {
    width: 53,
    height: 34,

    borderRadius: 17,

    backgroundColor:
      "rgba(255,255,255,0.08)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 3,
  },

  waveBar: {
    width: 2.5,

    height: 15,

    borderRadius: 3,

    backgroundColor:
      "#F2A900",
  },
});