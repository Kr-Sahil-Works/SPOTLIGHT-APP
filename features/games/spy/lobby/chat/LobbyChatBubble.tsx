import {
  StyleSheet,
  Text,
  View,
} from "react-native";

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

      <Text
        style={styles.sender}
        numberOfLines={1}
      >
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

    minHeight: 24,

    paddingHorizontal: 7,
    paddingVertical: 1.5,
  },

  number: {
    width: 17,
    height: 17,

    borderRadius: 5,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 4,

    backgroundColor:
      "rgba(242,169,0,0.07)",

    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.16)",
  },

  numberText: {
    color: "#F2A900",

    fontSize: 8,

    fontWeight: "800",

    includeFontPadding: false,

    textAlign: "center",
  },

  sender: {
    color: "#F2A900",

    fontSize: 10,

    fontWeight: "800",

    letterSpacing: 0.05,

    marginRight: 3,

    flexShrink: 0,

    includeFontPadding: false,
  },

  message: {
    color:
      "rgba(255,255,255,0.82)",

    fontSize: 9.5,

    fontWeight: "500",

    letterSpacing: 0.15,

    lineHeight: 15,

    flexShrink: 1,

    includeFontPadding: false,
  },
});