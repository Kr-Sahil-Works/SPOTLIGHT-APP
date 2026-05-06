import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
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

const TRAY_HEIGHT = height * 0.6;
const COLLAPSED_OFFSET = TRAY_HEIGHT - 140;

export default function SuggestionTray({ users = [], forceOpen }: any) {
  const [open, setOpen] = useState(false);
const [shuffledUsers, setShuffledUsers] = useState<any[]>([]);

  const router = useRouter();

  const createConversation = useMutation(
    api.conversations.index.createConversation
  );

  const translateY = useRef(
    new Animated.Value(COLLAPSED_OFFSET)
  ).current;

  // 👉 shuffle when open
  useEffect(() => {
    if (open) {
      const shuffled = [...users]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20); // optimize
      setShuffledUsers(shuffled);
    }
  }, [open, users]);

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
        backgroundColor: "#0b0f0c",
        borderTopLeftRadius: 24,
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
              color: "#22c55e",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Find People
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggle}>
          <Ionicons
            name={open ? "chevron-down" : "chevron-up"}
            size={22}
            color="#22c55e"
          />
        </TouchableOpacity>
      </View>

      {/* LIST + BLUR OVERLAY */}
      <View style={{ flex: 1 }}>
        {/* 👇 BLUR ONLY WHEN COLLAPSED */}
        {!open && (
          <BlurView
            intensity={0}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />
        )}

        <FlatList
          data={open ? shuffledUsers : users.slice(0, 3)}
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
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
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
                      backgroundColor: "#22c55e",
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
                <Text style={{ color: "#666", fontSize: 12 }}>
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