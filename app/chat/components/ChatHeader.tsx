import { ChatTheme } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useUser from "../hooks/useUser";

type Props = {
  userId: Id<"users">;
  onOpenTheme: () => void;
theme: ChatTheme;
};

export default function ChatHeader({ userId, onOpenTheme, theme }: Props){
  const router = useRouter();
  const { user } = useUser(userId);

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderColor: "#222",
        backgroundColor: theme.header,
      }}
    >
      {/* BACK */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.headerText} />
      </TouchableOpacity>

      {/* AVATAR */}
      <Image
        source={
          user?.image
            ? { uri: user.image }
            : require("@/assets/images/iconbg.png")
        }
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          marginLeft: 14,
        }}
      />

      {/* NAME */}
      <Text
        style={{
          color: "#fff",
          marginLeft: 10,
          fontSize: 16,
          fontWeight: "500",
          flex: 1,
        }}
        numberOfLines={1}
      >
  {user?.fullname || "Chat"}
      </Text>

      {/* CALL BTN */}
      <TouchableOpacity style={{ marginRight: 14 }}>
        <Ionicons name="call-sharp" size={22} color={theme.headerText} />
      </TouchableOpacity>

      {/* THEME BTN */}
      <TouchableOpacity style={{ marginRight: 5 }} onPress={onOpenTheme}>
        <Ionicons name="color-palette-sharp" size={22} color={theme.headerText} />
      </TouchableOpacity>
    </View>
  );
}