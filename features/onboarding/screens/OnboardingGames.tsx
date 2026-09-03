import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Image } from "expo-image";

import OnboardingLayout from "../components/OnboardingLayout";

import spyImage from "@/assets/images/loginpage/spyboarding.webp";

type Props = {
  onNext: () => void;
  onPrevious: () => void;
};

const GAMES = [
  "Who's The Spy?",
  "Blind Cards",
  "Puzzles",
];

export default function OnboardingGames({
  onNext,
  onPrevious,
}: Props) {
  const { height } = useWindowDimensions();

  /*
   * Keep the hero image around 60% of the screen.
   *
   * This automatically adapts to different phones.
   */
  const imageHeight = height * 0.60;

  const imageOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const imageScale = useRef(
    new Animated.Value(1.04)
  ).current;

  const contentOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const contentTranslate = useRef(
    new Animated.Value(12)
  ).current;

  const gameAnimations = useRef(
    GAMES.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(-10),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      /* Image fade */
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      /* Image settles */
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),

      /* Content */
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 650,
        delay: 250,
        useNativeDriver: true,
      }),

      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 650,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    /* Games appear one by one */
    Animated.stagger(
      100,
      gameAnimations.map((animation) =>
        Animated.parallel([
          Animated.timing(animation.opacity, {
            toValue: 1,
            duration: 400,
            delay: 450,
            useNativeDriver: true,
          }),

          Animated.timing(animation.translateX, {
            toValue: 0,
            duration: 400,
            delay: 450,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  return (
    <OnboardingLayout
      current={2}
      total={3}
      onNext={onNext}
      onPrevious={onPrevious}
      buttonText="Let's go"

      /*
       * Games onboarding stays clean.
       * No MilesSpot ambient circles/waves.
       */
      showAmbientBackground={false}
    >
      <View style={styles.container}>

        {/* =================================================
            HERO IMAGE
        ================================================= */}

        <Animated.View
          style={[
            styles.imageContainer,
            {
              height: imageHeight,

              opacity: imageOpacity,

              transform: [
                {
                  scale: imageScale,
                },
              ],
            },
          ]}
        >
          <Image
            source={spyImage}

            /*
             * IMPORTANT:
             *
             * "contain" shows as much of the original
             * Spy artwork as possible instead of cropping it.
             */
    contentFit="contain"

            style={styles.image}
          />

          {/* Subtle gold tint */}
          <View style={styles.goldTint} />

          {/* Soft bottom fade */}
          <View style={styles.bottomFade} />
        </Animated.View>

        {/* =================================================
            CONTENT
        ================================================= */}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,

              transform: [
                {
                  translateY: contentTranslate,
                },
              ],
            },
          ]}
        >
          <Text style={styles.eyebrow}>
            PLAY TOGETHER
          </Text>

          <Text style={styles.title}>
            Play social games{"\n"}
            with your friends{"\n"}
            & family
          </Text>

          <View style={styles.games}>
            {GAMES.map((game, index) => {
              const animation =
                gameAnimations[index];

              return (
                <Animated.View
                  key={game}
                  style={[
                    styles.gameItem,
                    {
                      opacity:
                        animation.opacity,

                      transform: [
                        {
                          translateX:
                            animation.translateX,
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.dot} />

                  <Text style={styles.gameText}>
                    {game}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  /* =========================================================
     SCREEN
  ========================================================= */

  container: {
    flex: 1,

    backgroundColor: "#030303",

    overflow: "hidden",
  },

  /* =========================================================
     HERO IMAGE
  ========================================================= */

  imageContainer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    /*
     * Actual height is supplied dynamically:
     *
     * height * 0.60
     */
    overflow: "hidden",

    alignItems: "center",

    justifyContent: "flex-start",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  /* =========================================================
     GOLD TINT
  ========================================================= */

  goldTint: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#B88A24",

    opacity: 0.075,
  },

  /* =========================================================
     BOTTOM IMAGE FADE
  ========================================================= */

  bottomFade: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: "30%",

    backgroundColor: "rgba(3,3,3,0.45)",

    opacity: 0.55,
  },

  /* =========================================================
     CONTENT
  ========================================================= */

  content: {
    position: "absolute",

    left: 0,
    right: 0,

    bottom: 42,

    alignItems: "center",

    paddingHorizontal: 24,
  },

  /* =========================================================
     EYEBROW
  ========================================================= */

  eyebrow: {
    color: "#C09A45",

    fontSize: 10,

    fontWeight: "700",

    letterSpacing: 3,

    marginBottom: 8,
  },

  /* =========================================================
     TITLE
  ========================================================= */

  title: {
    color: "#F5F2EA",

    fontSize: 23,

    lineHeight: 29,

    fontWeight: "800",

    textAlign: "center",

    letterSpacing: -0.4,

    width: "100%",
  },

  /* =========================================================
     GAMES
  ========================================================= */

  games: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 15,

    marginTop: 18,
  },

  gameItem: {
    flexDirection: "row",

    alignItems: "center",
  },

  dot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: "#D9A92E",

    marginRight: 6,
  },

  gameText: {
    color: "#9C9689",

    fontSize: 11,

    fontWeight: "600",
  },
});