import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Chats() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const chats = useQuery(api.messages.getChatList);
  const searchUsers = useQuery(api.users.searchUsers, {
    search: search || "",
  });
  const allUsers = useQuery(api.users.getAllUsers);

  const dataSource =
    search.trim().length > 0
      ? searchUsers || []
      : chats && chats.length > 0
      ? chats
      : allUsers || [];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#050505",
        paddingTop: 10,
      }}
    >
      {/* 🔥 HEADER */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          Chats
        </Text>

        {/* ACTION BUTTONS */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* NOTES */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace("/chat/notes")}
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: 10,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Ionicons name="document-text-outline" size={20} color="#4ade80" />
          </TouchableOpacity>

          {/* CALCULATOR */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace("/chat/calculator")}
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: 10,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Ionicons name="calculator-outline" size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 SEARCH BAR (iOS STYLE) */}
      <View
        style={{
          marginHorizontal: 14,
          marginBottom: 10,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          height: 44,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Ionicons name="search" size={16} color="#999" />
        <TextInput
          placeholder="Search chats..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
          style={{
            color: "#fff",
            marginLeft: 8,
            flex: 1,
            fontSize: 14,
          }}
        />
      </View>

      {/* 🔥 CHAT LIST */}
      <FlatList
        data={dataSource}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        keyExtractor={(item: any) =>
          String(item.userId ?? item._id)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        renderItem={({ item }: any) => {
          const userId = item.userId ?? item._id;

          const isOnline = item?.isOnline === true;
          const showOnline = item?.showOnline !== false;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
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
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 14,
                marginHorizontal: 10,
                marginBottom: 6,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.025)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.04)",
              }}
            >
              {/* 🔥 AVATAR */}
              <View
                style={{
                  padding: 2,
                  borderWidth: 2,
                  borderRadius: 30,
                  borderColor:
                    showOnline && isOnline
                      ? "#22c55e"
                      : "rgba(255,255,255,0.15)",
                }}
              >
                <Image
                  source={
                    item?.image && item.image.startsWith("http")
                      ? { uri: item.image }
                      : require("@/assets/images/iconbg.png")
                  }
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    backgroundColor: "#222",
                  }}
                />
              </View>

              {/* 🔥 TEXT AREA */}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {item.fullname ?? ""}
                </Text>

                {/* OPTIONAL subtitle */}
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#777",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Tap to chat
                </Text>
              </View>

              {/* 🔥 RIGHT ICON */}
              <Ionicons
                name="chevron-forward"
                size={16}
                color="rgba(255,255,255,0.3)"
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}