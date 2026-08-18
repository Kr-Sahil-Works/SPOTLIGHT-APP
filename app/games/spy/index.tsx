import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import heroBg from "@/assets/images/games/spy/backgrounds/hero_bg.webp";
import createRoomButton from "@/assets/images/games/spy/buttons/create_room.png";
import joinRoomButton from "@/assets/images/games/spy/buttons/join_room.png";
import masterSpy from "@/assets/images/games/spy/cards/master_spy.webp";
import whoIsSpy from "@/assets/images/games/spy/cards/who_is_spy.webp";
import wordlessSpy from "@/assets/images/games/spy/cards/wordless_spy.webp";
import y2Spy from "@/assets/images/games/spy/cards/y2spy.webp";


import exitIcon from "@/assets/images/games/spy/icons/exit.webp";
import notesIcon from "@/assets/images/games/spy/icons/notes.webp";
import JoinRoomModal from "@/features/games/spy/components/JoinRoomModal";
import { Ionicons } from "@expo/vector-icons";

export default function SpyHomeScreen() {

  const insets = useSafeAreaInsets();

const [selectedMode, setSelectedMode] = useState<
  "spy" | "wordless" | "master" | "y2" | null
>(null);

const [joinVisible, setJoinVisible] =
  useState(false);

const spyScale = useSharedValue(0.96);
const wordlessScale = useSharedValue(0.96);
const masterScale = useSharedValue(0.96);
const y2Scale = useSharedValue(0.96);

const spyRotation = useSharedValue(0);
const wordlessRotation = useSharedValue(0);
const masterRotation = useSharedValue(0);
const y2Rotation = useSharedValue(0);

const createScale = useSharedValue(1);
const joinScale = useSharedValue(1);
const { width, height } = useWindowDimensions();
const [heroAnimating, setHeroAnimating] =
  useState(true);

const spyAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: spyScale.value },
    { rotate: `${spyRotation.value}deg` },
  ],

  shadowColor: "#F2B126",
  shadowOpacity:
    selectedMode === "spy" ? 0.42 : 0,

  shadowRadius:
    selectedMode === "spy" ? 18 : 0,

  elevation:
    selectedMode === "spy" ? 18 : 0,
}));

const wordlessAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: wordlessScale.value },
    { rotate: `${wordlessRotation.value}deg` },
  ],

  shadowColor: "#F2B126",
  shadowOpacity:
    selectedMode === "wordless" ? 0.42 : 0,

  shadowRadius:
    selectedMode === "wordless" ? 18 : 0,

  elevation:
    selectedMode === "wordless" ? 18 : 0,
}));


const masterAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: masterScale.value },
    { rotate: `${masterRotation.value}deg` },
  ],

  shadowColor: "#F2B126",

  shadowOpacity:
    selectedMode === "master" ? 0.42 : 0,

  shadowRadius:
    selectedMode === "master" ? 18 : 0,

  elevation:
    selectedMode === "master" ? 18 : 0,
}));

const y2AnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: y2Scale.value },
    { rotate: `${y2Rotation.value}deg` },
  ],

  shadowColor: "#F2B126",

  shadowOpacity:
    selectedMode === "y2" ? 0.42 : 0,

  shadowRadius:
    selectedMode === "y2" ? 18 : 0,

  elevation:
    selectedMode === "y2" ? 18 : 0,
}));

const animateSelection = (
  mode: "spy" | "wordless" | "master" | "y2"
) => {
  setSelectedMode(mode);
  stopHeroAnimation();

  const scales = {
    spy: spyScale,
    wordless: wordlessScale,
    master: masterScale,
    y2: y2Scale,
  };

  const rotations = {
    spy: spyRotation,
    wordless: wordlessRotation,
    master: masterRotation,
    y2: y2Rotation,
  };

  (Object.keys(scales) as Array<keyof typeof scales>).forEach(
    (key) => {
      if (key === mode) {
        scales[key].value = withSequence(
          withTiming(1.03, {
            duration: 120,
          }),
          withTiming(1, {
            duration: 180,
          })
        );

        rotations[key].value = withSequence(
          withTiming(
            key === "wordless" || key === "y2"
              ? 1
              : -1
          ),
          withTiming(0)
        );
      } else {
        scales[key].value = withTiming(0.94, {
          duration: 180,
        });
      }
    }
  );
};

const createButtonAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: createScale.value },
    {
      translateY:
        (1 - createScale.value) * 10,
    },
  ],
}));

const joinButtonAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: joinScale.value },
    {
      translateY:
        (1 - joinScale.value) * 10,
    },
  ],
}));

const createPressIn = () => {
  createScale.value = withTiming(0.965, {
    duration: 70,
  });
};

const createPressOut = () => {
  createScale.value = withTiming(1, {
    duration: 130,
  });
};

const joinPressIn = () => {
  joinScale.value = withTiming(0.965, {
    duration: 70,
  });
};

const joinPressOut = () => {
  joinScale.value = withTiming(1, {
    duration: 130,
  });
};


  const heroScale = useSharedValue(1);
  const heroOpacity = useSharedValue(1);


 const stopHeroAnimation = () => {
  setHeroAnimating(false);

  heroScale.value = withTiming(1, {
    duration: 4000,
  });

  heroOpacity.value = withTiming(1, {
    duration: 4000,
  });
};


useEffect(() => {
  if (!heroAnimating) return;

  heroScale.value = withRepeat(
    withSequence(
      withTiming(1.01, {
        duration: 4000,
      }),
      withTiming(1, {
        duration: 4000,
      })
    ),
    -1,
    false
  );

  heroOpacity.value = withRepeat(
    withSequence(
      withTiming(0.65, {
        duration: 4000,
      }),
      withTiming(1, {
        duration: 4000,
      })
    ),
    -1,
    false
  );
}, [heroAnimating]);

