import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const ICONS = [
  "happy-outline",
  "gift-outline",
  "chatbubble-outline",
  "ellipsis-horizontal",
] as const;

type Props = {
  onEmoji?: () => void;
  onGift?: () => void;
  onChat?: () => void;
  onMore?: () => void;
};

export default function LobbyBottomBar({
  onEmoji,
  onGift,
  onChat,
  onMore,
}: Props) {
  const actions = [
    onEmoji,
    onGift,
    onChat,
    onMore,
  ];

return (
  <View style={styles.container}>
    {ICONS.map((icon, index) => (
      <Pressable
        key={icon}
        onPress={actions[index]}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 35,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    backgroundColor: "rgba(10,10,9,0.92)",

    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    overflow: "hidden",
  },

  button: {
    width: 36,
    height: 35,

    borderRadius: 18,

    justifyContent: "center",
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
