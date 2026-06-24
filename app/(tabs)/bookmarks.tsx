import EmptyCenter from "@/components/common/EmptyCenter";
import { Loader } from "@/components/loaders/Loader";
import ImageViewerModal from "@/components/modals/ImageViewerModal";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getBookmarksCache,
  saveBookmarksCache,
} from "@/lib/cache/bookmarksCache";

import {
  getCollectionsCache,
  saveCollectionsCache,
} from "@/lib/cache/collectionsCache";

import useNetwork from "@/hooks/useNetwork";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

export default function Bookmarks() {
  const router = useRouter();

  const isOnline =
  useNetwork();

const liveBookmarks =
  useQuery(
    api.bookmarks.getBookmarkedPosts,
    {
      limit: 30,
    }
  );

const [
  cachedBookmarks,
  setCachedBookmarks,
] = useState<any[]>(
  getBookmarksCache()
);

const bookmarkedPosts =
  liveBookmarks ??
  cachedBookmarks;

 const liveCollections =
  useQuery(
    api.collections.getCollections
  );

const [
  cachedCollections,
  setCachedCollections,
] = useState<any[]>(
  getCollectionsCache()
);

const collections =
  liveCollections ??
  cachedCollections;

  useEffect(() => {
  if (
    liveBookmarks &&
    liveBookmarks.length > 0
  ) {
    setCachedBookmarks(
      liveBookmarks
    );

    saveBookmarksCache(
      liveBookmarks
    );
  }
}, [liveBookmarks]);

useEffect(() => {
  if (
    liveCollections &&
    liveCollections.length > 0
  ) {
    setCachedCollections(
      liveCollections
    );

    saveCollectionsCache(
      liveCollections
    );
  }
}, [liveCollections]);


useEffect(() => {

  const show =
    Keyboard.addListener(
      "keyboardDidShow",
      () =>
        setKeyboardVisible(
          true
        )
    );

  const hide =
    Keyboard.addListener(
      "keyboardDidHide",
      () =>
        setKeyboardVisible(
          false
        )
    );

  return () => {
    show.remove();
    hide.remove();
  };

}, []);


  const createCollection = useMutation(
    api.collections.createCollection
  );

  const addPostsToCollection = useMutation(
    api.collections.addPostsToCollection
  );

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [downloading, setDownloading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedPosts, setSelectedPosts] =
    useState<string[]>([]);

  const [showCollectionModal, setShowCollectionModal] =
    useState(false);

  const [newCollectionName, setNewCollectionName] =
    useState("");

    const [
  keyboardVisible,
  setKeyboardVisible,
] = useState(false);


    const [toast, setToast] = useState({
  visible: false,
  text: "",
});

const showCustomToast = (
  text: string
) => {
  setToast({
    visible: true,
    text,
  });

  setTimeout(() => {
    setToast({
      visible: false,
      text: "",
    });
  }, 2200);
};

  const scale = useRef(new Animated.Value(1)).current;

  const successScale = useRef(
    new Animated.Value(0)
  ).current;

  /* ========================= */
  const openModal = (uri: string) => {
    setSelectedImage(uri);
    scale.setValue(1);
  };

  const closeModal = () => setSelectedImage(null);

  /* ========================= */
  const toggleSelection = (postId: string) => {
    const exists = selectedPosts.includes(postId);

    if (exists) {
      setSelectedPosts((prev) =>
        prev.filter((id) => id !== postId)
      );
    } else {
      setSelectedPosts((prev) => [...prev, postId]);
    }
  };

  /* ========================= */
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedPosts([]);
  };

  /* ========================= */
  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  /* ========================= */
const createNewCollection = async () => {
  try {
    if (!newCollectionName.trim()) return;

    const collectionId =
      await createCollection({
        name: newCollectionName.trim(),
      });

    const result =
      await addPostsToCollection({
        collectionId,
        postIds: selectedPosts as any,
      });

    setNewCollectionName("");

    setShowCollectionModal(false);

    exitSelectionMode();

    if (result.added > 0) {
      showCustomToast(
        `Collection created • ${result.added} saved ✨`
      );
    } else {
      showCustomToast(
        "Collection created"
      );
    }
  } catch {
    showToast("Failed ❌");
  }
};

  /* ========================= */
