import EmptyCenter from "@/components/EmptyCenter";
import FeedSkeleton from "@/components/LoaderSkeletons/FeedSkeleton"; // ✅ USE THIS
import Post from "@/components/Post";
import StoriesSection from "@/components/story/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/feed.styles";

export default function Index() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const listRef = useRef<any>(null);

  const [swipeEnabled, setSwipeEnabled] = useState(true);



  // ✅ FIXED QUERY
const posts = useQuery(
  api.posts.index.getFeedPosts,
  isSignedIn ? {} : "skip"
);
  // ✅ CACHE (PREVENT BLANK UI)
  const [cachedPosts, setCachedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setCachedPosts(posts);
    }
  }, [posts]);

  const unreadCount =
    useQuery(api.notifications.getUnreadCount, isSignedIn ? {} : "skip") ?? 0;

const [refreshing, setRefreshing] = useState(false);
const [storiesRefreshKey, setStoriesRefreshKey] = useState(0);
const [showRefreshSkeleton, setShowRefreshSkeleton] = useState(false);


const onRefresh = async () => {
  setRefreshing(true);

  setShowRefreshSkeleton(true);

  setStoriesRefreshKey((p) => p + 1);

  await new Promise((r) =>
    setTimeout(r, 900)
  );

  setShowRefreshSkeleton(false);

  setRefreshing(false);
};



  if (!isSignedIn) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  // ✅ FINAL DATA (NO BLANK STATE)
  const finalPosts = posts ?? cachedPosts;

  return (
    <View style={styles.container}>
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight</Text>

        {/* ❤️ NOTIFICATIONS */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <Animated.View
            style={{
              borderRadius: 12,
              backgroundColor: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  "rgba(255,255,255,0.05)",
                  "rgba(255,255,255,0.18)",
                ],
              }),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/notifications")}
              style={{ padding: 8 }}
            >
              <View style={{ position: "relative" }}>
                <Ionicons name="heart-outline" size={22} color="#fff" />

                {unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: "#00ff6a",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#000", fontSize: 10 }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* 🔥 CONTENT */}
{posts === undefined && cachedPosts.length === 0 ? (
  <FeedSkeleton />
) : showRefreshSkeleton ? (
  <FeedSkeleton />
) : finalPosts.length === 0 ? (
  <NoPostsFound />
) : (
    
        <FlashList
          ref={listRef}
          data={finalPosts}
          drawDistance={600}
          removeClippedSubviews
          renderItem={({ item }) => (
  <Post post={item} />
)}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListHeaderComponent={
       <StoriesSection
  refreshKey={storiesRefreshKey}
  setSwipeEnabled={setSwipeEnabled}
/>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </View>
  );
}

/* ========================= */

const NoPostsFound = () => {
  const router = useRouter();

  return (
    <EmptyCenter>
      <View style={{ alignItems: "center" }}>
        <Ionicons name="image-outline" size={40} color="#666" />
        <Text style={{ marginTop: 20, fontSize: 20, color: "#fff" }}>
          No posts yet
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/create")}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
          }}
        >
          <Text style={{ color: "#000" }}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </EmptyCenter>
  );
};