import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function ReactionBar({
  reactionMsg,
  setReactionMsg,
  toggleReaction,
}: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!reactionMsg) return null;

  return (
    <Pressable
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onPress={() => setReactionMsg(null)}
    >
      <View
        style={{
          position: "absolute",
          bottom: 110,
          alignSelf: "center",
          backgroundColor: "rgba(0,0,0,0.9)",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 30,
          flexDirection: "row",
          elevation: 10,
        }}
      >
        {["❤️", "😂", "😮", "😢", "🙏", "🔥"].map((r) => (
          <Animated.View
            key={r}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (!reactionMsg?._id) return;

                try {
                  // 🔥 HAPTIC
                  await Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium
                  );

                  // 🔥 BOUNCE ANIMATION
                  Animated.sequence([
                    Animated.timing(scaleAnim, {
                      toValue: 1.4,
                      duration: 120,
                      useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                      toValue: 1,
                      friction: 4,
                      useNativeDriver: true,
                    }),
                  ]).start();

                  // 🔥 REACTION
                  await toggleReaction({
                    messageId: reactionMsg._id,
                    reaction: r,
                  });
                } catch (e) {
  console.log("REACTION ERROR:", e);
}

                // 🔥 CLOSE BAR
                setReactionMsg(null);
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  marginHorizontal: 6,
                }}
              >
                {r}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Pressable>
  );
}