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

  return (
    <View style={styles.container}>
      {/* LEFT */}

      <PremiumButton onPress={onProfilePress}>
        <View style={styles.avatarWrapper}>
          <Image
           source={
  currentUser?.image
    ? { uri: currentUser.image }
    : require("@/assets/images/miles/man.png")
}
            style={styles.avatar}
          />

          <View style={styles.onlineDot} />
        </View>
      </PremiumButton>

      {/* RIGHT */}

      <View style={styles.right}>
        {/* COINS */}

        <PremiumButton onPress={onCoinsPress}>
          <View style={styles.pill}>
            <Image
              source={require("@/assets/images/miles/coin.png")}
              style={styles.currencyIcon}
            />

            <Text style={styles.currencyText}>
              {coins.toLocaleString()}
            </Text>

            <View style={styles.plusCircle}>
              <Text style={styles.plus}>
                +
              </Text>
            </View>
          </View>
        </PremiumButton>

        {/* DIAMONDS */}

        <PremiumButton onPress={onDiamondsPress}>
          <View style={[styles.pill, { marginLeft: 10 }]}>
            <Image
              source={require("@/assets/images/miles/diamond.png")}
              style={styles.currencyIcon}
            />

            <Text style={styles.currencyText}>
              {diamonds}
            </Text>

            <View style={styles.plusCircle}>
              <Text style={styles.plus}>
                +
              </Text>
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
    borderRadius: 28,

    backgroundColor: "#e8ae0d",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#F5C542",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,

    borderWidth: 2,
    borderColor: "#FFF",

    backgroundColor: "#222",
  },

  onlineDot: {
    position: "absolute",

    right: 1,
    bottom: 1,

    width: 14,
    height: 14,
    borderRadius: 7,

    backgroundColor: "#28D146",

    borderWidth: 2,
    borderColor: "#000",
  },

  /* ---------- Right ---------- */

right: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",

    marginLeft: 14,
},

  /* ---------- Currency Pill ---------- */

  pill: {
    flexDirection: "row",
    alignItems: "center",

    height: 30,

    paddingLeft: 6,
    paddingRight: 4,

    borderRadius: 15,

    backgroundColor: "#171616d1",

    marginLeft: 8,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  currencyIcon: {
    width: 16,
    height: 16,

    resizeMode: "contain",

    marginRight: 6,
  },

  currencyText: {
    minWidth: 42,

    fontSize: 13,
    fontWeight: "800",

    color: "#e9dcdc",

    textAlign: "center",
  },

plusCircle: {
  width: 18,
  height: 18,

  borderRadius: 9,

  backgroundColor: "#FF8B2C",

  justifyContent: "center",
  alignItems: "center",

  marginLeft: 4,
},

plus: {
  color: "#FFF",

  fontSize: 15,
  fontWeight: "900",

  includeFontPadding: false,
  textAlignVertical: "center",

  lineHeight: 14,
},
});