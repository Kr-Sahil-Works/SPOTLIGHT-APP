import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  isHost?: boolean;

  onEmoji?: () => void;
  onGift?: () => void;
  onChat?: () => void;
  onReset?: () => void;
  onMore?: () => void;
};

export default function LobbyBottomBar({
  isHost = false,

  onEmoji,
  onGift,
  onChat,
  onReset,
  onMore,
}: Props) {
  const actions = [
    onEmoji,
    onGift,
    onChat,
    isHost
      ? onReset
      : onMore,
  ];

  const icons = [
    "happy-outline",
    "gift-outline",
    "chatbubble-outline",
    isHost
      ? "refresh-outline"
      : "ellipsis-horizontal",
  ] as const;

  return (
    <View style={styles.container}>
      {icons.map((icon, index) => (
        <Pressable
          key={icon}
          onPress={actions[index]}
          style={({ pressed }) => [
            styles.button,
            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color="#F2A900"
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      height: 45,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-around",

      backgroundColor:
        "rgba(16, 16, 16, 0.92)",

      borderTopWidth: 1,

      borderTopColor:
        "rgba(255,255,255,0.10)",

      overflow: "hidden",

      marginTop: "auto",
    },

    button: {
      width: 34,
      height: 34,

      borderRadius: 18,

      justifyContent:
        "center",

      alignItems: "center",
    },

    pressed: {
      transform: [
        {
          scale: 0.88,
        },
      ],

      opacity: 0.7,
    },
  });