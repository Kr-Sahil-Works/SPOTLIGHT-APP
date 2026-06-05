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

  /* =========================
     GLOBAL STATS
  ========================= */

  const stats =
    useQuery(
      api.admin.admin
        .getGlobalStats
    ) ?? {
      users: 0,
      posts: 0,
      comments: 0,
      messages: 0,
      likes: 0,
      bookmarks: 0,
      follows: 0,
      notifications: 0,
      collections: 0,
      conversations: 0,
      followRequests: 0,
    };

  /* =========================
     CARD
  ========================= */

  const Box = ({
    title,
    value,
    icon,
  }: any) => (
    <View
      style={{
        width: "47%",

        backgroundColor:
          "#0d0d0d",

        borderRadius: 24,

        padding: 18,

        marginBottom: 14,

        borderWidth: 1,

        borderColor:
          "rgba(0,255,120,0.08)",
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,

          borderRadius: 23,

          backgroundColor:
            "rgba(0,255,120,0.08)",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color="#00ff88"
        />
      </View>

      <Text
        style={{
          color: "#666",

          marginTop: 14,

          fontSize: 13,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#fff",

          fontSize: 30,

          fontWeight: "800",

          marginTop: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );

  /* ========================= */

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
          style={{
            width: 42,
            height: 42,

            borderRadius: 21,

            backgroundColor:
              "#111",

            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
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
            Internal Metrics
          </Text>

          <Text
            style={{
              color: "#00ff88",

              fontSize: 26,

              fontWeight: "800",
            }}
          >
            Global Analytics
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* TOP INFO */}
        <View
          style={{
            backgroundColor:
              "rgba(0,255,120,0.05)",

            borderWidth: 1,

            borderColor:
              "rgba(0,255,120,0.08)",

            borderRadius: 24,

            padding: 20,

            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#00ff88",

              fontSize: 16,

              fontWeight: "800",
            }}
          >
            Realtime Database Overview
          </Text>

          <Text
            style={{
              color: "#999",

              marginTop: 10,

              lineHeight: 22,
            }}
          >
            Live application metrics,
            social engagement,
            messaging activity,
            user growth and backend
            object tracking.
          </Text>
        </View>

        {/* GRID */}
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
            icon="images-outline"
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

          <Box
            title="Follows"
            value={
              stats.follows || 0
            }
            icon="git-network-outline"
          />

          <Box
            title="Collections"
            value={
              stats.collections ||
              0
            }
            icon="albums-outline"
          />

          <Box
            title="Notifications"
            value={
              stats.notifications ||
              0
            }
            icon="notifications-outline"
          />

          <Box
            title="Conversations"
            value={
              stats.conversations ||
              0
            }
            icon="chatbubbles-outline"
          />

          <Box
            title="Follow Requests"
            value={
              stats.followRequests ||
              0
            }
            icon="person-add-outline"
          />
        </View>

        {/* FOOTER */}
        <View
          style={{
            marginTop: 26,

            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#444",

              fontSize: 12,
            }}
          >
            Spotlight Internal
            Metrics v1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}