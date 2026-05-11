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

export default function DeveloperPage() {
  const router = useRouter();

  /* =========================
     GLOBAL STATS
  ========================= */

  const stats =
    useQuery(
      api.admin.admin.getGlobalStats
    ) || {
      users: 0,
      posts: 0,
      comments: 0,
      messages: 0,
      likes: 0,
      bookmarks: 0,
    };

  /* =========================
     CARD
  ========================= */

  const Card = ({
    icon,
    title,
    desc,
    value,
    onPress,
  }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor:
          "rgba(0,255,120,0.05)",

        borderWidth: 1,

        borderColor:
          "rgba(0,255,120,0.08)",

        borderRadius: 24,

        padding: 18,

        marginBottom: 14,
      }}
    >
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* ICON */}
        <View
          style={{
            width: 52,
            height: 52,

            borderRadius: 26,

            backgroundColor:
              "rgba(0,255,120,0.08)",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Ionicons
            name={icon}
            size={24}
            color="#00ff88"
          />
        </View>

        {/* TEXT */}
        <View
          style={{
            marginLeft: 14,
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontSize: 16,

              fontWeight: "800",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#777",

              fontSize: 12,

              marginTop: 4,
            }}
          >
            {desc}
          </Text>
        </View>

        {/* VALUE */}
        {value !== undefined && (
          <View
            style={{
              backgroundColor:
                "rgba(0,255,120,0.08)",

              paddingHorizontal: 12,

              paddingVertical: 6,

              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: "#00ff88",

                fontWeight: "800",
              }}
            >
              {value}
            </Text>
          </View>
        )}

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#666"
          style={{
            marginLeft: 12,
          }}
        />
      </View>
    </TouchableOpacity>
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

          paddingBottom: 24,
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
              "rgba(255,255,255,0.05)",

            justifyContent: "center",

            alignItems: "center",
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
            Internal Access
          </Text>

          <Text
            style={{
              color: "#00ff88",

              fontSize: 24,

              fontWeight: "800",
            }}
          >
            Developer Mode
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
        {/* WARNING */}
        <View
          style={{
            backgroundColor:
              "rgba(255,180,0,0.08)",

            borderWidth: 1,

            borderColor:
              "rgba(255,180,0,0.12)",

            borderRadius: 22,

            padding: 18,

            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#ffcc66",

              fontWeight: "800",

              fontSize: 15,
            }}
          >
            Restricted Area
          </Text>

          <Text
            style={{
              color: "#b8b8b8",

              marginTop: 8,

              lineHeight: 22,

              fontSize: 13,
            }}
          >
            Internal admin tools,
            analytics, moderation and
            hidden systems live here.
          </Text>
        </View>

        {/* QUICK STATS */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 22,
          }}
        >
          {[
            {
              label: "Users",
              value: stats.users,
            },

            {
              label: "Posts",
              value: stats.posts,
            },

            {
              label: "Messages",
              value:
                stats.messages,
            },

            {
              label: "Comments",
              value:
                stats.comments,
            },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",

                backgroundColor:
                  "rgba(255,255,255,0.03)",

                borderRadius: 20,

                padding: 16,

                borderWidth: 1,

                borderColor:
                  "rgba(255,255,255,0.05)",
              }}
            >
              <Text
                style={{
                  color: "#777",
                  fontSize: 12,
                }}
              >
                {item.label}
              </Text>

              <Text
                style={{
                  color: "#00ff88",

                  fontSize: 26,

                  fontWeight: "800",

                  marginTop: 8,
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* MAIN TOOLS */}
        <Card
          icon="people-outline"
          title="User Management"
          desc="Search, inspect and moderate all users"
          value={stats.users}
          onPress={() =>
            router.push(
              "/developer/users"
            )
          }
        />

        <Card
          icon="analytics-outline"
          title="Global Analytics"
          desc="Full application statistics dashboard"
          onPress={() =>
            router.push(
              "/developer/stats"
            )
          }
        />

        <Card
          icon="bug-outline"
          title="Debug Console"
          desc="Logs, runtime info and diagnostics"
        />

        <Card
          icon="flask-outline"
          title="Experimental Features"
          desc="Upcoming hidden features"
        />

        <Card
          icon="hardware-chip-outline"
          title="Performance Monitor"
          desc="FPS, memory and rendering stats"
        />

        <Card
          icon="server-outline"
          title="Backend Control"
          desc="Convex database and API controls"
        />

        {/* FOOTER */}
        <View
          style={{
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#444",
              fontSize: 12,
            }}
          >
            Internal Developer Build
            v0.1
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}