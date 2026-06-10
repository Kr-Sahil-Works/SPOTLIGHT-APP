import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AppImage } from "@/shared/ui/AppImage";
import { styles } from "@/styles/feed.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useAppToast } from "./common/AppToast";

type PostProps = {
  onDelete?: (
    id: Id<"posts">
  ) => void;

  currentUser?: any;

      isOnline: boolean;

  onOpenComments?: () => void;

onOpenLikes?: () => void;


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

function Post({
  post,
  onDelete,
  currentUser,
  isOnline,
  onOpenComments,
  onOpenLikes,
}: PostProps){
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes);
const commentsCount =
  post.comments;
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
  setLoaded(false);
}, [post.imageUrl]);


  const { showToast } =
  useAppToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useUser();

  const toggleLike = useMutation(api.posts.index.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.index.deletePost);

 const handleLike = async () => {
  if (!isOnline) return;

  const newIsLiked =
    await toggleLike({
      postId: post._id,
    });

  setIsLiked(
    newIsLiked
  );

  setLikesCount(
    (prev) =>
      newIsLiked
        ? prev + 1
        : prev - 1
  );

  setShowMenu(false);
};

const handleDownload = async () => {
  try {
    if (!post?.imageUrl) return;

    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const filename =
      `img_${Date.now()}.jpg`;

    const fileUri =
      FileSystem.documentDirectory +
      filename;

    const res =
      await FileSystem.downloadAsync(
        post.imageUrl,
        fileUri
      );

    const asset =
      await MediaLibrary.createAssetAsync(
        res.uri
      );

    const album =
      await MediaLibrary.getAlbumAsync(
        "Download"
      );

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync(
        [asset],
        album,
        false
      );
    } else {
      await MediaLibrary.createAlbumAsync(
        "Download",
        asset,
        false
      );
    }
    setShowMenu(false);
 showToast({
  message:
    "Downloaded ✅",
  type:
    "success",
});
  } catch (error) {
       showToast({
  message:
    "Download failed ❌",
  type:
    "failed",
});
  }
};

const handleBookmark =
  async () => {
    if (!isOnline)
      return;

    const newIsBookmarked =
      await toggleBookmark({
        postId:
          post._id,
      });

    setIsBookmarked(
      newIsBookmarked
    );

    setShowMenu(false);
  };

const handleDelete =
  async () => {
    if (!isOnline)
      return;

    await deletePost({
      postId:
        post._id,
    });

    setShowDeleteModal(
      false
    );

    onDelete?.(
      post._id
    );

    
  };

  return (
    <View
  key={post._id.toString()}
  style={styles.post}
>
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
 <AppImage
  uri={post.author.image}
  style={styles.postAvatar}
  contentFit="cover"
/>
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

       <TouchableOpacity
  disabled={
    showDeleteModal ||
    !isOnline
  }
  style={{
    opacity:
      isOnline
        ? 1
        : 0.35,
  }}
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
     color={
  !isOnline
    ? "#666"
    : confirmDelete
    ? COLORS.primary
    : COLORS.white
}
          />
        </TouchableOpacity>
      </View>

      {isOnline &&
  showMenu && (
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
                  onOpenComments?.()
              }}
            />

            <MenuBtn
              icon="download-outline"
              text="Download"
              onPress={handleDownload}
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

   
     <View
  style={{
    width: "100%",
    aspectRatio: 1,
  }}
>
  {!loaded && (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#111",
        overflow: "hidden",
        zIndex: 2,
      }}
    >
      {/* <Animated.View
        renderToHardwareTextureAndroid={false}
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
      </Animated.View> */}


      {!loaded && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#111",
    }}
  />
)}
    </View>
  )}

  <AppImage
    uri={post.imageUrl}
    style={{
      width: "100%",
      height: "100%",
    }}
    contentFit="cover"
    transition={0}
    onLoadEnd={() => setLoaded(true)}
  />
</View>

      {/* ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
         <TouchableOpacity
  disabled={!isOnline}
  onPress={handleLike}
  style={{
    opacity:
      isOnline
        ? 1
        : 0.45,
  }}
>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
<TouchableOpacity
  disabled={!isOnline}
  onPress={() =>
   onOpenComments?.()
  }
  style={{
    opacity:
      isOnline
        ? 1
        : 0.45,
  }}
>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

      <TouchableOpacity
  disabled={!isOnline}
  onPress={
    handleBookmark
  }
  style={{
    opacity:
      isOnline
        ? 1
        : 0.45,
  }}
>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.postInfo}>
     <TouchableOpacity
  onPress={() =>
   onOpenLikes?.()
  }
>
  <Text
    style={
      styles.likesText
    }
  >
    {likesCount > 0
      ? `${likesCount.toLocaleString()} likes`
      : "Be the first to like"}
  </Text>
</TouchableOpacity>

        {post.caption && (
          <Text style={styles.captionText}>{String(post.caption)}</Text>
        )}

        {commentsCount > 0 && (
          <TouchableOpacity onPress={() =>onOpenComments?.()}>
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
    </View>
  );
}
export default React.memo(
  Post,
  (prev, next) => {
return (
  prev.post._id ===
    next.post._id &&
  prev.post.imageUrl ===
    next.post.imageUrl &&
  prev.post.likes ===
    next.post.likes &&
  prev.post.comments ===
    next.post.comments &&
  prev.post.isLiked ===
    next.post.isLiked &&
  prev.post.isBookmarked ===
    next.post.isBookmarked &&
  prev.post.caption ===
    next.post.caption &&
  prev.post.author.image ===
    next.post.author.image &&
  prev.post.author.username ===
    next.post.author.username &&
  prev.currentUser?._id ===
    next.currentUser?._id &&
  prev.isOnline ===
    next.isOnline
);
  }
);

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
