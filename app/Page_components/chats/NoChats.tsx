import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NoChats({ search, onOpenSuggestions }: any) {
  const router = useRouter();
  const isSearching = search.trim().length > 0;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
      }}
    >
      {/* ICON CIRCLE */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "rgba(34,197,94,0.08)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={isSearching ? "search" : "chatbubbles"}
          size={34}
          color="#22c55e"
        />
      </View>

      {/* TITLE */}
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "600",
          marginTop: 18,
        }}
      >
        {isSearching ? "No results found" : "Start chatting"}
      </Text>

      {/* SUBTEXT */}
      <Text
        style={{
          color: "#6b7280",
          fontSize: 13,
          textAlign: "center",
          marginTop: 6,
          lineHeight: 18,
        }}
      >
        {isSearching
          ? "Try a different name or username"
          : "Your conversations will appear here.\nFind people and start a chat."}
      </Text>

      {/* ACTION BUTTON */}
      {!isSearching && (
        <TouchableOpacity
        onPress={() => router.push("/")}
          style={{
            marginTop: 20,
            backgroundColor: "#22c55e",
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="people-outline"
            size={16}
            color="#000"
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            {`Explore posts`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}