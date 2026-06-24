import { Loader } from "@/components/loaders/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ProfileTabs from "@/features/profile/tabs/ProfileTabs";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function UserProfileScreen() {

  const [showAvatarModal, setShowAvatarModal] =
  React.useState(false);

const screenWidth =
  Dimensions.get("window").width;

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] =
  React.useState("grid");

const tabIndex =
  React.useRef(
    new Animated.Value(0)
  ).current;

  const [selectedPost,
  setSelectedPost] =
  React.useState<any>(
    null
  );

const [tabLayouts,
  setTabLayouts] =
  React.useState<any[]>([]);

  const switchTab = (
  index: number
) => {
  Animated.spring(
    tabIndex,
    {
      toValue: index,
      useNativeDriver: false,
    }
  ).start();

  setActiveTab(
    ["grid",
     "reels",
     "tags"][index]
  );
};

const profile = useQuery(
  api.users.index.getUser,
  {
    userId: id as Id<"users">,
  }
);
  const posts = useQuery(api.posts.index.getPostsByUser, { userId: id as Id<"users"> });
  const isFollowing = useQuery(api.users.index.isFollowing, { followingId: id as Id<"users"> });
const createConversation =
  useMutation(
    api.conversations.index
      .createConversation
  );
  const toggleFollow = useMutation(api.users.index.toggleFollow);

const handleMessage =
  async () => {
    try {
      await createConversation({
        userId:
          id as Id<"users">,
      });

      router.push(
        `/chat/${id}`
      );
    } catch (e) {
      console.log(e);
    }
  };


  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />;

  return (
    <View style={styles.container}>
<View style={styles.header}>
  <TouchableOpacity onPress={handleBack}>
    <Ionicons
      name="arrow-back"
      size={28}
      color="#ffffff"
    />
  </TouchableOpacity>

<Text
  numberOfLines={1}
  style={[
    styles.username,
    {
      flex: 1,
      marginLeft: 14,
      color: "#fff",
      fontWeight: "700",
    },
  ]}
>
    {profile.username}
  </Text>

  <View
  style={{
    flexDirection: "row",
    gap: 18,
    opacity: 0.75,
  }}
>
    <TouchableOpacity disabled>
      <Ionicons
        name="notifications-outline"
        size={24}
      color="rgba(255,255,255,0.65)"
      />
    </TouchableOpacity>

    <TouchableOpacity disabled>
      <Ionicons
        name="ellipsis-vertical"
        size={22}
        color="rgba(255,255,255,0.65)"
      />
    </TouchableOpacity>
  </View>
</View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            {/* AVATAR */}
{profile.image && (
  <TouchableOpacity
    activeOpacity={0.9}
    onLongPress={() =>
      setShowAvatarModal(true)
    }
  >
  <Image
  source={
    profile?.image?.trim()
      ? { uri: profile.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.avatar}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
  </TouchableOpacity>
)}

            {/* STATS */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

         {/* <Pressable
  android_ripple={{
    color: "rgba(255,255,255,0.06)",
  }}
style={[
  {
    marginTop: 18,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isFollowing
      ? "#0f0f0f"
      : "#166534",
    borderWidth: 1,
    borderColor: isFollowing
      ? "rgba(255,255,255,0.06)"
      : "rgba(34,197,94,0.25)",
  },
]}
  onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
>
<Text
  style={{
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  }}
>
  {isFollowing ? "Following" : "Follow"}
</Text>
          </Pressable> */}


          <View
  style={{
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  }}
>
  <Pressable
    android_ripple={{
      color: "rgba(255,255,255,0.06)",
    }}
    style={{
      flex: 1,
      height: 50,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isFollowing
        ? "#0f0f0f"
        : "#01953a",
      borderWidth: 1,
      borderColor: isFollowing
        ? "rgba(255,255,255,0.06)"
        : "rgba(34,197,94,0.25)",
    }}
    onPress={() =>
      toggleFollow({
        followingId: id as Id<"users">,
      })
    }
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
      }}
    >
      {isFollowing
        ? "Following"
        : "Follow"}
    </Text>
  </Pressable>

  <TouchableOpacity
    activeOpacity={0.85}
    onPress={handleMessage}
    style={{
      flex: 1,
      height: 50,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#222",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.06)",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
      }}
    >
      Message
    </Text>
  </TouchableOpacity>
</View>
        </View>
<ProfileTabs
  activeTab={activeTab}
  switchTab={switchTab}
  tabLayouts={tabLayouts}
  setTabLayouts={setTabLayouts}
  tabIndex={tabIndex}
/>
        <View style={{ paddingTop: 10 }}>
          {posts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
               <TouchableOpacity
  style={styles.gridItem}
 onPress={() => {
  router.push({
    pathname:
      "/posts/[userId]",

    params: {
      userId: item.userId,
      postId: item._id,
    },
  });
}}

onLongPress={() =>
  setSelectedPost(item)
}

delayLongPress={600}
>
<Image
  source={
    item.imageUrl?.trim()
      ? { uri: item.imageUrl }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.gridImage}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
</TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      </ScrollView>
      <Modal
  visible={showAvatarModal}
  transparent
  animationType="fade"
  statusBarTranslucent
>
  <Pressable
    onPress={() =>
      setShowAvatarModal(false)
    }
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.94)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* CLOSE */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        setShowAvatarModal(false)
      }
      style={{
        position: "absolute",
        top: 60,
        right: 24,
        zIndex: 20,
      }}
    >
      <Ionicons
        name="close"
        size={30}
        color="#fff"
      />
    </TouchableOpacity>

    {/* IMAGE */}
    <View
      style={{
        width: screenWidth * 0.82,
        height: screenWidth * 0.82,
        borderRadius: 999,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor:
          "rgba(255,255,255,0.08)",
        backgroundColor: "#111",
      }}
    >
   <Image
  source={
    profile?.image?.trim()
      ? { uri: profile.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={{
    width: "100%",
    height: "100%",
  }}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
    </View>

    {/* NAME */}
    <Text
      style={{
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginTop: 24,
      }}
    >
      {profile.fullname}
    </Text>

    {!!profile.bio && (
      <Text
        style={{
          color: "rgba(255,255,255,0.68)",
          fontSize: 14,
          marginTop: 8,
          textAlign: "center",
          paddingHorizontal: 36,
        }}
      >
        {profile.bio}
      </Text>
    )}
  </Pressable>
</Modal>
<Modal
  visible={!!selectedPost}
  transparent
  animationType="fade"
  statusBarTranslucent
>
  <Pressable
    onPress={() =>
      setSelectedPost(null)
    }
    style={{
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.94)",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <TouchableOpacity
      onPress={() =>
        setSelectedPost(null)
      }
      style={{
        position:
          "absolute",

        top: 60,
        right: 24,

        zIndex: 20,
      }}
    >
      <Ionicons
        name="close"
        size={30}
        color="#fff"
      />
    </TouchableOpacity>

    <Image
      source={{
        uri:
          selectedPost?.imageUrl,
      }}
      style={{
        width: "92%",
        aspectRatio: 1,
        borderRadius: 20,
      }}
      contentFit="contain"
    />

    {!!selectedPost?.caption && (
      <Text
        style={{
          color: "#fff",

          marginTop: 20,

          textAlign:
            "center",

          paddingHorizontal:
            24,
        }}
      >
        {selectedPost.caption}
      </Text>
    )}
  </Pressable>
</Modal>
    </View>
  );
}