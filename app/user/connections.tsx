import { Loader } from "@/components/loaders/Loader";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import React, {
    useMemo,
    useRef,
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

import {
    Platform,
} from "react-native";

let PagerView: any;

if (
  Platform.OS !== "web"
) {
  PagerView =
    require(
      "react-native-pager-view"
    ).default;
}

export default function ConnectionsPage() {
  const router = useRouter();

  const pagerRef = useRef<any>(null);

  const {
    userId,
    initialTab,
  } = useLocalSearchParams<{
    userId: string;
    initialTab:
      | "followers"
      | "following";
  }>();

  const [tab, setTab] = useState(
    initialTab === "following"
      ? 1
      : 0
  );

  const [search, setSearch] =
    useState("");

  const followers = useQuery(
    api.users.index.getFollowUsers,
    {
      userId: userId as any,
      type: "followers",
    }
  );

  const following = useQuery(
    api.users.index.getFollowUsers,
    {
      userId: userId as any,
      type: "following",
    }
  );

  const currentUser = useQuery(
    api.users.index.getCurrentUser
  );

  const createConversation =
    useMutation(
      api.conversations.index
        .createConversation
    );

const filterUsers = (
  arr: any[] = []
) => {
  return arr.filter((u) => {
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
  });
};

  const followerFiltered =
    useMemo(
      () => filterUsers(followers),
      [followers, search]
    );

  const followingFiltered =
    useMemo(
      () => filterUsers(following),
      [following, search]
    );

  if (
    !followers ||
    !following ||
    !currentUser
  ) {
    return <Loader />;
  }

  const renderUser = ({
    item,
  }: any) => {
    const isConnected =
      followers.some(
        (u) => u?._id === item?._id
      ) ||
      following.some(
        (u) => u?._id === item?._id
      );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/user/[id]",
            params: {
              id: item?._id,
            },
          })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
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
    width: 54,
    height: 54,
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
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {item?.username}
          </Text>

          {!!item?.fullname && (
            <Text
              style={{
                color: "#888",
                marginTop: 2,
              }}
            >
              {item?.fullname}
            </Text>
          )}
        </View>

        {isConnected ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              await createConversation({
                userId: item._id,
              });

              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item._id,
                },
              });
            }}
            style={{
              backgroundColor: "#2a2d35",
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
                fontWeight: "600",
              }}
            >
              Message
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor:
                "#5865F2",
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
              Follow
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

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
          justifyContent:
            "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
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
              size={26}
              color="#fff"
            />
          </TouchableOpacity>

          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "800",
              marginLeft: 16,
            }}
          >
            Connections
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/user/discover"
            )
          }
        >
          <Ionicons
            name="person-add-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor:
            "#161616",
        }}
      >
        {[
          "Followers",
          "Following",
        ].map((t, i) => {
          const active = tab === i;

          return (
            <TouchableOpacity
              key={t}
              activeOpacity={0.8}
              onPress={() => {
                setTab(i);

                pagerRef.current?.setPage(
                  i
                );
              }}
              style={{
                flex: 1,
                alignItems:
                  "center",
                paddingVertical: 14,
                borderBottomWidth:
                  active
                    ? 2
                    : 0,
                borderBottomColor:
                  "#fff",
              }}
            >
              <Text
                style={{
                  color: active
                    ? "#fff"
                    : "#777",
                  fontWeight:
                    "700",
                  fontSize: 16,
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SEARCH */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 8,
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
            placeholder="Search"
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

      {/* PAGER */}
 {/* PAGER */}

{Platform.OS ===
"web" ? (
  <View style={{ flex: 1 }}>
    <FlatList
      data={
        tab === 0
          ? followerFiltered
          : followingFiltered
      }
      renderItem={
        renderUser
      }
      keyExtractor={(
        item,
        index
      ) =>
        item?._id ||
        index.toString()
      }
      showsVerticalScrollIndicator={
        false
      }
    />
  </View>
) : (
  <PagerView
    ref={pagerRef}
    style={{ flex: 1 }}
    initialPage={
      initialTab ===
      "following"
        ? 1
        : 0
    }
    onPageSelected={(
  e: any
) =>
      setTab(
        e.nativeEvent
          .position
      )
    }
  >
    {/* FOLLOWERS */}
    <View key="1">
      <FlatList
        data={
          followerFiltered
        }
        renderItem={
          renderUser
        }
        keyExtractor={(
          item,
          index
        ) =>
          item?._id ||
          index.toString()
        }
        showsVerticalScrollIndicator={
          false
        }
      />
    </View>

    {/* FOLLOWING */}
    <View key="2">
      <FlatList
        data={
          followingFiltered
        }
        renderItem={
          renderUser
        }
        keyExtractor={(
          item,
          index
        ) =>
          item?._id ||
          index.toString()
        }
        showsVerticalScrollIndicator={
          false
        }
      />
    </View>
  </PagerView>
)}
    </SafeAreaView>
  );
}