import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function ChatSearch({ value, onChange }: any) {
  return (
    <View style={{
      marginTop: 16,
      marginHorizontal: 18,
      backgroundColor: "#0b0f0c",
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      height: 50,
      borderWidth: 1,
      borderColor: "rgba(34,197,94,0.15)",
    }}>
      <Ionicons name="search" size={18} color="#22c55e" />

      <TextInput
        placeholder="Search chats"
        placeholderTextColor="#2e4d3a"
        value={value}
        onChangeText={onChange}
        style={{
          color: "#22c55e",
          marginLeft: 10,
          flex: 1,
        }}
      />
    </View>
  );
}