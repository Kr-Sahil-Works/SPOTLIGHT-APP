import { Loader } from "@/components/loaders/Loader";
import ImageViewerModal from "@/components/modals/ImageViewerModal";
import { api } from "@/convex/_generated/api";
import useNetwork from "@/hooks/useNetwork";
import {
  getBookmarksCache,
  saveBookmarksCache,
} from "@/lib/cache/bookmarksCache";
import {
  getCollectionsCache,
  saveCollectionsCache,
} from "@/lib/cache/collectionsCache";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet, Text,
  TouchableOpacity,
  View
} from "react-native";

import BookmarkGrid from "./BookmarkGrid";
import CollectionModal from "./CollectionModal";
import EmptyBookmarks from "./EmptyBookmarks";

export default function Bookmarks() {
  const router = useRouter();
  const isOnline = useNetwork();

  const liveBookmarks = useQuery(
    api.bookmarks.getBookmarkedPosts,
    { limit: 30 }
  );

  const liveCollections = useQuery(
    api.collections.getCollections
  );

  const [cachedBookmarks, setCachedBookmarks] =
    useState<any[]>(getBookmarksCache());

  const [cachedCollections, setCachedCollections] =
    useState<any[]>(getCollectionsCache());

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedPosts, setSelectedPosts] =
    useState<string[]>([]);

  const [showCollectionModal, setShowCollectionModal] =
    useState(false);

  const [newCollectionName, setNewCollectionName] =
    useState("");

  const [toast, setToast] = useState("");

  const createCollection = useMutation(
    api.collections.createCollection
  );

  const addPostsToCollection = useMutation(
    api.collections.addPostsToCollection
  );

  const bookmarkedPosts =
    liveBookmarks ?? cachedBookmarks;

  const collections =
    liveCollections ?? cachedCollections;

  useEffect(() => {
    if (liveBookmarks) {
      setCachedBookmarks(liveBookmarks);
      saveBookmarksCache(liveBookmarks);
    }
  }, [liveBookmarks]);

  useEffect(() => {
    if (liveCollections) {
      setCachedCollections(liveCollections);
      saveCollectionsCache(liveCollections);
    }
  }, [liveCollections]);

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const toggleSelection = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const enterSelection = (postId: string) => {
    if (!isOnline) {
      showToast("Collections unavailable offline");
      return;
    }

    setSelectionMode(true);
    setSelectedPosts([postId]);
  };

  const exitSelection = () => {
    setSelectionMode(false);
    setSelectedPosts([]);
  };

  const createNewCollection = async () => {
    const name = newCollectionName.trim();

    if (!name || !isOnline || !selectedPosts.length) {
      return;
    }

    try {
      const collectionId =
        await createCollection({ name });

      const result =
        await addPostsToCollection({
          collectionId,
          postIds: selectedPosts as any,
        });

      setNewCollectionName("");
      setShowCollectionModal(false);
      exitSelection();

      showToast(
        result.added > 0
          ? `Collection created • ${result.added} saved ✨`
          : "Collection created"
      );
    } catch {
      showToast("Failed ❌");
    }
  };

  const addToExistingCollection = async (
    collectionId: string
  ) => {
    if (!isOnline || !selectedPosts.length) {
      return;
    }

    try {
      const result =
        await addPostsToCollection({
          collectionId: collectionId as any,
          postIds: selectedPosts as any,
        });

      setShowCollectionModal(false);
      exitSelection();

      showToast(
        result.added > 0
          ? `${result.added} post saved ✨`
          : "Already in collection"
      );
    } catch {
      showToast("Failed ❌");
    }
  };

  if (bookmarkedPosts === undefined) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.headerTitle}>
          {selectionMode
            ? `${selectedPosts.length} Selected`
            : "Bookmarks"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          {selectionMode && (
            <TouchableOpacity onPress={exitSelection}>
              <Text
                style={{
                  color: "#ff4444",
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={!isOnline}
            onPress={() => {
              if (!isOnline) {
                showToast(
                  "Collections unavailable offline"
                );
                return;
              }

              router.push("/collections");
            }}
            style={{
              opacity: isOnline ? 1 : 0.4,
            }}
          >
            <Ionicons
              name="folder-open"
              size={24}
              color="#09bb03"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      {bookmarkedPosts.length === 0 ? (
        <EmptyBookmarks
          onExplore={() => router.push("/")}
        />
      ) : (
        <BookmarkGrid
          posts={bookmarkedPosts}
          selectionMode={selectionMode}
          selectedPosts={selectedPosts}
          isOnline={isOnline}
          onSelect={toggleSelection}
          onEnterSelection={enterSelection}
          onOpenImage={setSelectedImage}
        />
      )}

      {/* BOTTOM ACTION BAR */}
      {selectionMode && (
        <View style={styles.actionBar}>
          <Text style={styles.actionCount}>
            {selectedPosts.length} selected
          </Text>

          <TouchableOpacity
            disabled={!selectedPosts.length}
            onPress={() =>
              setShowCollectionModal(true)
            }
            style={styles.collectionButton}
          >
            <Text style={styles.collectionButtonText}>
              Add To Collection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COLLECTION MODAL */}
      <CollectionModal
        visible={showCollectionModal}
        collections={collections}
        isOnline={isOnline}
        name={newCollectionName}
        setName={setNewCollectionName}
        onClose={() =>
          setShowCollectionModal(false)
        }
        onCreate={createNewCollection}
        onSelect={addToExistingCollection}
      />

      {/* TOAST */}
      {toast ? (
        <View style={styles.toast}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#00ff88"
          />

          <Text style={styles.toastText}>
            {toast}
          </Text>
        </View>
      ) : null}

      {/* IMAGE VIEWER */}
      <ImageViewerModal
        visible={!!selectedImage}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020403",
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    minHeight: 58,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  actionBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 110,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionCount: {
    color: "#fff",
    fontWeight: "600",
  },

  collectionButton: {
    backgroundColor: "#0f854e",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },

  collectionButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  toast: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    backgroundColor: "#111",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,255,136,0.18)",
    zIndex: 999,
  },

  toastText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
  },
});