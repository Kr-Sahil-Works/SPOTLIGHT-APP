import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
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
import { SafeAreaView } from "react-native-safe-area-context";

import heroBg from "@/assets/images/games/spy/backgrounds/hero_bg.webp";
import masterSpy from "@/assets/images/games/spy/cards/master_spy.webp";
import whoIsSpy from "@/assets/images/games/spy/cards/who_is_spy.webp";
import wordlessSpy from "@/assets/images/games/spy/cards/wordless_spy.webp";
import y2Spy from "@/assets/images/games/spy/cards/y2spy.webp";


import exitIcon from "@/assets/images/games/spy/icons/exit.webp";
import notesIcon from "@/assets/images/games/spy/icons/notes.webp";
import JoinRoomModal from "@/shared/components/ui/JoinRoomModal";
import { Ionicons } from "@expo/vector-icons";

export default function SpyHomeScreen() {

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
  transform: [{ scale: createScale.value }],
}));

const joinButtonAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: joinScale.value }],
}));


const createPressIn = () => {
  createScale.value = withTiming(0.97, {
    duration: 80,
  });
};

const createPressOut = () => {
  createScale.value = withTiming(1, {
    duration: 140,
  });
};

const joinPressIn = () => {
  joinScale.value = withTiming(0.97, {
    duration: 80,
  });
};

const joinPressOut = () => {
  joinScale.value = withTiming(1, {
    duration: 140,
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
      withTiming(0.4, {
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
  edges={["left", "right", "bottom"]}
>
     <View style = {styles.content}>
        {/* Header */}

        <Animated.View
          entering={FadeInUp.duration(350)}
          style={styles.header}
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
  onPress={() => router.push("/games/spy/how-to-play")}
>
  <Image
    source={notesIcon}
    style={styles.notesIcon}
    contentFit="contain"
  />
</Pressable>
        </Animated.View>

        {/* Hero */}

 <View style={styles.heroSection}>
  <Animated.View
    pointerEvents="none"
    style={[styles.heroContainer, heroAnimatedStyle]}
  >
    <Image
      source={heroBg}
      style={styles.hero}
      contentFit="cover"
    />
  </Animated.View>

  <View style={styles.modeHeader}>
    <Animated.Text style={styles.modeTitle}>
      SELECT MODE
    </Animated.Text>

    <View style={styles.playerInfo}>
      <Text style={styles.playerIcon}>🕵️</Text>

      <Text style={styles.playerText}>
        4–8 Players
      </Text>
    </View>
  </View>
</View>
  
        {/* Cards */}

<Animated.ScrollView
  horizontal
  style={{
  flexGrow: 0,
  height: 200,
}}
  showsHorizontalScrollIndicator={false}
  decelerationRate="fast"
  snapToInterval={170}
  disableIntervalMomentum={false}
  bounces
  overScrollMode="always"
contentContainerStyle={[
  styles.cards,
  {
    paddingRight: 14, 
  },
]}
>
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
      onPress={() => animateSelection("spy")}
    >
     <View>

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
</View>
    </Pressable>
  </Animated.View>

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
     onPress={() => animateSelection("wordless")}
    >
    <View>
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
</View>
    </Pressable>
  </Animated.View>

  {/* MASTER SPY */}

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
    onPress={() => animateSelection("wordless")}
  >
    <View>
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
    </View>
  </Pressable>
</Animated.View>

{/* Y2 SPY */}

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
  onPress={() => animateSelection("y2")}
  >
    <View>
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
    </View>
  </Pressable>
</Animated.View>
</Animated.ScrollView>
<View style={styles.buttons}>
 <Animated.View
  style={[
    createButtonAnimatedStyle,
    { width: "80%" },
  ]}
>
    <Pressable
      disabled={!selectedMode}
      onPressIn={createPressIn}
      onPressOut={createPressOut}
      style={[
        styles.button,
        styles.createButton,
        !selectedMode && {
          opacity: 0.45,
        },
      ]}
      android_ripple={{ color: "#D99100" }}
      onPress={() => {
        if (!selectedMode) return;

        router.push("/games/spy/create");
      }}
    >
      <View style={styles.buttonContent}>
        <View style={styles.buttonIconBox}>
          <Ionicons
            name="add"
            size={20}
            color="#F2A900"
          />
        </View>

        <Animated.Text style={styles.createText}>
          CREATE ROOM
        </Animated.Text>
      </View>
    </Pressable>
  </Animated.View>

<Animated.View
  style={[
    joinButtonAnimatedStyle,
    { width: "80%" },
  ]}
>
    <Pressable
      onPressIn={joinPressIn}
      onPressOut={joinPressOut}
      style={[styles.button, styles.joinButton]}
      android_ripple={{ color: "#303030" }}
      onPress={() => {
        setJoinVisible(true);
      }}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name="search"
          size={22}
          color="#F5F5F5"
        />

        <Animated.Text style={styles.joinText}>
          JOIN ROOM
        </Animated.Text>
      </View>
    </Pressable>
  </Animated.View>
</View>

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


header: {
  zIndex: 100,
elevation: 100,
  height: 60,
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

heroContainer: {
  width: "100%",
  height: 250,          // was 420

  justifyContent: "center",
  alignItems: "center",
},

hero: {
  width: "100%",
  height: 400,          // was 500
  marginTop: -50,       // was -65
},
cards: {
  marginTop: -6,
  marginBottom: -30,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

 card:{
    width:160,
    marginRight:14,
},

  cardImage: {
    width: "100%",
    aspectRatio: 1,
  },

  heroSection: {
  marginBottom: -40, // adjust until it sits exactly in the empty space
},

modeHeader: {
  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",

  paddingHorizontal: 2,

  marginTop: 26,
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
  color: "#7A7A7A",

  fontSize: 11,

  fontWeight: "600",
},

buttonContent: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  width: "100%",
},

buttons: {
  marginTop: -6,
  alignItems: "center",
  gap: 10,

  width: "100%",
},

button: {
  width: "96%",
  height: 50,

  borderRadius: 16,

  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",

  overflow: "hidden",

  alignSelf: "center",
},

createButton: {
  backgroundColor: "#F2A900",

  borderWidth: 1.5,
  borderColor: "#F7C553",

  shadowColor: "#F2A900",
  shadowOpacity: 0.18,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 6,
  },

  elevation: 8,
},


joinButton: {
  backgroundColor: "#171717",

  borderWidth: 1.2,
  borderColor: "#3A3A3A",

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 6,
},

buttonIconBox: {
  width: 22,
  height: 22,

  marginRight: 8,

  borderRadius: 7,

  backgroundColor: "#111",

  justifyContent: "center",
  alignItems: "center",
},

createText: {
  color: "#111",
  fontSize: 13,
  fontWeight: "900",
  letterSpacing: 1,
},

joinText: {
  color: "#F4F4F4",
  fontSize: 13,
  fontWeight: "900",
  letterSpacing: 1,
  marginLeft: 8,
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
});