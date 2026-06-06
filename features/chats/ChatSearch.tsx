import useChatListTheme from "@/hooks/useChatListTheme";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function ChatSearch({ value, onChange }: any) {
  const theme =
  useChatListTheme();
  return (
    <View style={{
      marginTop: 16,
      marginHorizontal: 18,
   backgroundColor:
  theme.searchBg,
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      height: 50,
      borderWidth: 1,
  borderColor:
  theme.cardBorder,
    }}>
      <Ionicons
  name="search"
  size={18}
  color={
    theme.headerColor ??
    "#22c55e"
  }
/>

      <TextInput
        placeholder="Search chats"
        placeholderTextColor="#7a7a7a"
        value={value}
        onChangeText={onChange}
        style={{
        color:
  theme.headerColor ??
  "#22c55e",
          marginLeft: 10,
          flex: 1,
        }}
      />
    </View>
  );
}