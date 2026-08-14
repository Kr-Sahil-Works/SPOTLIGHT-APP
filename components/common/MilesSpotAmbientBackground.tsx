import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from "react-native";

import Svg, {
    Defs,
    Path,
    Stop,
    LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

type Props = {
  opacity?: number;
};

export default function MilesSpotAmbientBackground({
  opacity = 0.68,
}: Props) {
  /* =========================
     ANIMATION VALUES
  ========================= */

  const topAnim = useRef(
    new Animated.Value(0)
  ).current;

  const bottomAnim = useRef(
    new Animated.Value(0)
  ).current;

  const waveAnim = useRef(
    new Animated.Value(0)
  ).current;

  const glowAnim = useRef(
    new Animated.Value(0)
  ).current;

  const centerScaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  /* =========================
     START ANIMATIONS
  ========================= */

  useEffect(() => {
    /* TOP SHAPE */
    const topLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(topAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),

        Animated.timing(topAnim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    );

    /* BOTTOM SHAPE */
    const bottomLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bottomAnim, {
          toValue: 1,
          duration: 13000,
          useNativeDriver: true,
        }),

        Animated.timing(bottomAnim, {
          toValue: 0,
          duration: 13000,
          useNativeDriver: true,
        }),
      ])
    );

    /* VERY SLOW WAVE MOVEMENT */
    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 16000,
          useNativeDriver: true,
        }),

        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 16000,
          useNativeDriver: true,
        }),
      ])
    );

    /* CENTER GLOW */
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),

        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    );

    /* CENTER BREATHING */
    const centerScaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(centerScaleAnim, {
          toValue: 1.055,
          duration: 7000,
          useNativeDriver: true,
        }),

        Animated.timing(centerScaleAnim, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    topLoop.start();
    bottomLoop.start();
    waveLoop.start();
    glowLoop.start();
    centerScaleLoop.start();

    return () => {
      topLoop.stop();
      bottomLoop.stop();
      waveLoop.stop();
      glowLoop.stop();
      centerScaleLoop.stop();
    };
  }, []);

  /* =========================
     SHAPE MOVEMENT
  ========================= */

  const topTranslateX =
    topAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 26],
    });

  const topTranslateY =
    topAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 16],
    });

  const bottomTranslateX =
    bottomAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -24],
    });

  const bottomTranslateY =
    bottomAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });

  /* =========================
     WAVE MOVEMENT
  ========================= */

  const waveTranslateX =
    waveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-18, 18],
    });

  const waveTranslateY =
    waveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [3, -3],
    });

  /* =========================
     GLOW PULSE
  ========================= */

  const glowOpacity =
    glowAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.30, 0.52, 0.30],
    });

  /* =========================
     FOUR LARGE CURVED WAVES
     
     Direction:
     TOP-LEFT → BOTTOM-RIGHT

     Large spacing.
     No extra vertical curves.
     No middle clutter.
  ========================= */

  const wave1 = `
    M ${-width * 0.16} ${-height * 0.10}

    C ${width * 0.05} ${height * 0.04},
      ${width * 0.18} ${height * 0.02},
      ${width * 0.40} ${height * 0.20}

    C ${width * 0.64} ${height * 0.40},
      ${width * 0.92} ${height * 0.42},
      ${width * 1.42} ${height * 0.72}
  `;

  const wave2 = `
    M ${-width * 0.28} ${height * 0.05}

    C ${width * 0.00} ${height * 0.20},
      ${width * 0.18} ${height * 0.18},
      ${width * 0.42} ${height * 0.38}

    C ${width * 0.66} ${height * 0.58},
      ${width * 0.94} ${height * 0.60},
      ${width * 1.46} ${height * 0.90}
  `;

  const wave3 = `
    M ${-width * 0.34} ${height * 0.22}

    C ${width * 0.00} ${height * 0.38},
      ${width * 0.18} ${height * 0.36},
      ${width * 0.44} ${height * 0.56}

    C ${width * 0.68} ${height * 0.76},
      ${width * 0.96} ${height * 0.78},
      ${width * 1.50} ${height * 1.08}
  `;

  const wave4 = `
    M ${-width * 0.38} ${height * 0.40}

    C ${width * 0.00} ${height * 0.56},
      ${width * 0.20} ${height * 0.54},
      ${width * 0.46} ${height * 0.74}

    C ${width * 0.70} ${height * 0.94},
      ${width * 0.98} ${height * 0.96},
      ${width * 1.52} ${height * 1.26}
  `;

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { opacity },
      ]}
    >
      {/* =========================
          DEEP BLACK BASE
      ========================= */}

      <View style={styles.base} />

      {/* =========================
          TOP AMBIENT SHAPE
      ========================= */}

      <Animated.View
        style={[
          styles.topCircle,
          {
            transform: [
              {
                translateX: topTranslateX,
              },
              {
                translateY: topTranslateY,
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,190,0,0.18)",
            "rgba(255,180,0,0.065)",
            "rgba(0,0,0,0)",
          ]}
          start={{
            x: 0.25,
            y: 0,
          }}
          end={{
            x: 0.8,
            y: 1,
          }}
          style={styles.circleGradient}
        />
      </Animated.View>

      {/* =========================
          BOTTOM AMBIENT SHAPE
      ========================= */}

      <Animated.View
        style={[
          styles.bottomCircle,
          {
            transform: [
              {
                translateX: bottomTranslateX,
              },
              {
                translateY: bottomTranslateY,
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,190,0,0)",
            "rgba(255,180,0,0.07)",
            "rgba(255,185,0,0.17)",
          ]}
          start={{
            x: 0.2,
            y: 0,
          }}
          end={{
            x: 0.8,
            y: 1,
          }}
          style={styles.circleGradient}
        />
      </Animated.View>

      {/* =========================
          FOUR CINEMATIC WAVES
      ========================= */}

      <Animated.View
        style={[
          styles.waveLayer,
          {
            opacity: 0.9,

            transform: [
              {
                translateX: waveTranslateX,
              },
              {
                translateY: waveTranslateY,
              },
            ],
          },
        ]}
      >
        <Svg
          width={width * 2.1}
          height={height}
          viewBox={`0 0 ${width * 2.1} ${height}`}
          preserveAspectRatio="none"
          style={styles.waveSvg}
        >
          <Defs>
            <SvgLinearGradient
              id="ambientWaveGold"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <Stop
                offset="0"
                stopColor="#8B651E"
                stopOpacity="0"
              />

              <Stop
                offset="0.20"
                stopColor="#D5A83F"
                stopOpacity="0.12"
              />

              <Stop
                offset="0.50"
                stopColor="#F4C95D"
                stopOpacity="0.42"
              />

              <Stop
                offset="0.80"
                stopColor="#D5A83F"
                stopOpacity="0.12"
              />

              <Stop
                offset="1"
                stopColor="#8B651E"
                stopOpacity="0"
              />
            </SvgLinearGradient>
          </Defs>

          {/* =========================
              WAVE 1
              MOST VISIBLE
          ========================= */}

          <Path
            d={wave1}
            fill="none"
            stroke="url(#ambientWaveGold)"
            strokeWidth={1.7}
            opacity={0.78}
          />

          {/* =========================
              WAVE 2
          ========================= */}

          <Path
            d={wave2}
            fill="none"
            stroke="url(#ambientWaveGold)"
            strokeWidth={1.5}
            opacity={0.56}
          />

          {/* =========================
              WAVE 3
          ========================= */}

          <Path
            d={wave3}
            fill="none"
            stroke="url(#ambientWaveGold)"
            strokeWidth={1.35}
            opacity={0.40}
          />

          {/* =========================
              WAVE 4
              MOST SUBTLE
          ========================= */}

          <Path
            d={wave4}
            fill="none"
            stroke="url(#ambientWaveGold)"
            strokeWidth={1.2}
            opacity={0.27}
          />
        </Svg>
      </Animated.View>

      {/* =========================
          CENTER BREATHING GLOW
      ========================= */}

      <Animated.View
        style={[
          styles.centerGlow,
          {
            opacity: glowOpacity,

            transform: [
              {
                scale: centerScaleAnim,
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,190,0,0.055)",
            "rgba(255,190,0,0)",
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",

    backgroundColor: "#050504",

    zIndex: 0,
  },

  base: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#050504",
  },

  /* =========================
     TOP CIRCLE
  ========================= */

  topCircle: {
    position: "absolute",

    width: width * 1.35,
    height: width * 1.35,

    top: -width * 0.72,
    right: -width * 0.48,

    borderRadius: width,

    overflow: "hidden",
  },

  /* =========================
     BOTTOM CIRCLE
  ========================= */

  bottomCircle: {
    position: "absolute",

    width: width * 1.4,
    height: width * 1.4,

    bottom: -width * 0.75,
    left: -width * 0.48,

    borderRadius: width,

    overflow: "hidden",
  },

  circleGradient: {
    flex: 1,
  },

  /* =========================
     WAVE LAYER
  ========================= */

  waveLayer: {
    position: "absolute",

    width: width * 2.1,
    height,

    left: -width * 0.45,
    top: 0,

    justifyContent: "center",
    alignItems: "center",
  },

  waveSvg: {
    position: "absolute",
  },

  /* =========================
     CENTER GLOW
  ========================= */

  centerGlow: {
    position: "absolute",

    width: width * 0.7,
    height: width * 0.7,

    left: width * 0.15,
    top: height * 0.34,

    borderRadius: width,

    overflow: "hidden",
  },
});