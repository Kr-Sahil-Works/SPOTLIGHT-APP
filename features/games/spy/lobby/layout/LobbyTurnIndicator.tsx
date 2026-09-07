import React, {
  useEffect,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Reanimated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Image } from "expo-image";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import SpeakingTurnSkipButton from "../player/SpeakingTurnSkipButton";


/* =========================
   🎨 ANIMATED SVG RECT
========================= */

const AnimatedRect =
  Reanimated.createAnimatedComponent(
    Rect
  );

const AnimatedCircle =
  Reanimated.createAnimatedComponent(
    Circle
  );

/* =========================
   🎤 PROPS
========================= */

type LobbyTurnIndicatorProps = {
  visible: boolean;

  isMyTurn: boolean;

  speakerName?: string;

  speakerAvatar?: string;

  speakerNumber?: number;

  remaining: number | null;

  turnEndsAt?: number;

  onSkipTurn?: () => void;

  isTieBreak?: boolean;
};


/* =========================
   🎮 COMPONENT
========================= */

export default function LobbyTurnIndicator({
  visible,

  isMyTurn,

  speakerName,

  speakerAvatar,

  speakerNumber,

  remaining,

  turnEndsAt,

onSkipTurn,

isTieBreak = false,
}: LobbyTurnIndicatorProps) {


  /* =========================
     ⏱️ TIMER PROGRESS
  ========================= */

  const timerProgress =
    useSharedValue(1);


  /* =========================
     🎤 VOICE WAVE VALUES
  ========================= */

  const wave1 =
    useSharedValue(0.45);

  const wave2 =
    useSharedValue(0.70);

  const wave3 =
    useSharedValue(0.35);

  const wave4 =
    useSharedValue(0.85);

  const wave5 =
    useSharedValue(0.50);


  /* =========================
     ⏱️ SMOOTH TIMER ANIMATION
  ========================= */

  useEffect(() => {
    if (
      !visible ||
      !turnEndsAt
    ) {
      timerProgress.value = 1;
      return;
    }

    const remainingMs =
      Math.max(
        0,
        turnEndsAt -
          Date.now()
      );

    /*
     * Reset immediately when a
     * new speaker/turn starts.
     */
    timerProgress.value = 1;

    /*
     * Then continuously travel
     * from 100% → 0%.
     *
     * Linear = analog timer feel.
     */
    timerProgress.value =
      withTiming(
        0,
        {
          duration:
            remainingMs,

          easing:
            Easing.linear,
        }
      );
  }, [
    visible,
    turnEndsAt,
  ]);


  /* =========================
     🎤 BUTTERY VOICE WAVE
  ========================= */

  useEffect(() => {
    if (!visible) {
      return;
    }

    /*
     * Slightly slower and staggered
     * than the old animation.
     *
     * This avoids the mechanical
     * "jumping bars" appearance.
     */

    wave1.value =
      withRepeat(
        withSequence(
          withTiming(
            1,
            {
              duration: 420,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          ),

          withTiming(
            0.28,
            {
              duration: 420,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          )
        ),
        -1,
        false
      );


    wave2.value =
      withRepeat(
        withSequence(
          withTiming(
            0.32,
            {
              duration: 470,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          ),

          withTiming(
            0.90,
            {
              duration: 470,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          )
        ),
        -1,
        false
      );


    wave3.value =
      withRepeat(
        withSequence(
          withTiming(
            0.95,
            {
              duration: 390,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          ),

          withTiming(
            0.25,
            {
              duration: 390,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          )
        ),
        -1,
        false
      );


    wave4.value =
      withRepeat(
        withSequence(
          withTiming(
            0.30,
            {
              duration: 450,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          ),

          withTiming(
            1,
            {
              duration: 450,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          )
        ),
        -1,
        false
      );


    wave5.value =
      withRepeat(
        withSequence(
          withTiming(
            0.85,
            {
              duration: 410,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          ),

          withTiming(
            0.30,
            {
              duration: 410,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
            }
          )
        ),
        -1,
        false
      );

  }, [
    visible,
  ]);


/* =========================
   🌌 SUBTLE AMBIENT GLOW
========================= */

const glow1X = useSharedValue(45);
const glow1Y = useSharedValue(45);
const glow1Opacity = useSharedValue(0.22);

const glow2X = useSharedValue(175);
const glow2Y = useSharedValue(105);
const glow2Opacity = useSharedValue(0.18);

const glow3X = useSharedValue(110);
const glow3Y = useSharedValue(150);
const glow3Opacity = useSharedValue(0.14);

useEffect(() => {
  if (!visible) {
    return;
  }

  glow1X.value = withRepeat(
    withSequence(
      withTiming(75, {
        duration: 4200,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(30, {
        duration: 4200,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

  glow1Y.value = withRepeat(
    withSequence(
      withTiming(70, {
        duration: 3600,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(35, {
        duration: 3600,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

glow1Opacity.value = withRepeat(
  withSequence(
    withTiming(0.30, {
      duration: 3000,
      easing: Easing.inOut(Easing.sin),
    }),
    withTiming(0.10, {
      duration: 3000,
      easing: Easing.inOut(Easing.sin),
    })
  ),
  -1,
  true
);

  glow2X.value = withRepeat(
    withSequence(
      withTiming(145, {
        duration: 5000,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(190, {
        duration: 5000,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

  glow2Y.value = withRepeat(
    withSequence(
      withTiming(70, {
        duration: 4200,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(115, {
        duration: 4200,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

glow2Opacity.value = withRepeat(
  withSequence(
    withTiming(0.25, {
      duration: 3600,
      easing: Easing.inOut(Easing.sin),
    }),
    withTiming(0.07, {
      duration: 3600,
      easing: Easing.inOut(Easing.sin),
    })
  ),
  -1,
  true
);

  glow3X.value = withRepeat(
    withSequence(
      withTiming(135, {
        duration: 6200,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(85, {
        duration: 6200,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

  glow3Y.value = withRepeat(
    withSequence(
      withTiming(125, {
        duration: 4800,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(155, {
        duration: 4800,
        easing: Easing.inOut(Easing.sin),
      })
    ),
    -1,
    true
  );

glow3Opacity.value = withRepeat(
  withSequence(
    withTiming(0.20, {
      duration: 4200,
      easing: Easing.inOut(Easing.sin),
    }),
    withTiming(0.05, {
      duration: 4200,
      easing: Easing.inOut(Easing.sin),
    })
  ),
  -1,
  true
);
}, [visible]);

const glow1Props = useAnimatedProps(() => ({
  cx: glow1X.value,
  cy: glow1Y.value,
  opacity: glow1Opacity.value,
}));

const glow2Props = useAnimatedProps(() => ({
  cx: glow2X.value,
  cy: glow2Y.value,
  opacity: glow2Opacity.value,
}));

const glow3Props = useAnimatedProps(() => ({
  cx: glow3X.value,
  cy: glow3Y.value,
  opacity: glow3Opacity.value,
}));

/* =========================
   ⏱️ BORDER ANIMATION
========================= */

  const animatedBorderProps =
    useAnimatedProps(
      () => ({
        strokeDashoffset:
          720 *
          (
            1 -
            timerProgress.value
          ),
      })
    );


  /* =========================
     🎤 WAVE ANIMATED STYLES
  ========================= */

  const waveStyle1 =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scaleY:
              wave1.value,
          },
        ],
      })
    );


  const waveStyle2 =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scaleY:
              wave2.value,
          },
        ],
      })
    );


  const waveStyle3 =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scaleY:
              wave3.value,
          },
        ],
      })
    );


  const waveStyle4 =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scaleY:
              wave4.value,
          },
        ],
      })
    );


  const waveStyle5 =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scaleY:
              wave5.value,
          },
        ],
      })
    );


    const timerTextStyle =
  useAnimatedStyle(() => ({
    opacity:
      0.82 +
      timerProgress.value * 0.18,
  }));
  
  /* =========================
     👤 DISPLAY NAME
  ========================= */

  const displayName =
    isMyTurn
      ? "You"
      : speakerName ??
        "Unknown";


  /* =========================
     🚫 HIDDEN
  ========================= */

  if (!visible) {
    return null;
  }


  /* =========================
     🎮 UI
  ========================= */

  return (
    <View
      pointerEvents="box-none"
      style={
        styles.container
      }
    >

      {/* =========================
          ⏱️ TIMER FRAME
      ========================= */}

      <View
        pointerEvents="none"
        style={[
          styles.timerBorder,

          /*
           * IMPORTANT:
           *
           * Center the 224px frame
           * inside the full-width
           * absolute container.
           *
           * This removes the left/right
           * offset seen previously.
           */
          {
            left: "50%",
            marginLeft: -112,
          },
        ]}
      >

        <Svg
          width={224}
          height={150}
          viewBox="0 0 224 150"
          style={{
            position:
              "absolute",

            top: 0,
            left: 0,
          }}
        >

          <Defs>
  <LinearGradient
    id="timerGoldGradient"
    x1="0%"
    y1="0%"
    x2="100%"
    y2="100%"
  >
    <Stop
      offset="0%"
      stopColor="#7A4A00"
    />

    <Stop
      offset="25%"
      stopColor="#C88700"
    />

    <Stop
      offset="50%"
      stopColor="#FFD34E"
    />

    <Stop
      offset="75%"
      stopColor="#D99A00"
    />

    <Stop
      offset="100%"
      stopColor="#6B3F00"
    />
  </LinearGradient>
</Defs>

          {/* STATIC TRACK */}

          <Rect
            x={2}
            y={2}
            width={220}
            height={146}
            rx={23}
            ry={23}
            fill="none"
            stroke="rgba(242,169,0,0.10)"
            strokeWidth={2}
          />


          {/* =========================
              🔥 LIVE TIMER PERIMETER
          ========================= */}
<AnimatedRect
  x={2}
  y={2}
  width={220}
  height={146}
  rx={23}
  ry={23}
  fill="none"

  stroke="url(#timerGoldGradient)"

  strokeWidth={2.2}

  strokeLinecap="round"

  strokeDasharray="720 720"

  animatedProps={
    animatedBorderProps
  }
/>

        </Svg>

      </View>


      {/* =========================
          🎴 CARD
      ========================= */}

   <View
  style={styles.card}
>
  {/* =========================
      🌌 AMBIENT DARK GRADIENT
  ========================= */}

  <View
    pointerEvents="none"
    style={styles.ambientGlow}
  >
    <Svg
      width={224}
      height={150}
      viewBox="0 0 224 150"
    >
      <Defs>

        <RadialGradient
          id="glowBlue"
          cx="50%"
          cy="50%"
          r="50%"
        >
        <Stop
  offset="0%"
  stopColor="#31558F"
  stopOpacity={0.90}
/>
          <Stop
            offset="55%"
            stopColor="#17243D"
            stopOpacity={0.20}
          />
          <Stop
            offset="100%"
            stopColor="#050507"
            stopOpacity={0}
          />
        </RadialGradient>

        <RadialGradient
          id="glowGold"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="#8A6418"
            stopOpacity={0.45}
          />
          <Stop
            offset="55%"
            stopColor="#4A350E"
            stopOpacity={0.14}
          />
          <Stop
            offset="100%"
            stopColor="#050507"
            stopOpacity={0}
          />
        </RadialGradient>

        <RadialGradient
          id="glowPurple"
          cx="50%"
          cy="50%"
          r="50%"
        >
        <Stop
  offset="0%"
  stopColor="#604681"
  stopOpacity={0.70}
/>
          <Stop
            offset="60%"
            stopColor="#211832"
            stopOpacity={0.12}
          />
          <Stop
            offset="100%"
            stopColor="#050507"
            stopOpacity={0}
          />
        </RadialGradient>

      </Defs>

      <AnimatedCircle
        cx={45}
        cy={45}
        r={90}
        fill="url(#glowBlue)"
        animatedProps={glow1Props}
      />

      <AnimatedCircle
        cx={175}
        cy={105}
      r={88}
        fill="url(#glowGold)"
        animatedProps={glow2Props}
      />

      <AnimatedCircle
        cx={110}
        cy={150}
      r={82}
        fill="url(#glowPurple)"
        animatedProps={glow3Props}
      />
    </Svg>
  </View>

        {/* =========================
            PLAYER NUMBER
        ========================= */}

        {speakerNumber !==
          undefined && (
          <View
            style={
              styles.playerNumber
            }
          >
            <Text
              style={
                styles.playerNumberText
              }
            >
              {speakerNumber}
            </Text>
          </View>
        )}


        {/* =========================
            HEADER
        ========================= */}

        <View
          style={styles.header}
        >

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

          <Text
            style={
              styles.headerText
            }
          >
          {isTieBreak
  ? "TIE-BREAK"
  : isMyTurn
    ? "YOUR TURN"
    : "SPEAKING"}
          </Text>

        </View>


        {/* =========================
            PLAYER
        ========================= */}

        <View
          style={
            styles.playerRow
          }
        >

          <View
            style={
              styles.avatarWrapper
            }
          >

            {speakerAvatar ? (

              <Image
                source={{
                  uri:
                    speakerAvatar,
                }}
                contentFit="cover"
                style={
                  styles.avatar
                }
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


          <View
            style={
              styles.playerInfo
            }
          >

            <Text
              numberOfLines={1}
              style={
                styles.speakerName
              }
            >
              {displayName}
            </Text>


            {isMyTurn && (
              <Text
                style={
                  styles.subtitle
                }
              >
                Speak now
              </Text>
            )}

          </View>

        </View>


        {/* =========================
            TIMER + VOICE
        ========================= */}

        <View
          style={
            styles.bottomRow
          }
        >

          <View
            style={
              styles.timerRow
            }
          >
<Reanimated.Text
  style={[
    styles.timer,
    timerTextStyle,
  ]}
>
  {remaining ?? 0}
</Reanimated.Text>

            <Text
              style={
                styles.seconds
              }
            >
              SEC
            </Text>

          </View>


          {/* =========================
              🎤 SMOOTH VOICE WAVE
          ========================= */}

          <View
            style={
              styles.waveBox
            }
          >

            <Reanimated.View
              style={[
                styles.waveBar,
                waveStyle1,
              ]}
            />

            <Reanimated.View
              style={[
                styles.waveBar,
                waveStyle2,
              ]}
            />

            <Reanimated.View
              style={[
                styles.waveBar,
                waveStyle3,
              ]}
            />

            <Reanimated.View
              style={[
                styles.waveBar,
                waveStyle4,
              ]}
            />

            <Reanimated.View
              style={[
                styles.waveBar,
                waveStyle5,
              ]}
            />

          </View>

        </View>

      </View>


      {/* =========================
          ⏭️ SKIP TURN
      ========================= */}

{isMyTurn && (
  <View
    style={{
      transform: [
        {
          translateY: 8,
        },
      ],
    }}
  >
    <SpeakingTurnSkipButton
      visible={true}
      onPress={onSkipTurn}
    />
  </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 132,

    left: 0,
    right: 0,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 900,
    elevation: 900,
  },


timerBorder: {
  position: "absolute",

  top: 0,
  left: "50%",

  width: 224,
  height: 150,

  marginLeft: -112,

  zIndex: 30,

  borderRadius: 25,

  overflow: "hidden",

  pointerEvents: "none",
},


ambientGlow: {
  position: "absolute",

  top: 0,
  left: 0,

  width: 224,
  height: 150,

  opacity: 1,

  zIndex: 0,
},

card: {
  width: 224,

  height: 150,

  overflow: "hidden",

  paddingHorizontal: 15,
  paddingTop: 12,
  paddingBottom: 10,

  borderRadius: 25,

  backgroundColor:
    "rgba(5,5,7,0.94)",

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.13)",

  zIndex: 1,

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
      "#e7bc3bad",

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

  fontSize: 18,

  lineHeight: 29,

  fontWeight: "900",

  letterSpacing: -0.5,
},

seconds: {
  color:
    "rgba(255,255,255,0.32)",

  fontSize: 5,

  fontWeight: "700",

  letterSpacing: 0.4,

  marginLeft: 4,
},

  /* =========================
     COMPACT WAVE
  ========================= */

waveBox: {
  width: 40,
  height: 28,

  borderRadius: 15,

  backgroundColor:
    "rgba(255,255,255,0.045)",

  justifyContent: "center",
  alignItems: "center",

  flexDirection: "row",

  gap: 2,

  marginRight: 2,
  marginBottom: 8,

  paddingHorizontal: 8,

  overflow: "hidden",
},


waveBar: {
  width: 2,

  height: 10,

  borderRadius: 2,

  backgroundColor:
    "#D99A00",

  transformOrigin:
    "center",
},
});