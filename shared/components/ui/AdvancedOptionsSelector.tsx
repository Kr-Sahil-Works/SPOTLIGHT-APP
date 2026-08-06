import Toggle from "@/shared/components/ui/Toogle";
import { Ionicons } from "@expo/vector-icons";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  passwordEnabled: boolean;
  setPasswordEnabled: (
    value: boolean
  ) => void;
};

export default function AdvancedOptionsSelector({
  passwordEnabled,
  setPasswordEnabled,
}: Props) {
  return (
    <View style={styles.container}>

      {/* Password */}

      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Password
          </Text>

          <Text style={styles.subtitle}>
            Protect room with PIN
          </Text>
        </View>

        <Toggle
          value={passwordEnabled}
          onChange={setPasswordEnabled}
        />
      </View>

      {/* Background */}

      <Pressable style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Background Theme
          </Text>

          <Text style={styles.subtitle}>
            Select room background
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#8A8A8A"
        />
      </Pressable>

      {/* Sound */}

      <Pressable style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Sound Track
          </Text>

          <Text style={styles.subtitle}>
            Choose ambient music
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#8A8A8A"
        />
      </Pressable>

      {/* Timer */}

      <Pressable style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Round Timer
          </Text>

          <Text style={styles.subtitle}>
            Discussion duration
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#8A8A8A"
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    gap: 10,
  },

  row: {
    height: 60,

    borderRadius: 18,

    backgroundColor: "#0c0c0c",

    borderWidth: 1,
    borderColor: "#b15f00",

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  bottomRow: {
    height: 70,

    marginTop: 8,

    borderRadius: 18,

    backgroundColor: "#242424",

    borderWidth: 1,
    borderColor: "#C79B14",

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: "#d2be92",

    fontSize: 15,

    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,

    color: "#bdbba7",

    fontSize: 11,
  },
});