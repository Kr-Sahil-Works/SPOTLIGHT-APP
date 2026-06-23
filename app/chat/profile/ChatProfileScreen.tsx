import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ContactNumberModal from "@/components/modals/ContactNumberModal";
import { api } from "@/convex/_generated/api";
import useUser from "@/features/chat/hooks/useUser";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

type Props = {
  userId: Id<"users">;
  conversationId: Id<"conversations">;

  onOpenTheme?: () => void;
};


export default function ChatProfileScreen({
  userId,
  conversationId,
  onOpenTheme,
}: Props){
  const router = useRouter();

  const { user } = useUser(userId);

  const { openContact } =
  useLocalSearchParams();

  useEffect(() => {
  if (
    openContact ===
    "true"
  ) {
    setShowContactModal(
      true
    );
  }
}, [openContact]);

  const currentUser =
  useQuery(
    api.users.index
      .getCurrentUser
  );

const conversation =
  useQuery(
    api.conversations.index
      .getConversation,
    {
      conversationId,
    }
  );

const saveContactNumber =
  useMutation(
    api.conversations.index
      .saveContactNumber
  );

  const [
  showContactModal,
  setShowContactModal,
] = useState(false);

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
  onPress={() =>
    router.back()
  }
>
    <Ionicons
      name="arrow-back"
      size={22}
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
  onPress={onOpenTheme}
    style={{
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#111",
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

  <TouchableOpacity
  activeOpacity={0.85}
  onPress={() =>
    router.push(
      `/user/${String(userId)}`
    )
  }
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
    Profile
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

      {/* MENU */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 45,
          paddingBottom: 50,
        }}
      >
<TouchableOpacity
  onPress={() =>
    setShowContactModal(
      true
    )
  }
>
  <MenuItem
    icon="call-outline"
    title="Contact Number"
    subtitle={
      conversation
        ?.contactNumbers?.find(
          (
            c: any
          ) =>
            String(
              c.userId
            ) ===
            String(
              currentUser?._id
            )
        )?.phone ||
      "WhatsApp, Telegram & Calls"
    }
  />
</TouchableOpacity>

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

      <ContactNumberModal
  visible={
    showContactModal
  }
  onClose={() =>
    setShowContactModal(
      false
    )
  }
  onRemove={async () => {
  await saveContactNumber({
    conversationId,
    phone: "",
  });

  setShowContactModal(
    false
  );
}}
  initialValue={
    conversation
      ?.contactNumbers?.find(
        (c: any) =>
          String(
            c.userId
          ) ===
          String(
            currentUser?._id
          )
      )?.phone || ""
  }
  onSave={async (
    phone
  ) => {
    await saveContactNumber(
      {
        conversationId,
        phone,
      }
    );

    setShowContactModal(
      false
    );
  }}
/>

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
        opacity:
  title ===
  "Contact Number"
    ? 1
    : 0.45,
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