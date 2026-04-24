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
    <View style={{ flex: 1, backgroundColor: "#000" }}>

      {/* HEADER */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "600" }}>
          Chats
        </Text>

        {/* 🔥 BEAUTIFUL ACTION BUTTONS */}
        <View style={{ flexDirection: "row", gap: 14 }}>

          {/* 📝 Notes */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.replace("/chat/notes")
            }
            style={{
              backgroundColor: "#111",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <Ionicons name="document-text" size={20} color="#4ade80" />
          </TouchableOpacity>

          {/* 🧮 Calculator */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.replace("/chat/calculator")
            }
            style={{
              backgroundColor: "#111",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <Ionicons name="calculator" size={20} color="#f59e0b" />
          </TouchableOpacity>

        </View>
      </View>

      {/* SEARCH */}
      <View
        style={{
          marginHorizontal: 12,
          marginBottom: 8,
          backgroundColor: "#111",
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          height: 42,
        }}
      >
        <Ionicons name="search" size={16} color="#888" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          style={{ color: "#fff", marginLeft: 8, flex: 1 }}
        />
      </View>

      {/* CHAT LIST */}
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
        renderItem={({ item }: any) => {
          const userId = item.userId ?? item._id;

          const isOnline = item?.isOnline === true;
          const showOnline = item?.showOnline !== false;

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
                paddingVertical: 10,
                paddingHorizontal: 12,
              }}
            >
              {/* PROFILE IMAGE WITH STATUS RING */}
              <View
                style={{
                  padding: 2,
                  borderWidth: 2,
                  borderRadius: 30,
                  borderColor:
                    showOnline && isOnline
                      ? "#22c55e"
                      : "rgba(127,29,29,0.6)",
                }}
              >
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("@/assets/images/iconbg.png")
                  }
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "#222",
                  }}
                />
              </View>

              {/* NAME */}
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 12,
                  fontSize: 15,
                }}
              >
                {item.fullname || "User"}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}