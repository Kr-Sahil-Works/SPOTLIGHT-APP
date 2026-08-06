import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onRankingPress?: () => void;
  onTasksPress?: () => void;
  onFriendsPress?: () => void;
};

function AnimatedStat({
  image,
  title,
  color,
  onPress,
}: {
  image: any;
  title: string;
  color: string;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        style={styles.item}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 90 });
        }}
      >
        <Image source={image} style={styles.icon} />

        <Text style={[styles.label, { color }]}>{title}</Text>

        <View
          style={[
            styles.indicator,
            {
              backgroundColor: color,
            },
          ]}
        />
      </Pressable>
    </Animated.View>
  );
}

export default function QuickStats({
  onRankingPress,
  onTasksPress,
  onFriendsPress,
}: Props) {
  return (
    <View style={styles.container}>
      <AnimatedStat
        title="Ranking"
        color="#F6C343"
        image={require("@/assets/images/miles/ranking.png")}
        onPress={onRankingPress}
      />

      <AnimatedStat
        title="Tasks"
        color="#E45A5A"
        image={require("@/assets/images/miles/tasks.png")}
        onPress={onTasksPress}
      />

      <AnimatedStat
        title="Friends"
        color="#A06E3F"
        image={require("@/assets/images/miles/friends.png")}
        onPress={onFriendsPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,

    paddingHorizontal: 12,

    flexDirection: "row",

    justifyContent: "space-between",
  },

  wrapper: {
    flex: 1,

    marginHorizontal: 6,
  },

  item: {
    height: 90,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#0A0A0A",

    borderRadius: 18,

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.07)",

    shadowColor: "#000",

    shadowOpacity: 0.35,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  icon: {
    width: 64,

    height: 64,

    resizeMode: "contain",

    marginBottom: -14,
    marginTop: -14,
  },

  label: {
    marginTop: 2,

    fontSize: 14,

    fontWeight: "800",

    letterSpacing: 0.2,
  },

  indicator: {
    marginTop: 2,

    width: 18,

    height: 3,

    borderRadius: 99,
  },
});