import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {/* PROFILE */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={
              user?.image
                ? { uri: user.image }
                : require("@/assets/images/iconbg.png")
            }
            style={{
              width: 86,
              height: 86,
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
          />

          <TopAction
            icon="search-outline"
            label="Search"
          />

          <TopAction
            icon="notifications-outline"
            label="Mute"
          />

          <TopAction
            icon="ellipsis-horizontal"
            label="Options"
          />
        </View>
      </View>

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
          icon="color-palette"
          title="Theme"
          subtitle="Love"
        />

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

function TopAction({
  icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        alignItems: "center",
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
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 34,
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