import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ChatItem({ item }: any) {
  const router = useRouter();

  const userId = item.userId ?? item._id;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: {
            id: userId.toString(),
            name: item.fullname,
            image: item.image,
          },
        })
      }
      style={{
        flexDirection: "row",
        padding: 14,
        borderRadius: 18,
        backgroundColor: "#000604",
        marginBottom: 6,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 60, height: 60, borderRadius: 30 }}
      />

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {item.fullname}
        </Text>

        <Text style={{ color: "#888", marginTop: 4 }}>
          {item.lastMessage?.text || "Tap to chat"}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#555" />
    </TouchableOpacity>
  );
}