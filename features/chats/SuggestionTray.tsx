import useChatListTheme from "@/hooks/useChatListTheme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const TRAY_HEIGHT = height * 0.52;
const COLLAPSED_OFFSET = TRAY_HEIGHT - 140;

export default function SuggestionTray({ users = [], forceOpen }: any) {
  const [open, setOpen] = useState(false);
const [shuffledUsers, setShuffledUsers] = useState<any[]>([]);

  const router = useRouter();

  const theme =
  useChatListTheme();

  const translateY = useRef(
    new Animated.Value(COLLAPSED_OFFSET)
  ).current;

  const shuffleUsers = () => {
  const shuffled = [...users]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  setShuffledUsers(shuffled);
};

useEffect(() => {
  shuffleUsers();
}, [users]);


useEffect(() => {
  if (forceOpen) {
    console.log("FORCE OPEN TRAY");

    translateY.setValue(COLLAPSED_OFFSET); // reset first

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
    }).start();

    setOpen(true);
  }
}, [forceOpen]);

  const toggle = () => {
    Animated.spring(translateY, {
      toValue: open ? COLLAPSED_OFFSET : 0,
      useNativeDriver: true,
      damping: 20,
    }).start();

    setOpen(!open);
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: TRAY_HEIGHT,
        transform: [{ translateY }],
        backgroundColor:
  theme.cardBg,
        borderTopLeftRadius: 24,
        borderTopWidth: 1,

borderColor:
  theme.cardBorder,
        borderTopRightRadius: 24,
        overflow: "hidden",
        paddingTop: 10,
        paddingBottom: 12,
      }}
    >
      {/* HANDLE */}
      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: "#444",
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
      </TouchableOpacity>

      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={toggle} style={{ flex: 1 }}>
          <Text
            style={{
              color:
  theme.headerColor ??
  "#22c55e",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Find People
          </Text>
        </TouchableOpacity>

     <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  }}
>
  <TouchableOpacity
    disabled={
      users.length < 20
    }
    onPress={shuffleUsers}
    style={{
      opacity:
        users.length < 20
          ? 0.35
          : 1,
    }}
  >
    <Ionicons
      name="refresh"
      size={18}
      color={
        theme.headerColor ??
        "#22c55e"
      }
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={toggle}
  >
    <Ionicons
      name={
        open
          ? "chevron-down"
          : "chevron-up"
      }
      size={22}
      color={
        theme.headerColor ??
        "#22c55e"
      }
    />
  </TouchableOpacity>
</View>
      </View>

      {/* LIST + BLUR OVERLAY */}
      <View style={{ flex: 1 }}>
        <View
  pointerEvents="none"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: open
      ? "transparent"
      : "#00000094",
    zIndex: 1,
  }}
/>
        <FlatList
        initialNumToRender={8}
maxToRenderPerBatch={8}
windowSize={5}
removeClippedSubviews
          data={
  open
    ? shuffledUsers
    : shuffledUsers.slice(0, 3)
}
          keyExtractor={(i) => i._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
         <TouchableOpacity
  activeOpacity={0.7}
  onPress={() => {
  router.push({
  pathname: "/chat/[id]",
  params: { id: item._id },
});
  }}
  style={{
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
  }}
>
              {/* AVATAR */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: "#1f2937",
                  marginRight: 12,
                }}
              >
                {item.image ? (
                <Image
  source={
    item.image?.trim()
      ? { uri: item.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={{ width: "100%", height: "100%" }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={120}
/>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff" }}>
                      {item.fullname?.[0] || "U"}
                    </Text>
                  </View>
                )}

                {item.isOnline && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor:
  theme.glow ??
  theme.headerColor ??
  "#22c55e",
                      borderWidth: 2,
                      borderColor: "#0b0f0c",
                    }}
                  />
                )}
              </View>

              {/* INFO */}
              <View>
                <Text style={{ color: "#fff", fontWeight: "500" }}>
                  {item.fullname}
                </Text>
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  @{item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Animated.View>
  );
}