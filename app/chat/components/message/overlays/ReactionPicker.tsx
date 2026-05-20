import React, {
  useRef,
} from "react";

import * as Haptics from "expo-haptics";

import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useOverlay } from "../hooks/useOverlay";

const EMOJIS = [
  "❤️",
  "😂",
  "😮",
  "😢",
  "🙏",
  "🔥",
];

type Props = {
   onMore?: () => void;
toggleReaction: (data: {
  messageId: Id<"messages">;
  reaction: string;
}) => Promise<any> | void;
};

export default function ReactionPicker({
  toggleReaction,
  onMore,
}: Props) {
  const {
    overlay,
    closeOverlay,
  } = useOverlay();

  const scales = useRef(
    EMOJIS.map(
      () => new Animated.Value(1)
    )
  ).current;

  const opacity =
  useRef(
    new Animated.Value(0)
  ).current;


const translateY =
  useRef(
    new Animated.Value(8)
  ).current;

    const [keyboardHeight,
setKeyboardHeight] =
  React.useState(0);

  const visible =
    overlay.type ===
      "reaction" &&
    overlay.message;

    React.useEffect(() => {
  if (visible) {
    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,

          duration: 180,

          easing:
            Easing.out(
              Easing.exp
            ),

          useNativeDriver: true,
        }
      ),

      Animated.spring(
        translateY,
        {
          toValue: 0,

          friction: 7,

          useNativeDriver: true,
        }
      ),
    ]).start();
  } else {
    opacity.setValue(0);

    translateY.setValue(8);
  }
}, [visible]);



  React.useEffect(() => {
  const showSub =
    Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(
          e.endCoordinates
            .height
        );
      }
    );

  const hideSub =
    Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);



  if (!visible) {
    return null;
  }

const msg = overlay.message;

if (!msg) {
  return null;
}

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get("window");

const BAR_WIDTH = 310;

const msgY = msg.y ?? 0;

const msgHeight =
  msg.height ?? 40;

const msgX = msg.x ?? 0;

const msgWidth =
  msg.width ?? 100;

const HEADER_HEIGHT =
  70;

const INPUT_HEIGHT =
  90;

const SAFE_TOP =
  HEADER_HEIGHT + 12;

const SAFE_BOTTOM =
  SCREEN_HEIGHT -
  INPUT_HEIGHT -
  80;

const showAbove =
  msgY > 120;

const keyboardTop =
  SCREEN_HEIGHT -
  keyboardHeight;

const safeBottom =
  keyboardTop - 90;

const top =
  msgY + 240;


const centerX =
  msg.fingerX ??
  msgX + msgWidth / 2;

const left = Math.max(
  30,
  Math.min(
    msgX +
      msgWidth / 2 -
      BAR_WIDTH / 2,
    SCREEN_WIDTH -
      BAR_WIDTH -
      30
  )
);


return (
  <View
    style={{
      position: "absolute",

      width: "100%",

      height: "100%",

      zIndex: 9999,

      elevation: 9999,
    }}
  >
<Pressable
  onPress={() => {
    closeOverlay();
  }}
  style={{
    position: "absolute",

    width: "100%",

    height: "100%",
  }}
>
  <BlurView
    intensity={38}
    tint="dark"
    style={{
      position: "absolute",

      width: "100%",

      height: "100%",
    }}
  >
    <View
      style={{
        flex: 1,

        backgroundColor:
          "#00000057",
      }}
    />
  </BlurView>
</Pressable>

    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",

        top,
        left,

        width: BAR_WIDTH,

        opacity,

        transform: [
          {
            translateY,
          },
        ],
      }}
    >
      <View
        style={{
          backgroundColor:
            "#111",

          paddingVertical: 8,

          paddingHorizontal: 10,

          borderRadius: 26,

          flexDirection: "row",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap: 8,

          shadowColor: "#000",

          shadowOpacity: 0.2,

          shadowRadius: 12,

          shadowOffset: {
            width: 0,
            height: 6,
          },

          elevation: 10,
        }}
      >
        {EMOJIS.map(
          (emoji, index) => (
            <Animated.View
            pointerEvents="box-none"
              key={emoji}
              style={{
                transform: [
                  {
                    scale:
                      scales[
                        index
                      ],
                  },
                ],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => {
                  Animated.spring(
                    scales[index],
                    {
                      toValue: 1.5,

                      useNativeDriver: true,
                    }
                  ).start();
                }}
                onPressOut={() => {
                  Animated.spring(
                    scales[index],
                    {
                      toValue: 1,

                      useNativeDriver: true,
                    }
                  ).start();
                }}
                onPress={async () => {
                  if (!msg?._id)
                    return;

                  try {
                    await Haptics.impactAsync(
                      Haptics
                        .ImpactFeedbackStyle
                        .Medium
                    );

                    await toggleReaction(
                      {
                        messageId:
                          msg._id,

                        reaction:
                          emoji,
                      }
                    );
                  } catch (
                    error
                  ) {
                    console.log(
                      error
                    );
                  }

                  closeOverlay();
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                  }}
                >
                  {emoji}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )
        )}

<View
  style={{
    width: 1.2,
    height: 24,
    backgroundColor:
      "#ffffff35",
    marginHorizontal: 1,
  }}
/>

<TouchableOpacity
  activeOpacity={0.7}
  onPress={() => {
    closeOverlay();
    onMore?.();
  }}
  style={{
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent:
      "center",
    paddingTop: 1,
  }}
>
  <Ionicons
    name="grid-outline"
    size={20}
    color="#fff"
  />
</TouchableOpacity>
      </View>
      </Animated.View>
    </View>
  );
}