const addToExistingCollection = async (
  collectionId: any
) => {
  try {
    const result =
      await addPostsToCollection({
        collectionId,
        postIds: selectedPosts as any,
      });

    setShowCollectionModal(false);

    exitSelectionMode();

    if (result.added > 0) {
      showCustomToast(
        `${result.added} post saved ✨`
      );
    } else {
      showCustomToast(
        "Already in collection"
      );
    }
  } catch {
    showToast("Failed ❌");
  }
};

  /* ========================= */
  const downloadImage = async () => {
    try {
      if (!selectedImage || downloading) return;

      setDownloading(true);

      const { status } =
        await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        showToast("Permission denied");
        return;
      }

      const filename = `img_${Date.now()}.jpg`;

      const fileUri =
        FileSystem.documentDirectory + filename;

      const res = await FileSystem.downloadAsync(
        selectedImage,
        fileUri
      );

      const asset =
        await MediaLibrary.createAssetAsync(
          res.uri
        );

      const album =
        await MediaLibrary.getAlbumAsync("Download");

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

      setShowSuccess(true);

      successScale.setValue(0);

      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);
      });

      showToast("Downloaded ✅");
    } catch {
      showToast("Download failed ❌");
    } finally {
      setDownloading(false);
    }
  };

  /* ========================= */
  if (bookmarkedPosts === undefined) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {/* ========================= */}
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
            <TouchableOpacity
              onPress={exitSelectionMode}
            >
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
      showCustomToast(
        "Collections unavailable offline"
      );
      return;
    }

    router.push(
      "/collections" as any
    );
  }}
  style={{
    opacity:
      isOnline ? 1 : 0.4,
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

      {/* ========================= */}
      {/* EMPTY */}
      {bookmarkedPosts.length === 0 ? (
        <NoBookmarksFound
          onExplore={() => router.push("/")}
        />
      ) : (
        <FlatList
          data={bookmarkedPosts}
          showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) =>
            item?._id?.toString() ||
            i.toString()
          }
          numColumns={3}
          removeClippedSubviews
          initialNumToRender={9}
          windowSize={7}
          contentContainerStyle={{
            paddingBottom: 140,
          }}
          renderItem={({ item }) => {
            if (!item?.imageUrl) return null;

            const isSelected =
              selectedPosts.includes(
                item._id as any
              );

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  width: "33.33%",
                  padding: 3,
                }}
              onLongPress={() => {
  if (!isOnline) {
    showCustomToast(
      "Collections unavailable offline"
    );
    return;
  }

  if (!selectionMode) {
    setSelectionMode(true);

    setSelectedPosts([
      item._id as any,
    ]);
  }
}}
                onPress={() => {
                  if (selectionMode) {
                    toggleSelection(
                      item._id as any
                    );
                    return;
                  }

                  openModal(item.imageUrl);
                }}
              >
                <View
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    backgroundColor: "#0a0a0a",
                  }}
                >
                  {/* IMAGE */}
                  <Image
                  source={
  item.imageUrl?.trim()
    ? { uri: item.imageUrl }
    : require("@/assets/images/icons/iconbg.webp")
}
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />

                  {/* CHECKBOX */}
                  {selectionMode && (
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 5,
                      }}
                    >
                      <Ionicons
                        name={
                          isSelected
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={24}
                        color={
                          isSelected
                            ? "#00ff88"
                            : "#fff"
                        }
                      />
                    </View>
                  )}

                  {/* DARK OVERLAY */}
                  {selectionMode &&
                    isSelected && (
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor:
                            "rgba(0,255,136,0.18)",
                        }}
                      />
                    )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* ========================= */}
      {/* BOTTOM ACTION BAR */}
      {selectionMode && (
        <View
          style={{
            position: "absolute",
            bottom: 110,
            left: 16,
            right: 16,
            backgroundColor: "#111",
            borderRadius: 24,
            paddingHorizontal: 18,
            paddingVertical: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.06)",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "600",
            }}
          >
            {selectedPosts.length} selected
          </Text>

          <TouchableOpacity
            onPress={() =>
              setShowCollectionModal(true)
            }
            style={{
              backgroundColor: "#0f854e",
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 18,
            }}
          >
            <Text
              style={{
                color: "#cac2c2",
                fontWeight: "700",
              }}
            >
              Add To Collection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ========================= */}
      {/* COLLECTION MODAL */}
<Modal
  visible={showCollectionModal}
  transparent
  animationType="fade"
