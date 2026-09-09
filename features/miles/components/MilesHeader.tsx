import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type Props = {
  coins?: number;
  diamonds?: number;

  onProfilePress?: () => void;
  onCoinsPress?: () => void;
  onDiamondsPress?: () => void;
};

function PremiumButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.97, {
            duration: 90,
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 90,
          });
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function MilesHeader({
  coins = 2450,
  diamonds = 35,

  onCoinsPress,
  onDiamondsPress,
  onProfilePress,
}: Props) {
  const currentUser = useQuery(
    api.users.index.getCurrentUser
  );

  const pfpRipple = useSharedValue(0);

  React.useEffect(() => {
    pfpRipple.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 3000,
        }),
        withTiming(0, {
          duration: 3000,
        })
      ),
      2,
      false
    );
  }, []);

  const pfpRippleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + pfpRipple.value * 0.28,
      },
    ],
    opacity: 0.32 - pfpRipple.value * 0.24,
  }));

  return (
    <View style={styles.container}>
      {/* LEFT */}

   <PremiumButton onPress={onProfilePress}>
  <View style={styles.avatarWrapper}>
      <Animated.View
      pointerEvents="none"
      style={[
        styles.pfpRippleOuter,
        pfpRippleStyle,
      ]}
    />

    <Animated.View
      pointerEvents="none"
      style={[
        styles.pfpRippleMiddle,
        pfpRippleStyle,
      ]}
    />

    <Image
           source={
  currentUser?.image
    ? { uri: currentUser.image }
    : require("@/assets/images/icons/iconbg.webp")
}
            style={styles.avatar}
          />

        </View>
      </PremiumButton>

      {/* RIGHT */}

      <View style={styles.right}>
      {/* COINS */}

<PremiumButton onPress={onCoinsPress}>
  <View style={styles.currencyBar}>
    <View style={styles.currencyItem}>
      <Image
        source={require("@/assets/images/miles/coin.png")}
        style={styles.currencyIcon}
      />

      <Text style={styles.currencyText}>
        {coins.toLocaleString()}
      </Text>

      <View style={styles.plusCircle}>
        <Text style={styles.plus}>+</Text>
      </View>
    </View>
  </View>
</PremiumButton>

{/* DIAMONDS */}

<PremiumButton onPress={onDiamondsPress}>
  <View style={[styles.currencyBar, styles.diamondBar]}>
    <View style={styles.currencyItem}>
      <Image
        source={require("@/assets/images/miles/diamond.png")}
        style={styles.currencyIcon}
      />

      <Text style={styles.currencyText}>
        {diamonds}
      </Text>

      <View style={styles.plusCircle}>
        <Text style={styles.plus}>+</Text>
      </View>
    </View>
  </View>
</PremiumButton>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "transparent",
  },

  /* ---------- Avatar ---------- */

avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 13,

    backgroundColor: "#080706",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.2,
    borderColor: "#B87900",

    shadowColor: "#D99A00",
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 6,
  },

  pfpRippleOuter: {
    position: "absolute",

    width: 58,
    height: 58,

    borderRadius: 19,

    borderWidth: 1.2,

    borderColor: "rgba(0,0,0,0.72)",

    backgroundColor: "transparent",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 3,
  },

  pfpRippleMiddle: {
    position: "absolute",

    width: 52,
    height: 52,

    borderRadius: 17,

    borderWidth: 1,

    borderColor: "rgba(18,18,18,0.62)",

    backgroundColor: "transparent",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 2,
  },



avatar: {
    width: 42,
    height: 42,
    borderRadius: 11,

    borderWidth: 0,

    backgroundColor: "#222",
  },

  /* ---------- Right ---------- */

right: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",

    marginLeft: 14,

    marginTop: 4,
},

  /* ---------- Currency Pill ---------- */

 currencyBar: {
    height: 21,

    minWidth: 84,

    borderRadius: 6,

    backgroundColor: "rgba(5,5,7,0.88)",

    borderWidth: 0.8,

    borderColor: "rgba(255,255,255,0.08)",

    justifyContent: "center",

    paddingHorizontal: 0,

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  diamondBar: {
    minWidth: 66,

    marginLeft: 16,
  },

currencyItem: {
    height: 17,

    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 5,

    backgroundColor: "rgba(15,15,18,0.72)",

    paddingLeft: 5,
    paddingRight: 2,
  },

currencyIcon: {
    width: 21,
    height: 21,

    resizeMode: "contain",

    marginRight: 3,

    marginLeft: -9,

    zIndex: 5,
  },

currencyText: {
    minWidth: 36,

    fontSize: 10,

    fontWeight: "900",

    color: "#F1E5C8",

    textAlign: "center",

    includeFontPadding: false,
  },

plusCircle: {
  width: 17,
  height: 17,

  borderRadius: 5,

  backgroundColor: "#7FBF45",

  borderWidth: 1,

  borderColor: "#314C1A",

  justifyContent: "center",
  alignItems: "center",

  marginLeft: 2,

  padding: 0,

  shadowColor: "#7FBF45",
  shadowOpacity: 0.18,
  shadowRadius: 3,

  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 2,
},

plus: {
  color: "#F4FFD9",

  fontSize: 13,

  fontWeight: "900",

  includeFontPadding: false,

  textAlign: "center",
  textAlignVertical: "center",

  lineHeight: 15,

  marginTop: 0,
},
});
