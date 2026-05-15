import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

function getLastSeen(lastSeen?: number) {
  if (!lastSeen) return "";

  const diff =
    Date.now() - lastSeen;

  const minutes =
    Math.floor(diff / 60000);

  const hours =
    Math.floor(diff / 3600000);

  const days =
    Math.floor(diff / 86400000);

  if (minutes < 1)
    return "Active now";

  if (minutes < 60)
    return `Active ${minutes}m ago`;

  if (hours < 24)
    return `Active ${hours}h ago`;

  return `Active ${days}d ago`;
}

function formatChatTime(timestamp?: number) {
  if (!timestamp) return "";

  const diff =
    Date.now() - timestamp;

  const minutes =
    Math.floor(diff / 60000);

  const hours =
    Math.floor(diff / 3600000);

  const days =
    Math.floor(diff / 86400000);

  if (minutes < 1)
    return "now";

  if (minutes < 60)
    return `${minutes}m`;

  if (hours < 24)
    return `${hours}h`;

  if (days < 7)
    return `${days}d`;

  return new Date(timestamp)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
}


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
  borderRadius: 24,

  backgroundColor: "rgba(255,255,255,0.04)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.06)",

  marginBottom: 14,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.25,
  shadowRadius: 18,

  elevation: 8,

  overflow: "hidden",
}}
    >
<View
  style={{
    padding: item.isOnline ? 2 : 2,

    borderRadius: 999,

    backgroundColor: item.isOnline
      ? "#02c612"
      : "rgba(255,255,255,0.08)",
  }}
>
  <Image
    source={{ uri: item.image }}
    style={{
      width: 60,
      height: 60,
      borderRadius: 30,
    }}
  />
</View>

      <View
  style={{
    marginLeft: 14,
    flex: 1,
    justifyContent: "center",
  }}
>
      <Text
  style={{
    color: "#fff",

    fontWeight:
      item.unreadCount > 0
        ? "700"
        : "600",

    fontSize: 16,
  }}
>
  {item.fullname}
</Text>

<Text
  numberOfLines={1}
style={{
  color:
    item.unreadCount > 0
      ? "#e5e7eb"
      : "#9ca3af",

  marginTop: 6,

  fontSize: 13,

  fontWeight:
    item.unreadCount > 0
      ? "600"
      : "400",
}}
>
  {item.lastMessage?.text ||
    item.lastMessage ||
    "Start chatting"}
</Text>

<Text
  style={{
    color: item.isOnline
      ? "#22c55e"
      : "#6b7280",

    fontSize: 11,
    marginTop: 4,
  }}
>
  {item.isOnline
    ? "Online"
    : getLastSeen(item.lastSeen)}
</Text>
      </View>

<View
  style={{
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
  }}
>
  {/* TOP ROW */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    }}
  >
    <Text
      style={{
        color: "#6b7280",
        fontSize: 11,
        fontWeight: "500",
      }}
    >
      {formatChatTime(item.createdAt)}
    </Text>

    {item.unreadCount > 0 && (
      <View
        style={{
          minWidth: 20,
          height: 20,

          paddingHorizontal: 6,

          borderRadius: 999,

          backgroundColor: "#22c55e",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#000",
            fontSize: 10,
            fontWeight: "700",
          }}
        >
          {item.unreadCount > 99
            ? "99+"
            : item.unreadCount}
        </Text>
      </View>
    )}
  </View>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#4b5563"
  />
</View>
    </TouchableOpacity>
  );
}