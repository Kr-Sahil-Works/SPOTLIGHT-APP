import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type Props = {
  onEventsPress?: () => void;
  onRoomsPress?: () => void;
};

function ActionButton({
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
          scale.value = withTiming(0.96, {
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

export default function GamesHeader({
  onEventsPress,
  onRoomsPress,
}: Props) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          Games
        </Text>

        <View style={styles.actions}>
       

          <ActionButton onPress={onRoomsPress}>
             <View style={styles.roomPill}>
 <MaterialCommunityIcons
  name="door-closed"
  size={14}
  color="#B89045"
/>
  <Text style={styles.roomText}>
    Game Room
  </Text>
</View>
           
          </ActionButton>
        </View>
      </View>

      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 34,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "Manrope-ExtraBold",

    fontSize: 30,

    color: "#e0ba58",

    letterSpacing: -0.5,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",

    height: 26,

    paddingHorizontal: 7,

    borderRadius: 14,

    backgroundColor: "#161616",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
roomPill: {
  flexDirection: "row",
  alignItems: "center",

  height: 28,

  paddingHorizontal: 10,

  borderRadius: 14,

  backgroundColor: "#171717",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},

roomText: {
  marginLeft: 5,

  color: "#B89045",

  fontSize: 11,

  fontWeight: "700",
},

  icon: {
    width: 14,
    height: 14,

    resizeMode: "contain",

    marginRight: 4,
  },

  roomEmoji: {
    fontSize: 15,

    marginRight: 5,
  },

 text: {
  color: "#B99A62",

  fontSize: 11,

  fontWeight: "700",
},

  divider: {
    height: 1,

    marginTop: 14,

    marginHorizontal: 20,

    backgroundColor: "#181818",
  },
});