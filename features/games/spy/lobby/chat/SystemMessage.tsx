import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  message: string;
};

export default function SystemMessage({
  message,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text
          style={styles.text}
          numberOfLines={1}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * Center the system bubble,
   * while keeping it compact.
   */
  container: {
    alignItems: "center",

    paddingVertical: 5,

    paddingHorizontal: 8,
  },

  /*
   * Small rounded glass pill.
   */
  bubble: {
    maxWidth: "78%",

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 4,

    backgroundColor:
      "#f8ae00f2",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.075)",

    /*
     * Very subtle depth.
     * No strong glow.
     */
    shadowColor: "#000",

    shadowOpacity: 0.18,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 1,
    },

    elevation: 2,
  },

  text: {
    color:
      "#000000",

    fontSize: 9.5,

    fontWeight: "600",

    letterSpacing: 0.15,

    textAlign: "center",

    includeFontPadding: false,
  },
});