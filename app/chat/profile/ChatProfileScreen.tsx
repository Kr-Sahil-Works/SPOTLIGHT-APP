import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useUser from "@/app/chat/hooks/useUser";

type Props = {
  userId: Id<"users">;
};

export default function ChatProfileScreen({
  userId,
}: Props) {
  const router = useRouter();

  const { user } = useUser(userId);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      {/* TOP */}
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 18,
        }}
      >
        {/* BACK */}
       <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <TouchableOpacity
    onPress={() => router.back()}
  >
    <Ionicons
      name="arrow-back"
      size={28}
      color="#fff"
    />
  </TouchableOpacity>

  <TouchableOpacity
    disabled
    style={{ opacity: 0.5 }}
  >
    <Ionicons
      name="ellipsis-horizontal"
      size={24}
      color="#fff"
    />
  </TouchableOpacity>
</View>

        {/* PROFILE */}
        <View
  style={{
    backgroundColor:
      "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.06)",
    borderRadius: 28,
    padding: 24,
    marginTop: 20,
  }}
>
        <View
          style={{
            alignItems: "center",
          }}
        >
 <Image
  source={
    user?.image?.trim()
      ? { uri: user.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  cachePolicy="memory-disk"
  transition={120}
  style={{
    width: 108,
    height: 108,
    borderRadius: 99,
  }}
/>

          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "700",
              marginTop: 10,
            }}
          >
            {user?.fullname || "User"}
          </Text>

          <Text
            style={{
              color: "#8E8E93",
              fontSize: 15,
              marginTop: 5,
            }}
          >
            @{user?.username || "username"}
          </Text>
          <View
  style={{
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  }}
>
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => router.back()}
    style={{
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff10",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.06)",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
      }}
    >
      Message
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    activeOpacity={0.85}
    style={{
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#478200",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
      }}
    >
     Themes
    </Text>
  </TouchableOpacity>
</View>
        </View>
</View>



    {/* ACTIONS */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
    paddingHorizontal: 48,
  }}
>
  <TopAction
    icon="person-outline"
    label="Profile"
    onPress={() =>
      router.push({
        pathname: "/user/[id]",
        params: {
          id: userId,
        },
      })
    }
  />

  <TopAction
    icon="search-outline"
    label="Search"
    disabled
  />

  <TopAction
    icon="notifications-outline"
    label="Mute"
    disabled
  />

  <TopAction
    icon="ellipsis-horizontal"
    label="Options"
    disabled
  />
</View>
      </View>

<Text
  style={{
    color: "#ffffffbf",
    textAlign: "center",
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 28,
    marginBottom: -10,
  }}
>
 More Conversation Settings Coming Soon
</Text>

      {/* MENU */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 45,
          paddingBottom: 50,
        }}
      >
        <MenuItem
          icon="timer-outline"
          title="Disappearing messages"
          subtitle="Off"
        />

        <MenuItem
          icon="lock-closed-outline"
          title="Privacy & safety"
        />

        <MenuItem
          icon="person-circle-outline"
          title="Nicknames"
        />

        <MenuItem
          icon="people-outline"
          title="Create a group chat"
        />
      </ScrollView>
    </View>
  );
}
const DISABLED_OPACITY = 0.45;

function TopAction({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
      onPress={onPress}
      style={{
        alignItems: "center",
        opacity: disabled
          ? DISABLED_OPACITY
          : 1,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#fff"
      />

      <Text
        style={{
          color: "#fff",
          marginTop: 10,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle?: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 34,
        opacity: 0.45,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#fff"
      />

      <View
        style={{
          marginLeft: 18,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={{
              color: "#8E8E93",
              fontSize: 15,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}