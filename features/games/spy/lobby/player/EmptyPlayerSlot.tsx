import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  size: number;
};

export default function EmptyPlayerSlot({
  size,
}: Props) {
  const radius = size * 0.28;

  return (
    <View
      style={[
        styles.container,
        {
          width: size + 10,
          minHeight: size + 10,
          borderRadius: radius,
        },
      ]}
    >
      <View
        style={[
          styles.slot,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={Math.max(13, size * 0.28)}
          color="rgba(255,255,255,0.28)"
        />
      </View>

      <View style={styles.label}>
        <Ionicons
          name="add"
          size={9}
          color="rgba(255,255,255,0.32)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  slot: {
    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(18,18,24,0.22)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.07)",

    borderStyle: "dashed",
  },

  label: {
    position: "absolute",

    bottom: -2,

    right: -2,

    width: 16,

    height: 16,

    borderRadius: 8,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "rgba(10,10,14,0.78)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",
  },
});