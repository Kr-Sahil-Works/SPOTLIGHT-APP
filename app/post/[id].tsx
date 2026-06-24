import CommentsModal from "@/components/modals/CommentsModal";
import LikesModal from "@/components/modals/LikesModal";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  useEffect,
  useState
} from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostPage() {
  const router = useRouter();

  const {
    id,
    openComments,
  } = useLocalSearchParams();

  useEffect(() => {
  if (openComments === "true") {
    setCommentsPostId(id);
  }
}, [openComments]);

  const [commentsPostId,
  setCommentsPostId] =
  useState<any>(null);

const [likesPostId,
  setLikesPostId] =
  useState<any>(null);

  const post = useQuery(
    api.posts.index.getPostById,
    {
      postId: id as any,
    }
  );

  if (
    post === undefined
  ) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            "#000",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#00ff88"
        />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            "#000",
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          "#000",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          height: 58,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,

          borderBottomWidth: 1,

          borderBottomColor:
            "rgba(255,255,255,0.06)",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",

            fontSize: 18,

            fontWeight: "700",

            marginLeft: 14,
          }}
        >
          Your Post
        </Text>
      </View>

      {/* POST */}
<View
  style={{
    marginTop: 16,
  }}
>
<Post
  post={post}
  currentUser={post.author}
  isOnline={true}
  onOpenComments={() =>
    setCommentsPostId(post._id)
  }
  onOpenLikes={() =>
    setLikesPostId(post._id)
  }
/>
</View>

      {/* BOTTOM CTA */}
      <View
        style={{
          flex: 1,

          justifyContent:
            "center",

          paddingHorizontal: 20,

          paddingBottom: 30,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            router.push(
              "/(tabs)/profile"
            );
          }}
          style={{
            backgroundColor:
              "rgba(0,255,136,0.08)",

            borderWidth: 1,

            borderColor:
              "rgba(0,255,136,0.15)",

            borderRadius: 24,

            paddingVertical: 18,

            flexDirection: "row",

            alignItems: "center",

            justifyContent:
              "center",

            gap: 10,
          }}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color="#00ff88"
          />

          <Text
            style={{
              color: "#eafff3",

              fontWeight: "700",

              fontSize: 15,
            }}
          >
            View All Posts
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#00ff88"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#666",

            textAlign: "center",

            marginTop: 12,

            fontSize: 12,
          }}
        >
          Go to your profile to see all posts
        </Text>
      </View>
      <LikesModal
  visible={!!likesPostId}
  postId={likesPostId}
  onClose={() =>
    setLikesPostId(null)
  }
/>

<CommentsModal
  visible={!!commentsPostId}
  postId={commentsPostId}
  onClose={() =>
    setCommentsPostId(null)
  }
  onCommentAdded={() => {}}
/>
    </View>
    
  );
}