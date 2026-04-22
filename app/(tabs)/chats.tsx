import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

  // 🔥 decide data source
  const dataSource =
    search.trim().length > 0
      ? searchUsers || []
      : chats && chats.length > 0
      ? chats
      : allUsers || [];

  const isLoading = !chats || !allUsers;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: "rgba(255,255,255,0.08)",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
          Chats
        </Text>

        <Ionicons name="create-outline" size={22} color={COLORS.primary} />
      </View>

      {/* SEARCH */}
      <View style={{ padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#111",
            borderRadius: 14,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search people..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              color: "#fff",
              paddingVertical: 10,
              paddingHorizontal: 8,
            }}
          />
        </View>
      </View>

      {/* LOADING */}
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {/* LIST */}
      <FlatList
        data={dataSource}
        keyExtractor={(item: any) =>
          (item.userId || item._id).toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          const userId = item.userId || item._id;
          const isChat = !!item.lastMessage;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/chat/[id]",
                  params: { id: userId.toString() },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              {/* PROFILE */}
              <View>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "#111",
                  }}
                />

                {/* 🔴 UNREAD BADGE */}
                {(item.unreadCount ?? 0) > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -4,
                      top: -4,
                      backgroundColor: COLORS.primary,
                      borderRadius: 10,
                      minWidth: 18,
                      height: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 10,
                        fontWeight: "600",
                      }}
                    >
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>

              {/* TEXT */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: (item.unreadCount ?? 0) > 0 ? "700" : "500",
                    fontSize: 15,
                  }}
                >
                  {item.fullname}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: (item.unreadCount ?? 0) > 0 ? "#fff" : "#888",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  {isChat ? item.lastMessage : "Start chatting"}
                </Text>
              </View>

              {/* TIME */}
              {item.createdAt && (
                <Text style={{ color: "#666", fontSize: 11 }}>
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#666" }}>
              {search ? "No users found" : "No conversations yet"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}