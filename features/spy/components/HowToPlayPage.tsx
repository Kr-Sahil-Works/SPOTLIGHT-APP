import { StyleSheet, Text, View } from "react-native";

import { HOW_TO_PLAY } from "../constants/rules";

export default function HowToPlayPage() {
  return (
    <View style={styles.container}>
      {HOW_TO_PLAY.map((step, index) => (
        <View
          key={step.id}
          style={styles.row}
        >
          <View style={styles.left}>
            <View style={styles.circle}>
              <Text style={styles.number}>
                {index + 1}
              </Text>
            </View>

            {index !== HOW_TO_PLAY.length - 1 && (
              <View style={styles.line} />
            )}
          </View>

          <View style={styles.right}>
            <Text style={styles.title}>
              {step.title}
            </Text>

            <Text style={styles.description}>
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    paddingVertical: 10,
  },

  row: {
    flexDirection: "row",

    marginBottom: 28,
  },

  left: {
    alignItems: "center",

    marginRight: 20,
  },

  circle: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#F2A900",

    justifyContent: "center",

    alignItems: "center",
  },

  number: {
    color: "#111",

    fontSize: 18,

    fontWeight: "900",
  },

  line: {
    width: 2,

    flex: 1,

    marginTop: 8,

    backgroundColor: "#2A2A2A",
  },

  right: {
    flex: 1,

    paddingTop: 4,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 18,

    fontWeight: "800",

    marginBottom: 6,
  },

  description: {
    color: "#A4A4A4",

    fontSize: 14,

    lineHeight: 22,
  },
});