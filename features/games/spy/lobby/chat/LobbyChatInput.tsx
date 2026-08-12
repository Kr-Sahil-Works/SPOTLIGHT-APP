import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSend?: () => void;
};

export default function LobbyChatInput({
  value = "",
  onChangeText,
  onSend,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
  autoFocus
  value={value}
  onChangeText={onChangeText}
  placeholder="Say something..."
        placeholderTextColor="#777"
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={onSend}
      />

      <Pressable
        onPress={onSend}
        style={({ pressed }) => [
          styles.sendButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name="send"
          size={18}
          color="#111"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",

    padding: 12,

    borderRadius: 18,

    backgroundColor: "rgba(10,10,14,0.96)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,

    height: 42,

    borderRadius: 14,

    backgroundColor: "#161616",

    color: "#FFF",

    paddingHorizontal: 14,

    fontSize: 14,
  },

  sendButton: {
    marginLeft: 10,

    width: 42,

    height: 42,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F2A900",
  },

  pressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },
});
