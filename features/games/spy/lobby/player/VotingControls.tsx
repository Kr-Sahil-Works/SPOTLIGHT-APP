import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  visible: boolean;
  onVote?: () => void;
};

export default function VotingControls({
  visible,
  onVote,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      onPress={onVote}
      style={({ pressed }) => [
        styles.voteButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.voteText}>VOTE</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  voteButton: {
    minWidth: 28,
    height: 14,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2A900",
    marginTop: 2,
    marginBottom: 4,
  },

  voteText: {
    color: "#111",
    fontSize: 5,
    fontWeight: "900",
    letterSpacing: 0.35,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
});
