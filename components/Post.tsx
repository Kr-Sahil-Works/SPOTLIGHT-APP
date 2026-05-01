import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import CommentsModal from "./CommentsModal";

type PostProps = {
  onDelete?: (id: Id<"posts">) => void;
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
};

export default function Post({ post, onDelete }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const shimmer = useRef(new Animated.Value(0)).current;

  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const handleLike = async () => {
    const newIsLiked = await toggleLike({ postId: post._id });
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
  };

  const handleBookmark = async () => {
    const newIsBookmarked = await toggleBookmark({ postId: post._id });
    setIsBookmarked(newIsBookmarked);
  };

const handleDelete = async () => {
  await deletePost({ postId: post._id });
  setShowDeleteModal(false);
  onDelete?.(post._id);
};

  return (
    <View style={styles.post}>
      {/* HEADER */}
      <View style={styles.postHeader}>
        <Link
          href={
            currentUser?._id === post.author._id
              ? "/(tabs)/profile"
              : { pathname: "/user/[id]", params: { id: post.author._id } }
          }
          asChild
        >
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={{ uri: post.author.image }}
              style={styles.postAvatar}
              contentFit="cover"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          disabled={showDeleteModal}
          onPress={() => {
            if (confirmDelete) {
              setShowDeleteModal(true);
              setConfirmDelete(false);
            } else {
              setShowMenu((p) => !p);
            }
          }}
        >
          <Ionicons
            name={confirmDelete ? "trash-outline" : "ellipsis-horizontal"}
            size={20}
            color={confirmDelete ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
          }}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              backgroundColor: "rgba(20,20,20,0.95)",
              borderRadius: 14,
              padding: 10,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              zIndex: 10,
            }}
          >
            <MenuBtn
              icon={isLiked ? "heart" : "heart-outline"}
              text={isLiked ? "Unlike" : "Like"}
              onPress={handleLike}
            />

            <MenuBtn
              icon={isBookmarked ? "bookmark" : "bookmark-outline"}
              text={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              onPress={handleBookmark}
            />

            <MenuBtn
              icon="chatbubble-outline"
              text="Comment"
              onPress={() => {
                setShowMenu(false);
                setShowComments(true);
              }}
            />

            <MenuBtn
              icon="download-outline"
              text="Download"
              onPress={async () => {}}
            />

            {post.author._id === currentUser?._id && (
              <MenuBtn
                icon="trash-outline"
                text="Delete"
                onPress={() => {
                  setShowMenu(false);
                  setConfirmDelete(false);
                  setShowDeleteModal(true);
                }}
              />
            )}
          </View>
        </Pressable>
      )}

      {/* IMAGE */}
      <View>
        {!loaded && (
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
              backgroundColor: "#111",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                width: "100%",
                height: "100%",
                transform: [{ translateX }],
              }}
            >
              <LinearGradient
                colors={["#111", "#222", "#111"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        )}

        <Image
          source={{ uri: post.imageUrl }}
          style={[
            styles.postImage,
            {
              position: loaded ? "relative" : "absolute",
              opacity: loaded ? 1 : 0,
            },
          ]}
          contentFit="cover"
          onLoadEnd={() => setLoaded(true)}
        />
      </View>

      {/* ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount > 0
            ? `${likesCount.toLocaleString()} likes`
            : "Be the first to like"}
        </Text>

        {post.caption && (
          <Text style={styles.captionText}>{String(post.caption)}</Text>
        )}

        {commentsCount > 0 && (
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.commentsText}>
              View all {commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>

      {/* DELETE MODAL FIXED */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 20,
              backgroundColor: "#0f0f0f",
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Delete Post?
            </Text>

            <Text
              style={{
                color: "#888",
                fontSize: 13,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              This action cannot be undone.
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: "#111",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: "#ff3b30",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
      />
    </View>
  );
}

function MenuBtn({ icon, text, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 6,
      }}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={{ color: "#fff", fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  );
}