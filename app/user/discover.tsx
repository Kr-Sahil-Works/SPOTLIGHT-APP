import { Loader } from "@/components/LoaderSkeletons/Loader";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, {
  useMemo,
  useState,
} from "react";

import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DiscoverPage() {
  const router = useRouter();

  const users = useQuery(
    api.users.index.getAllUsers
  );

  const currentUser = useQuery(
  api.users.index.getCurrentUser
);

  const [search, setSearch] =
    useState("");

const toggleFollow = useMutation(
  api.users.index.toggleFollow
);

const [toast, setToast] =
  useState<{
    text: string;
    color: string;
  } | null>(null);

const showToast = (
  text: string,
  color: string
) => {
  setToast({
    text,
    color,
  });

  setTimeout(() => {
    setToast(null);
  }, 1800);
};
  if (!users) {
    return <Loader />;
  }

  const filtered =
    useMemo(() => {
      return users.filter(
        (u: any) => {
          const q =
            search.toLowerCase();

          return (
            u?.username
              ?.toLowerCase()
              .includes(q) ||
            u?.fullname
              ?.toLowerCase()
              .includes(q)
          );
        }
      );
    }, [users, search]);
const [localFollowing, setLocalFollowing] =
  useState<Record<string, boolean>>(
    {}
  );
  return (
    <SafeAreaView
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
          paddingVertical: 14,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "800",
            marginLeft: 16,
          }}
        >
          Discover
        </Text>
      </View>

      {/* SEARCH */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              "#1c1c1e",
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="#888"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search users"
            placeholderTextColor="#777"
            style={{
              flex: 1,
              color: "#fff",
              marginLeft: 10,
              fontSize: 16,
            }}
          />
        </View>
      </View>

      {toast && (
  <View
    style={{
      position: "absolute",

     bottom: 60,

      alignSelf: "center",

      zIndex: 999,

backgroundColor:
  toast.color + "EE",
  borderWidth: 1,
borderColor: "#ffffff18",

      paddingHorizontal: 18,

      paddingVertical: 12,

      borderRadius: 18,

      shadowColor:
        toast.color,

      shadowOpacity: 0.25,

      shadowRadius: 10,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 6,
    }}
  >
    <Text
      style={{
        color: "#fff",

        fontWeight: "700",

        fontSize: 13,
      }}
    >
      {toast.text}
    </Text>
  </View>
)}


      <FlatList
        data={filtered}
        keyExtractor={(
          item,
          index
        ) =>
          item?._id ||
          index.toString()
        }
        renderItem={({
          item,
        }: any) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname:
                  "/user/[id]",
                params: {
                  id: item._id,
                },
              })
            }
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
        <Image
  source={
    item?.image?.trim()
      ? { uri: item.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  cachePolicy="memory-disk"
  transition={120}
  style={{
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#111",
  }}
/>

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight:
                    "700",
                  fontSize: 15,
                }}
              >
                {item?.username}
              </Text>

              {!!item?.fullname && (
                <Text
                  style={{
                    color:
                      "#888",
                    marginTop: 2,
                  }}
                >
                  {
                    item?.fullname
                  }
                </Text>
              )}
            </View>

      <TouchableOpacity
  activeOpacity={0.8}
  onPress={async () => {
    try {
      const result =
        await toggleFollow({
          followingId:
            item._id,
        });

if (result === "followed") {
  setLocalFollowing((p) => ({
    ...p,
    [item._id]: true,
  }));

  showToast(
    "Following",
    "#22c55e"
  );
}

if (result === "unfollowed") {
  setLocalFollowing((p) => ({
    ...p,
    [item._id]: false,
  }));

  showToast(
    "Unfollowed",
    "#ef4444"
  );
}} catch (e) {}
  }}
  style={{
    backgroundColor:
(localFollowing[item._id] ??
item?.isFollowing)
        ? "#2d2d2d"
        : "#5865F2",

    paddingHorizontal: 18,

    height: 38,

    borderRadius: 10,

    alignItems: "center",

    justifyContent:
      "center",
  }}
>
  <Text
    style={{
      color: "#fff",
      fontWeight: "700",
    }}
  >
   {
  (
    localFollowing[item._id] ??
    item?.isFollowing
  )
    ? "Following"
    : "Follow"
}
  </Text>
</TouchableOpacity>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={
          false
        }
        removeClippedSubviews
        windowSize={8}
        initialNumToRender={12}
        maxToRenderPerBatch={
          10
        }
      />
    </SafeAreaView>
  );
}