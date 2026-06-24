import ImageViewerModal from "@/components/modals/ImageViewerModal";
import { api } from "@/convex/_generated/api";
import {
  getBookmarksCache,
} from "@/lib/cache/bookmarksCache";
import {
  getCollectionPostsCache,
  saveCollectionPostsCache,
} from "@/lib/cache/collectionPostsCache";
import { Ionicons } from "@expo/vector-icons";
import {
  useMutation,
  useQuery,
} from "convex/react";
import { Image } from "expo-image";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CollectionPage() {
  const router = useRouter();

  const { id } =
    useLocalSearchParams();

  /* ========================= */
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const closeModal = () => {
    setSelectedImage(null);
  };

  /* ========================= */
  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedPostId, setSelectedPostId] =
    useState<any>(null);

  /* ========================= */
const livePosts =
  useQuery(
    api.collections.getCollectionPosts,
    {
      collectionId:
        id as any,
    }
  );

const [
  cachedPosts,
  setCachedPosts,
] = useState<any[]>([]);

const posts =
  livePosts ??
  cachedPosts;

useEffect(() => {
  if (
    livePosts &&
    livePosts.length > 0
  ) {
    setCachedPosts(
      livePosts
    );

  saveCollectionPostsCache(
  String(id),
  livePosts
    .filter(
      (p): p is any =>
        p != null
    )
    .map(
      (p) =>
        String(p._id)
    )
);
  }
}, [livePosts, id]);

useEffect(() => {
  if (livePosts) return;

  const savedIds =
    getCollectionPostsCache(
      String(id)
    );

  const bookmarks =
    getBookmarksCache();

const offlinePosts =
  bookmarks.filter(
    (post: any) =>
      post &&
      savedIds.includes(
        String(post._id)
      )
  );

  setCachedPosts(
    offlinePosts
  );
}, [id]);

  const collections =
    useQuery(
      api.collections.getCollections
    ) ?? [];

  const collection = collections.find(
    (c) => c._id === id
  );

  /* ========================= */

    const deleteCollection = useMutation(
  api.collections.deleteCollection
);
  
  const removePostFromCollection =
    useMutation(
      api.collections
        .removePostFromCollection
    );


  /* ========================= */
  const [showDeletedPopup, setShowDeletedPopup] =
  useState(false);

const removeFromCollection =
  async () => {
    try {
      await removePostFromCollection({
        collectionId: id as any,
        postId: selectedPostId,
      });

      const remainingPosts =
        posts.filter(
          (p) =>
            p &&
            p._id !==
              selectedPostId
        );

      /* EMPTY COLLECTION */
      if (
        remainingPosts.length === 0
      ) {
        await deleteCollection({
          collectionId: id as any,
        });

        setShowDeletedPopup(true);

        setTimeout(() => {
          setShowDeletedPopup(
            false
          );

          router.back();
        }, 5000);
      }

      setSelectionMode(false);

      setSelectedPostId(null);
    } catch {}
  };

  /* ========================= */
  return (
    <View
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
          paddingTop: 10,
          paddingBottom: 40,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor:
              "#1111113c",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#09b500"
          />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 16,
          }}
        >
          <Text
            style={{
              color: "#ffffffbf",
              fontSize: 12,
            }}
          >
            Collection
          </Text>

          <Text
            style={{
              color: "#00b518",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            {collection?.name}
          </Text>
        </View>
      </View>

      {/* EMPTY */}
      {posts.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#777",
            }}
          >
            No posts yet
          </Text>
        </View>
      ) : (
        <>
          {/* EXIT SELECTION */}
          {selectionMode && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setSelectionMode(
                  false
                );

                setSelectedPostId(
                  null
                );
              }}
              style={{
                position:
                  "absolute",

                width: "100%",
                height: "100%",

                zIndex: 20,
              }}
            />
          )}

          {/* GRID */}
          <FlatList
            data={posts}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            style={{
              zIndex: 30,
            }}
            keyExtractor={(
              item,
              index
            ) =>
              item?._id?.toString() ??
              index.toString()
            }
            renderItem={({
              item,
            }) => {
              if (!item) return null;

              return (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      !selectionMode
                    ) {
                      setSelectedImage(
                        item.imageUrl
                      );
                    }
                  }}
                  onLongPress={() => {
                    setSelectionMode(
                      true
                    );

                    setSelectedPostId(
                      item._id
                    );
                  }}
                  activeOpacity={0.9}
                  style={{
                    width: "50%",
                    padding: 10,
                  }}
                >
                  <View>
                    {/* IMAGE */}
                <Image
  source={
    item.imageUrl?.trim()
      ? { uri: item.imageUrl }
      : require("@/assets/images/icons/iconbg.webp")
  }
  cachePolicy="memory-disk"
  transition={120}
  style={{
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
  }}
  contentFit="cover"
/>

                    {/* REMOVE BTN */}
                    {selectionMode &&
                      selectedPostId ===
                        item._id && (
                        <TouchableOpacity
                          onPress={
                            removeFromCollection
                          }
                          style={{
                            position:
                              "absolute",

                            top: 10,
                            right: 10,

                            width: 34,
                            height: 34,

                            borderRadius: 17,

                            backgroundColor:
                              "rgba(255,70,70,0.96)",

                            justifyContent:
                              "center",

                            alignItems:
                              "center",
                          }}
                        >
                          <Ionicons
                            name="remove"
                            size={22}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {/* COLLECTION DELETED POPUP */}
{showDeletedPopup && (
  <View
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",

      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "rgba(0,0,0,0.82)",

      zIndex: 999,
    }}
  >
    <View
      style={{
        width: "82%",

        backgroundColor: "#111",

        borderRadius: 28,

        padding: 24,

        borderWidth: 1,
        borderColor:
          "rgba(255,255,255,0.06)",
      }}
    >
      {/* ICON */}
      <View
        style={{
          width: 72,
          height: 72,

          borderRadius: 36,

          backgroundColor:
            "rgba(255,80,80,0.12)",

          justifyContent: "center",
          alignItems: "center",

          alignSelf: "center",
        }}
      >
        <Ionicons
          name="trash-outline"
          size={34}
          color="#c20000"
        />
      </View>

      {/* TITLE */}
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "800",

          textAlign: "center",

          marginTop: 18,
        }}
      >
        Collection Deleted
      </Text>

      {/* TEXT */}
      <Text
        style={{
          color: "#999",

          fontSize: 14,

          textAlign: "center",

          lineHeight: 22,

          marginTop: 12,
        }}
      >
        This collection no longer has
        any saved posts.
      </Text>

      {/* TIMER */}
      <Text
        style={{
          color: "#00ff88",

          textAlign: "center",

          marginTop: 22,

          fontWeight: "700",
        }}
      >
        Closing automatically...
      </Text>
    </View>
  </View>
)}

      {/* IMAGE MODAL */}
      <ImageViewerModal
        visible={!!selectedImage}
        imageUrl={selectedImage}
        onClose={closeModal}
      />
    </View>
  );
}