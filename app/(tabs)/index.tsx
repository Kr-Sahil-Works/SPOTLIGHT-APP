import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated, FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../../styles/feed.styles";


export default function Index() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
const scale = useRef(new Animated.Value(1)).current;
const glow = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [shuffledPosts, setShuffledPosts] = useState<any[]>([]);

  const posts = useQuery(
    api.posts.getFeedPosts,
    isSignedIn ? {} : "skip"
  );

  if (!isSignedIn) return null;
  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostsFound />;

  // 🔥 shuffle
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    setShuffledPosts(shuffleArray(posts));

    await new Promise((r) => setTimeout(r, 400));

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 22,
            color: COLORS.primary,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          spotlight
        </Text>

        {/* ❤️ NOTIFICATIONS */}
 {/* ❤️ NOTIFICATIONS */}
<Animated.View
  style={{
    transform: [{ scale }],
  }}
>
  <Animated.View
    style={{
      borderRadius: 12,
      backgroundColor: glow.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.18)"],
      }),
    }}
  >
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 0.92,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 1,
            duration: 120,
            useNativeDriver: false,
          }),
        ]).start();
      }}
      onPressOut={() => {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }}
      onPress={() => router.push("../components/notifications")}
      style={{
        padding: 8,
        borderRadius: 12,
      }}
    >
      <Ionicons name="heart-outline" size={22} color="#fff" />
    </TouchableOpacity>
  </Animated.View>
</Animated.View>
      </View>

      {/* 🔥 FEED */}
      <FlatList
        key={refreshKey}
        data={shuffledPosts.length ? shuffledPosts : posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={<StoriesSection />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

/* 🔥 EMPTY STATE */

const NoPostsFound = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        paddingHorizontal: 30,
      }}
    >
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: "#111",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Ionicons name="image-outline" size={40} color="#666" />
      </View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 20,
          color: "#fff",
          fontWeight: "600",
        }}
      >
        No posts yet
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#888",
          textAlign: "center",
        }}
      >
        Start sharing your moments with others.
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
        <Text style={{ color: "#000", fontWeight: "600" }}>
          Create Post
        </Text>
      </TouchableOpacity>
    </View>
  );
};