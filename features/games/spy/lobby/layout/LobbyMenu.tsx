import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onSettings?: () => void;
  onRules?: () => void;
  onVolume?: () => void;
  onExit?: () => void;
};

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
};

function MenuItem({
  icon,
  label,
  onPress,
  danger = false,
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
    >
      <View
        style={[
          styles.iconBox,
          danger && styles.dangerIconBox,
        ]}
      >
        <Ionicons
          name={icon}
          size={14}
          color={danger ? "#FF5C5C" : "#F2A900"}
        />
      </View>

      <Text
        style={[
          styles.label,
          danger && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function LobbyMenu({
  onSettings,
  onRules,
  onVolume,
  onExit,
}: Props) {
  return (
    <View style={styles.menu}>
      <MenuItem
        icon="settings-outline"
        label="Settings"
        onPress={onSettings}
      />

      <MenuItem
        icon="book-outline"
        label="Rules"
        onPress={onRules}
      />

      <MenuItem
        icon="volume-medium-outline"
        label="Volume"
        onPress={onVolume}
      />

      <View style={styles.divider} />

      <MenuItem
        icon="exit-outline"
        label="Exit"
        onPress={onExit}
        danger
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",

    top: 74,

    left: 10,

    width: 158,

    paddingVertical: 6,

    paddingHorizontal: 5,

    borderRadius: 16,

    backgroundColor:
      "rgba(10,10,14,0.96)",

    borderWidth: 1,

    borderColor:
      "rgba(217, 155, 0, 0.35)",

    shadowColor: "#000000",

    shadowOpacity: 0.45,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 12,

    zIndex: 200,
  },

  item: {
    height: 38,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 6,

    borderRadius: 11,
  },

  itemPressed: {
    backgroundColor:
      "rgba(255,255,255,0.07)",

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  iconBox: {
    width: 27,

    height: 27,

    borderRadius: 9,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(242,169,0,0.08)",
  },

  dangerIconBox: {
    backgroundColor:
      "rgba(255,92,92,0.08)",
  },

  label: {
    marginLeft: 9,

    color: "#EDEDED",

    fontSize: 12,

    fontWeight: "700",
  },

  dangerLabel: {
    color: "#FF6B6B",
  },

  divider: {
    height: 1,

    marginHorizontal: 7,

    marginVertical: 4,

    backgroundColor:
      "rgba(255,255,255,0.07)",
  },
});
