import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  visible: boolean;
  disabled?: boolean;
  onVote?: () => void;
};

export default function VotingControls({
  visible,
  disabled = false,
  onVote,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onVote}
      hitSlop={6}
      style={({ pressed }) => [
        styles.voteButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.voteText}>
        VOTE
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    voteButton: {
      minWidth: 34,

      height: 16,

      paddingHorizontal: 7,

      borderRadius: 9,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        "#F2A900",

      marginTop: 3,

      marginBottom: 4,

      shadowColor:
        "#F2A900",

      shadowOffset: {
        width: 0,
        height: 1,
      },

      shadowOpacity: 0.3,

      shadowRadius: 3,

      elevation: 2,
    },

    voteText: {
      color: "#111111",

      fontSize: 6,

      fontWeight: "900",

      letterSpacing: 0.45,
    },

    pressed: {
      opacity: 0.75,

      transform: [
        {
          scale: 0.92,
        },
      ],
    },

    disabled: {
      opacity: 0.35,
    },
  });