>
  <KeyboardAvoidingView
    style={{
      flex: 1,
    }}
    behavior={
      Platform.OS === "ios"
        ? "padding"
        : "padding"
    }
  >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor:
              "rgba(0,0,0,0.6)",
          }}
        >
          <View
            style={{
              backgroundColor: "#111",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              maxHeight: "80%",
            }}
          >
            {/* TITLE */}
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 20,
              }}
            >
              Save To Collection
            </Text>

            {/* CREATE */}
          <View
  style={{
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,

    marginTop:
      keyboardVisible
        ? -10
        : 0,

        position:
  keyboardVisible
    ? "absolute"
    : "relative",

top:
  keyboardVisible
    ? 20
    : undefined,

left:
  keyboardVisible
    ? 20
    : undefined,

right:
  keyboardVisible
    ? 20
    : undefined,

zIndex: 999,
  }}
>
              <TextInput
                value={newCollectionName}
                underlineColorAndroid="transparent"
             onChangeText={(text) => {
  LayoutAnimation.configureNext(
    LayoutAnimation.Presets.easeInEaseOut
  );

  setNewCollectionName(text);
}}
                placeholder="New collection..."
                placeholderTextColor="#666"
                style={{
                  flex: 1,
                  backgroundColor: "#161616",
borderWidth: 1,
borderColor: "rgba(34,197,94,0.15)",
                  color: "#fff",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  height: 50,
                }}
              />

      <TouchableOpacity
  disabled={
    !isOnline
  }
  onPress={
    createNewCollection
  }
  style={{
   backgroundColor:
  "#166534",
    paddingHorizontal: 18,
    borderRadius: 16,
    justifyContent: "center",
    opacity:
      isOnline
        ? 1
        : 0.4,
  }}
>
            {newCollectionName.trim() ? (
  <Text
    style={{
      color: "#bcdcc8",
      fontWeight: "800",
      fontSize: 14,
    }}
  >
    Create
  </Text>
) : (
  <Ionicons
    name="add"
    size={22}
    color="#9dd6b2"
  />
)}
              </TouchableOpacity>
            </View>

            {/* COLLECTION LIST */}
          <FlatList
  data={collections}
  keyExtractor={(item) =>
    item._id
  }
  style={{
    maxHeight: 140,
  }}
  showsVerticalScrollIndicator={
    false
  }
  renderItem={({ item }) => (
    <TouchableOpacity
      disabled={!isOnline}
      onPress={() =>
        addToExistingCollection(
          item._id
        )
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor:
          "rgba(255,255,255,0.05)",

        opacity:
          isOnline
            ? 1
            : 0.4,
      }}
    >
      <Ionicons
        name="folder-outline"
        size={22}
        color="#22c55e"
      />

      <Text
        style={{
          color: "#fff",
          marginLeft: 14,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )}
/>

            {/* CLOSE */}
            <TouchableOpacity
              onPress={() =>
                setShowCollectionModal(false)
              }
              style={{
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: "#888",
                  fontSize: 15,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
</KeyboardAvoidingView>
</Modal>


      {/* CUSTOM TOAST */}
{toast.visible && (
  <Animated.View
    style={{
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
      borderColor:
        "rgba(0,255,136,0.18)",
      zIndex: 999,
    }}
  >
    <Ionicons
      name="checkmark-circle"
      size={20}
      color="#00ff88"
    />

    <Text
      style={{
        color: "#fff",
        marginLeft: 10,
        fontWeight: "600",
      }}
    >
      {toast.text}
    </Text>
  </Animated.View>
)}

      {/* ========================= */}
  <ImageViewerModal
  visible={!!selectedImage}
  imageUrl={selectedImage}
  onClose={closeModal}
/>
    </View>
  );
}

/* ========================= */
function Btn({
  icon,
  onPress,
  loading,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:
          "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Ionicons
          name={icon}
          size={20}
          color="#fff"
        />
      )}
    </TouchableOpacity>
  );
}

/* ========================= */
function NoBookmarksFound({
  onExplore,
}: any) {
  return (
    <EmptyCenter>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        {/* ICON */}
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#111",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.08)",
          }}
        >
          <Ionicons
            name="bookmark-outline"
            size={40}
            color="#666"
          />
        </View>

        {/* TITLE */}
        <Text
          style={{
            marginTop: 20,
            fontSize: 20,
            color: "#fff",
            fontWeight: "600",
          }}
        >
          No bookmarks yet
        </Text>

        {/* SUBTEXT */}
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#888",
            textAlign: "center",
          }}
        >
          Save posts to view them later.
        </Text>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={onExplore}
          style={{
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 25,
            backgroundColor: "#00ff6a",
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "#fff",
fontWeight: "800",
fontSize: 15,
            }}
          >
            Explore Posts
          </Text>
        </TouchableOpacity>
      </View>
    </EmptyCenter>
  );
}