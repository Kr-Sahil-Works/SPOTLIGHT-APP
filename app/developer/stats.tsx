import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";

import { useRouter } from "expo-router";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StatsPage() {
  const router = useRouter();

const currentUser =
  useQuery(
    api.users.index
      .getCurrentUser
  );

const isAdmin =
  currentUser?.email ===
  "sahillearn44@gmail.com";

const stats =
  useQuery(
    api.admin.admin
      .getGlobalStats,
    isAdmin
      ? {}
      : "skip"
  ) ?? {
    users: 0,
    posts: 0,
    comments: 0,
    messages: 0,
    likes: 0,
    bookmarks: 0,
  };

  const Box = ({
    title,
    value,
    icon,
  }: any) => (
    <View
      style={{
        width: "47%",

        backgroundColor:
          "rgba(255,255,255,0.04)",

        borderRadius: 22,

        padding: 18,

        marginBottom: 14,

        borderWidth: 1,

        borderColor:
          "rgba(255,255,255,0.05)",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#00ff88"
      />

      <Text
        style={{
          color: "#777",

          marginTop: 12,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#fff",

          fontSize: 28,

          fontWeight: "800",

          marginTop: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingHorizontal: 16,

          paddingTop: 10,

          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#00ff88"
          />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 16,
          }}
        >
          <Text
            style={{
              color: "#666",
              fontSize: 12,
            }}
          >
            Admin Control
          </Text>

          <Text
            style={{
              color: "#00ff88",

              fontSize: 24,

              fontWeight: "800",
            }}
          >
            Analytics
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent:
              "space-between",
          }}
        >
          <Box
            title="Users"
            value={stats.users}
            icon="people-outline"
          />

          <Box
            title="Posts"
            value={stats.posts}
            icon="image-outline"
          />

          <Box
            title="Comments"
            value={stats.comments}
            icon="chatbubble-outline"
          />

          <Box
            title="Messages"
            value={stats.messages}
            icon="mail-outline"
          />

          <Box
            title="Likes"
            value={stats.likes}
            icon="heart-outline"
          />

          <Box
            title="Bookmarks"
            value={
              stats.bookmarks
            }
            icon="bookmark-outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}