import { StyleSheet, Text, View } from "react-native";

type Props = {
  playerNumber?: number;
  sender: string;
  message: string;
};

export default function LobbyChatBubble({
  playerNumber,
  sender,
  message,
}: Props) {
  return (
    <View style={styles.container}>
      {playerNumber !== undefined && (
        <View style={styles.number}>
          <Text style={styles.numberText}>
            {playerNumber}
          </Text>
        </View>
      )}

      <Text style={styles.sender}>
        {sender}:
      </Text>

      <Text
        style={styles.message}
        numberOfLines={1}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    minHeight: 26,
  },

  number: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: "rgba(199, 255, 45, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  numberText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },

  sender: {
    color: "#F2A900",
    fontSize: 11,
    fontWeight: "700",
    marginRight: 4,
    flexShrink: 0,
  },

  message: {
    color: "#FFF",
    fontSize: 10,
    letterSpacing: 0.6,
    lineHeight: 18,
    flexShrink: 1,
  },
});