const heroAnimatedStyle =
  useAnimatedStyle(() => ({
    transform: [
      {
        scale: heroScale.value * 0.85,
      },
    ],

    opacity: heroOpacity.value,
  }));

  return (
<SafeAreaView
  style={styles.container}
  edges={["left", "right", "top"]}
>
 <View style={styles.content}>

  {/* =========================
      TOP 60% — HEADER + HERO
  ========================= */}

  <View style={styles.topSection}>

    {/* HEADER */}

    <Animated.View
      entering={FadeInUp.duration(350)}
      style={[
        styles.header,
        {
          paddingTop: 0,
        },
      ]}
    >
      <Pressable
        style={styles.iconButton}
        onPress={() => router.back()}
      >
        <Image
          source={exitIcon}
          style={styles.exitIcon}
          contentFit="contain"
        />
      </Pressable>

      <Pressable
        style={styles.iconButton}
        onPress={() =>
          router.push("/games/spy/how-to-play")
        }
      >
        <Image
          source={notesIcon}
          style={styles.notesIcon}
          contentFit="contain"
        />
      </Pressable>
    </Animated.View>

    {/* HERO */}

    <View style={styles.heroSection}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.heroContainer,
          heroAnimatedStyle,
        ]}
      >
        <Image
          source={heroBg}
          style={styles.hero}
          contentFit="contain"
                  contentPosition="top center"
        />
      </Animated.View>
    </View>

  </View>


  {/* =========================
      MIDDLE 30% — MODES + BUTTONS
  ========================= */}

  <View style={styles.middleSection}>

    {/* MODE HEADER */}

    <View style={styles.modeHeader}>
      <Animated.Text style={styles.modeTitle}>
        SELECT MODE
      </Animated.Text>

      <View style={styles.playerInfo}>
        <Text style={styles.playerIcon}>
          🕵️
        </Text>

        <Text style={styles.playerText}>
          4–8 Players
        </Text>
      </View>
    </View>


    {/* MODE CARDS */}

    <Animated.ScrollView
      horizontal
      style={styles.cardsScroll}
      contentContainerStyle={styles.cards}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={174}
      disableIntervalMomentum={false}
      bounces
      overScrollMode="always"
    >

      {/* KEEP YOUR EXISTING FOUR CARDS HERE */}

      {/* SPY */}

      <Animated.View
        style={[
          styles.card,
          spyAnimatedStyle,
          {
            overflow: "visible",
          },
        ]}
      >
        <Pressable
          android_ripple={{ color: "#222" }}
          onPress={() =>
            animateSelection("spy")
          }
        >
          <View style={styles.cardWrapper}>
            <Image
              source={whoIsSpy}
              style={[
                styles.cardImage,
                {
                  opacity:
                    selectedMode === null
                      ? 0.60
                      : selectedMode === "spy"
                      ? 1
                      : 0.38,
                },
              ]}
              contentFit="contain"
            />

            {selectedMode === "spy" && (
              <View style={styles.selectedBadge}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#000"
                />
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>


      {/* WORDLESS */}

      <Animated.View
        style={[
          styles.card,
          wordlessAnimatedStyle,
          {
            overflow: "visible",
          },
        ]}
      >
        <Pressable
          android_ripple={{ color: "#222" }}
          onPress={() =>
            animateSelection("wordless")
          }
        >
          <View style={styles.cardWrapper}>
            <Image
              source={wordlessSpy}
              style={[
                styles.cardImage,
                {
                  opacity:
                    selectedMode === null
                      ? 0.60
                      : selectedMode === "wordless"
                      ? 1
                      : 0.38,
                },
              ]}
              contentFit="contain"
            />

            {selectedMode === "wordless" && (
              <View style={styles.selectedBadge}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#111"
                />
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>


      {/* MASTER */}

      <Animated.View
        style={[
          styles.card,
          masterAnimatedStyle,
          {
            overflow: "visible",
          },
        ]}
      >
        <Pressable
          android_ripple={{ color: "#222" }}
          onPress={() =>
            animateSelection("master")
          }
        >
          <View style={styles.cardWrapper}>
            <Image
              source={masterSpy}
              style={[
                styles.cardImage,
                {
                  opacity:
                    selectedMode === null
                      ? 0.60
                      : selectedMode === "master"
                      ? 1
                      : 0.38,
                },
              ]}
              contentFit="contain"
            />

            {selectedMode === "master" && (
              <View style={styles.selectedBadge}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#111"
                />
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>


      {/* Y2 */}

      <Animated.View
        style={[
          styles.card,
          y2AnimatedStyle,
          {
            overflow: "visible",
          },
        ]}
      >
        <Pressable
          android_ripple={{ color: "#222" }}
          onPress={() =>
            animateSelection("y2")
          }
        >
          <View style={styles.cardWrapper}>
            <Image
              source={y2Spy}
              style={[
                styles.cardImage,
                {
                  opacity:
                    selectedMode === null
                      ? 0.60
                      : selectedMode === "y2"
                      ? 1
                      : 0.38,
                },
              ]}
              contentFit="contain"
            />

            {selectedMode === "y2" && (
              <View style={styles.selectedBadge}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#111"
                />
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>

    </Animated.ScrollView>


    {/* BUTTONS */}

    <View style={styles.buttons}>
{/* =========================
    CREATE ROOM
========================= */}

<Animated.View
  style={[
    createButtonAnimatedStyle,
    styles.buttonWidth,
  ]}
>
  <Pressable
    disabled={!selectedMode}
    onPressIn={createPressIn}
    onPressOut={createPressOut}
    style={styles.imageButton}
    android_ripple={{
      color: "#D99100",
    }}
    onPress={() => {
      if (!selectedMode) return;

      router.push({
        pathname: "/games/spy/create",
        params: {
          mode: selectedMode,
        },
      });
    }}
  >
   <View style={styles.buttonVisual}>
  <Image
    source={createRoomButton}
    style={styles.buttonImage}
    contentFit="contain"
  />

  {!selectedMode && (
    <View
      pointerEvents="none"
      style={styles.disabledOverlay}
    />
  )}
</View>
  </Pressable>
</Animated.View>


{/* =========================
    JOIN ROOM
========================= */}

<Animated.View
  style={[
    joinButtonAnimatedStyle,
    styles.buttonWidth,
  ]}
>
  <Pressable
    onPressIn={joinPressIn}
    onPressOut={joinPressOut}
    style={styles.imageButton}
    android_ripple={{
      color: "#333",
    }}
    onPress={() => {
      setJoinVisible(true);
    }}
  >
    <Image
      source={joinRoomButton}
      style={styles.buttonImage}
      contentFit="contain"
    />
  </Pressable>
</Animated.View>
   
    </View>

  </View>


  {/* =========================
      BOTTOM 10% — BREATHING SPACE
  ========================= */}
<View style={styles.bottomSpace} />

</View>

      <JoinRoomModal
  visible={joinVisible}
  onClose={() => setJoinVisible(false)}
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  /* =========================
     HERO — 50%
  ========================= */

  topSection: {
    height: "50%",
    minHeight: 0,
  },

  /*
   * Header sits ON TOP of the hero.
   */
  header: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: 54,

    zIndex: 100,
    elevation: 100,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor: "#151515",

    borderWidth: 1,
    borderColor: "#242424",

    justifyContent: "center",
    alignItems: "center",
  },

  exitIcon: {
    width: 20,
    height: 20,
  },

  notesIcon: {
    width: 25,
    height: 25,
  },

  /*
   * Hero starts at the VERY TOP.
   * No padding/margin above it.
   */
  heroSection: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "flex-start",
    alignItems: "center",

    overflow: "hidden",
  },

  heroContainer: {
    width: "100%",
    height: "100%",

    justifyContent: "flex-start",
    alignItems: "center",
  },

  hero: {
    width: "100%",
    height: "100%",
  },


  /* =========================
     MODE SECTION — 18%
  ========================= */

  middleSection: {
    height: "40%",
    minHeight: 0,
  },

  modeHeader: {
    height: 20,

    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 2,
    paddingBottom: 0,
  },

  modeTitle: {
    color: "#F2A900",

    fontSize: 13,

    fontWeight: "900",

    letterSpacing: 1.3,
  },

  playerInfo: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 1,
  },

  playerIcon: {
    fontSize: 11,

    marginRight: 5,
  },

  playerText: {
    color: "#7e7a68",

    fontSize: 11,

    fontWeight: "600",
  },

  /* =========================
     MODE CARDS
  ========================= */

  cardsScroll: {
    flexGrow: 0,

    height: 155,
  },

  cards: {
    flexDirection: "row",

    alignItems: "center",

    paddingRight: 14,
  },

  card: {
    width: 145,

    marginRight: 12,
  },

  cardImage: {
    width: "100%",

    aspectRatio: 1,
  },

  cardWrapper: {
    position: "relative",
  },

  selectedBadge: {
    position: "absolute",

    top: 24,
    right: 8,

    width: 22,
    height: 22,

    borderRadius: 17,

    backgroundColor: "#F4B223",

    borderWidth: 3,
    borderColor: "#111",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 999,
    elevation: 20,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

   /* =========================
     BUTTON AREA
  ========================= */


buttons: {
  flex: 1,
  minHeight: 0,

  width: "100%",

  alignItems: "center",
  justifyContent: "center",

  paddingTop: 2,
},

bottomSpace: {
  height: "10%",
  minHeight: 0,
},

buttonWidth: {
  width: "74%",
  alignSelf: "center",
},

imageButton: {
  width: "100%",
  alignSelf: "center",
},
buttonVisual: {
  width: "100%",
  position: "relative",
},

disabledOverlay: {
  ...StyleSheet.absoluteFillObject,

  backgroundColor: "rgba(0, 0, 0, 0.48)",

  borderRadius: 18,
},

buttonImage: {
  width: "100%",
  aspectRatio: 2172 / 724,
},
});