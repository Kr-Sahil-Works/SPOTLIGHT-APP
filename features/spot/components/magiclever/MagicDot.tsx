import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

type Props = {
  icon: any; // require(...) image
  selected: boolean;
  onPress: () => void;
};

export default function MagicDot({
  icon,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        selected && styles.selected,
      ]}
    >
    <Image
  source={icon}
  resizeMode="contain"
  style={[
    styles.icon,
    {
      width: selected ? 34 : 28,
      height: selected ? 34 : 28,
      opacity: selected ? 1 : 0.90,
    },
  ]}
/>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  selected: {
    backgroundColor: "rgba(123,97,255,0.18)",
  },

  icon: {
 width: 60,
height: 60,
  },

  unselected: {
    opacity: 0.45,
  },
});