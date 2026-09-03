import { StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  remaining: number | null;
};

export default function VotingTimer({
  visible,
  remaining,
}: Props) {
  if (!visible || remaining === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        VOTE
      </Text>

      <Text style={styles.timer}>
        {remaining}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 10,
    right: 12,

    minWidth: 48,
    height: 28,

    paddingHorizontal: 8,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
    gap: 4,

    backgroundColor:
      "rgba(8,8,12,0.78)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.55)",

    zIndex: 100,
    elevation: 100,
  },

  label: {
    color: "#D2A62A",

    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 0.7,
  },

  timer: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 0.2,
  },
});