import EmptyCenter from "@/components/common/EmptyCenter";
import FeedSkeleton from "@/components/loaders/FeedSkeleton"; // ✅ USE THIS
import Post from "@/components/Post";
import StoriesSection from "@/components/story/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import {
  setFeedRefresh,
} from "@/lib/feedRefresh";

import {
  getFeedCache,
  saveFeedCache,
} from "@/lib/cache/feedCache";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import WelcomeModal from "@/components/modals/WelcomeModal";
import { storage } from "@/lib/mmkv";
import { useUser } from "@clerk/clerk-expo";

import CommentsModal from "@/components/modals/CommentsModal";
import LikesModal from "@/components/modals/LikesModal";
import useNetwork from "@/hooks/useNetwork";
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
  const isOnline =
  useNetwork();
  const router = useRouter();

  const { user } =
  useUser();

const [
  showWelcome,
  setShowWelcome,
] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const listRef = useRef<any>(null);

  const [swipeEnabled, setSwipeEnabled] = useState(true);



  // ✅ FIXED QUERY
const posts = useQuery(
  api.posts.index.getFeedPosts,
  isSignedIn ? {} : "skip"
);

useEffect(() => {
  const seen =
    storage.getBoolean(
      "welcome_card_seen"
    );

  if (!seen) {
    const timer =
      setTimeout(() => {
        setShowWelcome(
          true
        );
      }, 800);

    return () =>
      clearTimeout(
        timer
      );
  }
}, []);

  // ✅ CACHE (PREVENT BLANK UI)
  const [cachedPosts, setCachedPosts] = useState<any[]>([]);


useEffect(() => {
  const cached =
    getFeedCache();

  if (
    Array.isArray(cached) &&
    cached.length > 0
  ) {
    setCachedPosts(cached);

    setFeedReady(true);
  }
}, []);

  const [feedPosts, setFeedPosts] =
  useState<any[]>([]);

  const initializedRef =
  useRef(false);

  const [feedReady, setFeedReady] =
  useState(false);

useEffect(() => {
  if (!posts?.length) {
    return;
  }

  setCachedPosts(posts);

  saveFeedCache(posts);

const topFive =
  [...posts].slice(
    0,
    5
  );

const rest =
  posts.slice(5);

if (
  !initializedRef.current
) {
  const shuffledTop =
    [...topFive].sort(
      () =>
        Math.random() -
        0.5
    );
setFeedPosts([
  ...shuffledTop,
  ...rest,
]);

initializedRef.current =
  true;

setFeedReady(true);
}
}, [posts]);

useEffect(() => {
  if (
    !posts?.length ||
    !initializedRef.current
  ) {
    return;
  }
  setFeedPosts(
    current =>
      current.map(
        item =>
          posts.find(
            p =>
              p._id ===
              item._id
          ) ?? item
      )
  );
}, [posts]);

  // ✅ FINAL DATA (NO BLANK STATE)
const finalPosts =
  posts && posts.length > 0
    ? feedPosts.length > 0
      ? feedPosts
      : posts
    : cachedPosts;

  const unreadCount =
    useQuery(api.notifications.getUnreadCount, isSignedIn ? {} : "skip") ?? 0;

    const currentUser =
  useQuery(
    api.users.index.getCurrentUser
  );

const [refreshing, setRefreshing] = useState(false);
const [storiesRefreshKey, setStoriesRefreshKey] = useState(0);
const [showRefreshSkeleton, setShowRefreshSkeleton] = useState(false);

const [commentsPostId,
  setCommentsPostId] =
  useState<any>(null);

const [likesPostId,
  setLikesPostId] =
  useState<any>(null);

const lastRefreshRef = useRef(0);
const renderPost =
  useCallback(
    ({ item }: any) => (
     <Post
  post={item}
  currentUser={currentUser}
  isOnline={isOnline}
        onOpenComments={() =>
          setCommentsPostId(
            item._id
          )
        }
        onOpenLikes={() =>
          setLikesPostId(
            item._id
          )
        }
      />
    ),
    [currentUser]
  );

const onRefresh =
  useCallback(
    async () => {

  const now = Date.now();

  if (
    now -
      lastRefreshRef.current <
    3400
  ) {
    return;
  }

  lastRefreshRef.current =
    now;

  setRefreshing(true);

  setShowRefreshSkeleton(
    true
  );

  setStoriesRefreshKey(
    (p) => p + 1
  );

  if (
    finalPosts.length > 5
  ) {
const allPosts =
  [...(posts ??
    feedPosts)];

const shuffledAll =
  [...allPosts].sort(
    () =>
      Math.random() -
      0.5
  );

const topFive =
  shuffledAll.slice(
    0,
    5
  );

const rest =
  allPosts.filter(
    (post) =>
      !topFive.some(
        (p) =>
          p._id ===
          post._id
      )
  );

    const shuffledTop =
      [...topFive].sort(
        () =>
          Math.random() -
          0.5
      );
    setFeedPosts([
      ...shuffledTop,
      ...rest,
    ]);
  }

  await new Promise(
    (r) =>
      setTimeout(
        r,
        900
      )
  );

  setShowRefreshSkeleton(
    false
  );

  setRefreshing(false);
},
[
  posts,
  feedPosts,
]
);

useEffect(() => {
  setFeedRefresh(
    onRefresh
  );
}, [onRefresh]);


if (!isSignedIn) {
  return <FeedSkeleton />;
}


const storiesHeader = useMemo(() => {
  return (
    <StoriesSection
      refreshKey={storiesRefreshKey}
      setSwipeEnabled={setSwipeEnabled}
    />
  );
}, [storiesRefreshKey]);

  return (
    <>
  <WelcomeModal
    visible={
      showWelcome
    }
    fullname={
      user?.firstName ||
      "Friend"
    }
    onClose={() =>
      setShowWelcome(
        false
      )
    }
  />

  <View
    style={styles.container}
  >
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
{!feedReady ? (
  <FeedSkeleton />
) : showRefreshSkeleton ? (
  <FeedSkeleton />
) : showRefreshSkeleton ? (
  <FeedSkeleton />
) : finalPosts.length === 0 ? (
  <NoPostsFound />
) : (
    
        <FlashList
          ref={listRef}
          data={finalPosts}
          extraData={feedPosts}
          drawDistance={200}
          removeClippedSubviews
          renderItem={renderPost}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
     ListHeaderComponent={storiesHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      <LikesModal
  visible={
    !!likesPostId
  }
  postId={
    likesPostId
  }
  onClose={() =>
    setLikesPostId(
      null
    )
  }
/>

<CommentsModal
  visible={
    !!commentsPostId
  }
  postId={
    commentsPostId
  }
  onClose={() =>
    setCommentsPostId(
      null
    )
  }
  onCommentAdded={() => {}}
/>


</View>
</>
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