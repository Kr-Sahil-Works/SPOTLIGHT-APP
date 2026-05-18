import { ChatTheme } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import useUser from "@/app/chat/hooks/useUser";
import { useState } from "react";
import CallOptionsModal from "../modals/CallOptionsModal";

type Props = {
  userId: Id<"users">;
  onOpenTheme: () => void;
  theme: ChatTheme;
};

export default function ChatHeader({
  userId,
  onOpenTheme,
  theme,
}: Props) {
  const router = useRouter();

  const { user } = useUser(userId);

  const [showCallModal, setShowCallModal] = useState(false);

  

const openWhatsApp = async () => {
  try {
    await Linking.openURL(
      "https://wa.me/919999999999"
    );
  } catch (e) {
    await Linking.openURL(
      "market://details?id=com.whatsapp"
    );
  }
};

const openInstagram = async () => {
  const appUrl =
    "instagram://direct/inbox";

  const playStore =
    "market://details?id=com.instagram.android";

  const supported = await Linking.canOpenURL(appUrl);

  if (supported) {
    await Linking.openURL(appUrl);
  } else {
    await Linking.openURL(playStore);
  }
};

const openTelegram = async () => {
  const appUrl = "tg://msg";

  const playStore =
    "market://details?id=org.telegram.messenger";

  const supported = await Linking.canOpenURL(appUrl);

  if (supported) {
    await Linking.openURL(appUrl);
  } else {
    await Linking.openURL(playStore);
  }
};

const openCallApp = async () => {
  await Linking.openURL("content://contacts/people/");
};


return (
  <>
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderColor: "#222",
        backgroundColor: theme.header,
      }}
    >
      {/* BACK */}
      <TouchableOpacity
  onPress={() => router.back()}
  hitSlop={{
    top: 16,
    bottom: 16,
    left: 6,
    right: 14,
  }}
  style={{
    width: 42,

    height: 42,

    justifyContent: "center",

    alignItems: "center",
  }}
>
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.headerText}
        />
      </TouchableOpacity>

      {/* PROFILE AREA */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/chat-profile",
              params: {
                userId,
              },
            })
          }
          style={{
            flexDirection: "row",
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
              width: 36,
              height: 36,
              borderRadius: 18,
              marginLeft: 14,
            }}
          />

          <View
            style={{
              marginLeft: 10,
              maxWidth: 170,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {user?.fullname || "Chat"}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "#999",
                fontSize: 12,
                marginTop: 1,
              }}
            >
              @{user?.username || "username"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CALL BTN */}
      <TouchableOpacity
        style={{ marginRight: 14 }}
        onPress={() => setShowCallModal(true)}
      >
 <Ionicons
  name="call-sharp"
  size={22}
  color={theme.headerText}
/>
      </TouchableOpacity>

      {/* THEME BTN */}
      <TouchableOpacity
        style={{ marginRight: 5 }}
        onPress={onOpenTheme}
      >
     <Image
  source={require("@/assets/images/icons/theme.png")}
  style={{
    width: 24,
    height: 24,
    opacity: 0.92
  }}
  resizeMode="contain"
/>
      </TouchableOpacity>
    </View>

    <CallOptionsModal
  visible={showCallModal}
  onClose={() => setShowCallModal(false)}
/>
  </>
);
}