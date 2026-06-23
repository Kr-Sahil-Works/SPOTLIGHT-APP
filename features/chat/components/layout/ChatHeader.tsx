import { ChatTheme } from "@/constants/chatThemes";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import {
  Linking,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useAppToast } from "@/components/common/AppToast";
import ContactNumberModal from "@/components/modals/ContactNumberModal";
import useUser from "@/features/chat/hooks/useUser";
import useNetwork from "@/hooks/useNetwork";
import { useState } from "react";
import CallOptionsModal from "../modals/CallOptionsModal";


type Props = {
  userId: Id<"users">;
  onOpenTheme: () => void;
  theme: ChatTheme;
conversationId?: any;
  pinnedMessages?: any[];

onPinPress?: () => void;

onUnpin?: () => void;

conversation?: any;

currentUserId?: any;

};

export default function ChatHeader({
  userId,
  onOpenTheme,
  theme,
  onUnpin,
  pinnedMessages = [],
  onPinPress,

  conversation,
  currentUserId,
  conversationId,
}: Props) {
  const router = useRouter();

  const { showToast } =
  useAppToast();
  
const isOnline =
  useNetwork();
  const { user } = useUser(userId);

  const [showCallModal, setShowCallModal] = useState(false);

  const [
  showNumberModal,
  setShowNumberModal,
] = useState(false);

  const [
  showPinActions,
  setShowPinActions,
] = useState(false);

const [
  showUnpinConfirm,
  setShowUnpinConfirm,
] = useState(false);

const [
  showPinInfo,
  setShowPinInfo,
] = useState(false);

const getTargetNumber = () => {

  if (
    !conversation?.contactNumbers
      ?.length
  ) {
    return null;
  }

  const otherUserNumber =
    conversation.contactNumbers.find(
      (c: any) =>
        String(c.userId) !==
        String(currentUserId)
    )?.phone;

  if (otherUserNumber) {
    return otherUserNumber;
  }

  // TEMP FALLBACK
  return conversation
    .contactNumbers[0]?.phone;
};

const openWhatsApp = async () => {
  const targetNumber =
    getTargetNumber();

if (!targetNumber) {
  router.push({
    pathname:
      "/chat/profile/[userId]",
    params: {
      userId,
      conversationId,
      openContact: "true",
    },
  });

  return;
}

const phone =
  targetNumber.startsWith(
    "91"
  )
    ? targetNumber
    : `91${targetNumber}`;

const appUrl =
  `https://wa.me/${phone}`;

  const playStore =
    "market://details?id=com.whatsapp";

await Linking.openURL(appUrl);
};

const openInstagram = async () => {
  const appUrl =
    "instagram://direct/inbox";

  const playStore =
    "market://details?id=com.instagram.android";

  const supported =
    await Linking.canOpenURL(appUrl);

  if (supported) {
    await Linking.openURL(appUrl);
  } else {
    await Linking.openURL(playStore);
  }
};

const openTelegram = async () => {
  const targetNumber =
    getTargetNumber();

if (!targetNumber) {
  router.push({
    pathname:
      "/chat/profile/[userId]",
    params: {
      userId,
      conversationId,
      openContact: "true",
    },
  });
showToast(
  "Telegram requires username"
);
  return;
}

  const appUrl =
    `https://t.me/+91${targetNumber}`;

  await Linking.openURL(appUrl);
};

const openCallApp = async () => {
  const targetNumber =
    getTargetNumber();

 if (!targetNumber) {
  router.push({
    pathname:
      "/chat/profile/[userId]",
    params: {
      userId,
      conversationId,
      openContact: "true",
    },
  });

  return;
}

  await Linking.openURL(
    `tel:${targetNumber}`
  );
};


return (
  <>
    <View
      style={{
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "transparent",
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
          size={20}
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
  disabled={!isOnline}
  onPress={() =>
   router.push({
  pathname: "/chat/profile/[userId]",
  params: {
    userId,
    conversationId,
  },
})
  }
  style={{
    flexDirection: "row",
    alignItems: "center",
    opacity: isOnline
      ? 1
      : 0.45,
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
  allowDownscaling
  style={{
    width: 32,
    height: 32,
    borderRadius: 18,
  }}
/>

          <View
            style={{
              marginLeft: 8,
              maxWidth: 170,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#e8e8e8",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {user?.fullname || "Chat"}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "#999",
                fontSize: 10,
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
  disabled={!isOnline}
  style={{
    marginRight: 14,
    opacity: isOnline ? 1 : 0.35,
  }}
  onPress={() =>
    setShowCallModal(true)
  }
>
  <Ionicons
    name="call-sharp"
    size={20}
    color={
      isOnline
        ? theme.headerText
        : "#666"
    }
  />
</TouchableOpacity>

      {/* THEME BTN */}
     <TouchableOpacity
  disabled={!isOnline}
  style={{
    marginRight: 5,
    opacity:
      isOnline ? 1 : 0.35,
  }}
  onPress={onOpenTheme}
>
  <Image
    source={require("@/assets/images/icons/theme.webp")}
    style={{
      width: 22,
      height: 22,
      opacity:
        isOnline
          ? 0.92
          : 0.35,
    }}
contentFit="contain"
  />
</TouchableOpacity>
    </View>
{pinnedMessages.length >
  0 && (
  <TouchableOpacity
    activeOpacity={0.9}
   onPress={() => {
  onPinPress?.();
}}
    style={{
      backgroundColor:
        theme.header,

      borderBottomWidth: 1,

      borderBottomColor:
        "#ffffff10",

      paddingHorizontal: 14,

      paddingVertical: 10,

      flexDirection: "row",

      alignItems:
        "center",
    }}
  >
    <Ionicons
      name="pin"
      size={16}
      color="#00b7ff"
    />

    <Text
      numberOfLines={1}
      style={{
        flex: 1,

        marginLeft: 12,

        color: "#fff",

        fontSize: 13,
      }}
    >
      {
        pinnedMessages[0]
          ?.text
      }
    </Text>
  <View
  style={{
    flexDirection: "row",

    alignItems: "center",

    marginLeft: 10,
  }}
>
  <TouchableOpacity
onPress={() => {
  if (
    showPinActions
  ) {
    setShowUnpinConfirm(
      true
    );

    setTimeout(() => {
      setShowUnpinConfirm(
        false
      );
    }, 4500);

    return;
  }

  setShowPinActions(
    true
  );

  setTimeout(() => {
    setShowPinActions(
      false
    );
  }, 5000);

  if (
    showPinInfo
  ) {
    setShowPinInfo(
      false
    );
  }
}}
  >
    <Ionicons
      name={
        showPinActions
          ? "remove-circle"
          : "options-outline"
      }
      size={18}
      style= {
        {
         marginRight: 12, 
        }
      }
      color={
        showPinActions
          ? "#ff4d4f"
          : "#fff"
      }
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      setShowPinInfo(
        (p) => !p
      );

      if (
        showPinActions
      ) {
        setShowPinActions(
          false
        );
      }

      if (
        !showPinInfo
      ) {
        setTimeout(() => {
          setShowPinInfo(
            false
          );
        }, 8000);
      }
    }}
  >
    <Ionicons
      name="information-circle-outline"
      size={18}
      color="#8e8e93"
    />
  </TouchableOpacity>
</View>
  </TouchableOpacity>
)}

{showUnpinConfirm && (
  <View
    style={{
      position:
        "absolute",

      top: 102,

      alignSelf:
        "center",

      zIndex: 9999,

      backgroundColor:
        "rgba(120,0,0,0.72)",

      borderWidth: 1,

      borderColor:
        "#ff4d4f55",

      paddingHorizontal: 14,

      paddingVertical: 12,

      borderRadius: 18,

      flexDirection: "row",

      alignItems:
        "center",

      shadowColor:
        "#ff4d4f",

      shadowOpacity: 0.25,

      shadowRadius: 12,

      elevation: 10,

      backdropFilter:
        "blur(20px)",
    }}
  >
    <Text
      style={{
        color: "#fff",

        fontSize: 12,

        marginRight: 14,

        fontWeight: "600",
      }}
    >
      Remove pinned
      message?
    </Text>

    <TouchableOpacity
      onPress={async () => {
        setShowUnpinConfirm(
          false
        );

        setShowPinActions(
          false
        );

        await onUnpin?.();
      }}
      style={{
        backgroundColor:
          "#ff4d4f",

        paddingHorizontal: 10,

        paddingVertical: 5,

        borderRadius: 999,
      }}
    >
      <Text
        style={{
          color: "#fff",

          fontSize: 11,

          fontWeight: "700",
        }}
      >
        Remove
      </Text>
    </TouchableOpacity>
  </View>
)}

{showPinInfo && (
  <TouchableOpacity
    activeOpacity={0.95}
    onPress={() =>
      setShowPinInfo(
        false
      )
    }
    style={{
      backgroundColor:
        "#111",

      marginHorizontal: 12,

      marginTop: 8,

      paddingHorizontal: 16,

      paddingVertical: 15,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        "#ffffff10",

      minHeight: 95,
    }}
  >
    <Text
      style={{
        color: "#ddd",

        fontSize: 12,

        lineHeight: 20,
      }}
    >
      Only one message
      can be pinned at a
      time. Pinning a
      new message
      replaces the old
      pinned message.

      {"\n\n"}

      Tap the pinned
      message bar to
      jump directly to
      that message.
    </Text>
  </TouchableOpacity>
)}
   <CallOptionsModal
  visible={showCallModal}
  onClose={() =>
    setShowCallModal(false)
  }

  onWhatsApp={openWhatsApp}

  onInstagram={openInstagram}

  onTelegram={openTelegram}

  onCall={openCallApp}
/>

<ContactNumberModal
  visible={
    showNumberModal
  }
  onClose={() =>
    setShowNumberModal(
      false
    )
  }
  initialValue=""
  onSave={async (
    phone
  ) => {
    router.push({
      pathname:
        "/chat/profile/[userId]",

      params: {
        userId,
        conversationId,
      },
    });

    setShowNumberModal(
      false
    );
  }}
/>
  </>
);
}