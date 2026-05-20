import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserInspectPage() {
  const router = useRouter();

  const { id } =
    useLocalSearchParams();

  const user =
    useQuery(
      api.users.index.getUser,
      {
        userId:
          id as Id<"users">,
      }
    );

  const stats =
    useQuery(
      api.users.index
        .getUserStats,
      {
        userId:
          id as Id<"users">,
      }
    );

  if (!user || !stats) {
    return null;
  }

  /* =========================
     CARD
  ========================= */

  const StatCard = ({
    title,
    value,
    icon,
  }: any) => (
    <View
      style={{
        width: "48%",

        backgroundColor:
          "#0f0f0f",

        borderRadius: 22,

        padding: 18,

        marginBottom: 14,

        borderWidth: 1,

        borderColor:
          "rgba(0,255,120,0.08)",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#00ff88"
      />

      <Text
        style={{
          color: "#666",

          marginTop: 12,

          fontSize: 13,
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
            marginLeft: 14,
          }}
        >
          <Text
            style={{
              color: "#666",
              fontSize: 12,
            }}
          >
            User Inspection
          </Text>

          <Text
            style={{
              color: "#00ff88",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            @{user.username}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* PROFILE */}
        <View
          style={{
            backgroundColor:
              "#0d0d0d",

            borderRadius: 28,

            padding: 22,

            borderWidth: 1,

            borderColor:
              "rgba(255,255,255,0.05)",
          }}
        >
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: user.image,
              }}
              style={{
                width: 92,
                height: 92,

                borderRadius: 999,

                borderWidth: 3,

                borderColor:
                  "#00ff88",
              }}
            />

            <View
              style={{
                marginLeft: 18,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",

                  fontSize: 22,

                  fontWeight: "800",
                }}
              >
                {user.fullname}
              </Text>

              <Text
                style={{
                  color: "#00ff88",

                  marginTop: 4,

                  fontSize: 15,
                }}
              >
                @{user.username}
              </Text>

              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,

                    borderRadius: 99,

                    backgroundColor:
                      user.isOnline
                        ? "#00ff88"
                        : "#666",
                  }}
                />

                <Text
                  style={{
                    color: "#888",

                    marginLeft: 8,
                  }}
                >
                  {user.isOnline
                    ? "Online"
                    : "Offline"}
                </Text>
              </View>
            </View>
          </View>

          {/* BIO */}
          {!!user.bio && (
            <Text
              style={{
                color: "#ccc",

                marginTop: 20,

                lineHeight: 24,

                fontSize: 14,
              }}
            >
              {user.bio}
            </Text>
          )}

          {/* DETAILS */}
          <View
            style={{
              marginTop: 24,
            }}
          >
            <DetailRow
              label="User ID"
              value={user._id}
            />

            <DetailRow
              label="Clerk ID"
              value={user.clerkId}
            />

            <DetailRow
              label="Email"
              value={user.email}
            />

            <DetailRow
              label="Account Type"
              value={
                user.accountType
              }
            />

            <DetailRow
              label="Created"
   value={
  user.createdAt
    ? new Date(
        user.createdAt
      ).toLocaleString()
    : "-"
}
            />

            <DetailRow
              label="Last Active"
         value={
  user.lastActiveAt
    ? new Date(
        user.lastActiveAt
      ).toLocaleString()
    : "-"
}
            />

            <DetailRow
              label="Estimated Profile Storage"
              value={
                "~150 KB"
              }
            />
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",

            flexWrap: "wrap",

            justifyContent:
              "space-between",

            marginTop: 20,
          }}
        >
          <StatCard
            title="Posts"
            value={stats.posts}
            icon="images-outline"
          />

          <StatCard
            title="Followers"
            value={
              stats.followers
            }
            icon="people-outline"
          />

          <StatCard
            title="Following"
            value={
              stats.following
            }
            icon="person-add-outline"
          />

          <StatCard
            title="Likes"
            value={stats.likes}
            icon="heart-outline"
          />

          <StatCard
            title="Comments"
            value={
              stats.comments
            }
            icon="chatbubble-outline"
          />

          <StatCard
            title="Messages"
            value={
              stats.messages
            }
            icon="mail-outline"
          />
        </View>

        {/* DANGER */}
        <View
          style={{
            marginTop: 20,

            backgroundColor:
              "rgba(255,0,0,0.05)",

            borderWidth: 1,

            borderColor:
              "rgba(255,0,0,0.12)",

            borderRadius: 24,

            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#ff3b30",

              fontSize: 18,

              fontWeight: "800",
            }}
          >
            Danger Zone
          </Text>

          <Text
            style={{
              color: "#999",

              marginTop: 10,

              lineHeight: 22,
            }}
          >
            Deleting this user
            permanently removes
            all posts, messages,
            follows, collections,
            notifications and
            profile storage data.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* =========================
   DETAIL ROW
========================= */

function DetailRow({
  label,
  value,
}: any) {
  return (
    <View
      style={{
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          color: "#666",
          fontSize: 12,
        }}
      >
        {label}
      </Text>

      <Text
        selectable
        style={{
          color: "#fff",

          marginTop: 4,

          fontSize: 14,
        }}
      >
        {String(value || "-")}
      </Text>
    </View>
  );
}