import * as Haptics from "expo-haptics";
import { useRef } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Message } from "@/types/chat";

const EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "🔥"];

type Props = {
  reactionMsg: Message | null;
  setReactionMsg: (msg: Message | null) => void;
  toggleReaction: (data: {
    messageId: string;
    reaction: string;
  }) => Promise<void> | void;
};

export default function ReactionBar({
  reactionMsg,
  setReactionMsg,
  toggleReaction,
}: Props) {
  const scales = useRef(
    EMOJIS.map(() => new Animated.Value(1))
  ).current;

  if (!reactionMsg) return null;

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const HEADER_HEIGHT = 70;
  const BAR_WIDTH = 220;
  const BAR_HEIGHT = 60;

  /* ✅ SAFE VALUES (strict types fix) */
  const msgY = reactionMsg.y ?? 0;
  const msgHeight = reactionMsg.height ?? 40;
  const msgX = reactionMsg.x ?? 0;
  const msgWidth = reactionMsg.width ?? 100;

  /* ✅ AUTO FLIP (above/below) */
  const spaceAbove = msgY;
  const spaceBelow = SCREEN_HEIGHT - (msgY + msgHeight);

  const showAbove = spaceAbove > 120;

  const top = showAbove
    ? Math.max(HEADER_HEIGHT + 10, msgY - 80)
    : msgY + msgHeight + 10;

  /* ✅ FOLLOW FINGER (safe fallback) */
  const centerX =
    reactionMsg.fingerX ??
    msgX + msgWidth / 2;

  const left = Math.max(
    10,
    Math.min(centerX - BAR_WIDTH / 2, SCREEN_WIDTH - BAR_WIDTH - 10)
  );

  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width: BAR_WIDTH,
        alignItems: "center",
        zIndex: 9999,
        elevation: 9999,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          backgroundColor: "#111",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 30,
          flexDirection: "row",

          // subtle glow
          shadowColor: "#3b82f6",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
        }}
      >
        {EMOJIS.map((r, i) => (
          <Animated.View
            key={r}
            style={{ transform: [{ scale: scales[i] }] }}
          >
            <TouchableOpacity
              onPressIn={() => {
                Animated.spring(scales[i], {
                  toValue: 1.6,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(scales[i], {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }}
              onPress={async () => {
                if (!reactionMsg?._id) return;

                try {
                  await Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium
                  );

                  await toggleReaction({
                    messageId: reactionMsg._id,
                    reaction: r,
                  });
                } catch (e) {
                  console.log("REACTION ERROR:", e);
                }

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
    </View>
  );
}