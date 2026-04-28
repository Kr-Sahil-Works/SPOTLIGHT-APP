import { Loader } from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform, Image as RNImage, Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";


/* ========================= */
export default function Bookmarks() {
 const bookmarkedPosts = useQuery(
  api.bookmarks.getBookmarkedPosts,
  { limit: 30 }
);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [downloading, setDownloading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const successScale = useRef(new Animated.Value(0)).current;

  const scale = useRef(new Animated.Value(1)).current;

  const openModal = (uri: string) => {
    setSelectedImage(uri);
    scale.setValue(1);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  /* 📥 DOWNLOAD */
const showToast = (msg: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
};

const downloadImage = async () => {
  try {
    if (!selectedImage || downloading) return;

    setDownloading(true);

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      showToast("Permission denied");
      setDownloading(false);
      return;
    }

    const filename = `image_${Date.now()}.jpg`;
    const fileUri = FileSystem.documentDirectory + filename;

    const res = await FileSystem.downloadAsync(selectedImage, fileUri);

    const asset = await MediaLibrary.createAssetAsync(res.uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);

   // 🔥 success animation
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

showToast("Image downloaded ✅");
  } catch (e) {
    showToast("Download failed ❌");
  } finally {
    setDownloading(false);
  }
};

  if (!bookmarkedPosts) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* GRID */}
      <FlatList
        data={bookmarkedPosts ?? []}
        keyExtractor={(item, i) => item?._id ?? i.toString()}
        numColumns={3}
        removeClippedSubviews
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={7}
        renderItem={({ item }) => {
          if (!item || !item.imageUrl) return null;

          return (
            <TouchableOpacity
              onPress={() => openModal(item.imageUrl)}
              style={{ width: "33.33%", padding: 3 }}
            >
              <View
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  backgroundColor: "#0a0a0a",
                }}
              >
                <Image
                source={{ uri: item.imageUrl }}
                  style={{ width: "100%", aspectRatio: 1 }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                    allowDownscaling 
                    recyclingKey={item._id}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* ✅ CLEAN MODAL */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.96)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* CLOSE BACK */}
          <TouchableOpacity
            style={{ position: "absolute", width: "100%", height: "100%" }}
            activeOpacity={1}
            onPress={closeModal}
          />

          {/* IMAGE */}
          {selectedImage && (
            <Animated.View
  style={{
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale }],
  }}
  renderToHardwareTextureAndroid={false}
>
             <RNImage
  source={{ uri: selectedImage }}
  style={{
    width: "100%",
    height: "100%",
    borderRadius: 12,
  }}
  resizeMode="contain"
/> 
            </Animated.View>
          )}
{showSuccess && (
  <Animated.View
    style={{
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      transform: [{ scale: successScale }],
    }}
  >
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="checkmark" size={40} color="#00ff88" />
    </View>
  </Animated.View>
)}
          {/* CONTROLS */}
         <View
  style={{
    position: "absolute",
    bottom: 60, // ✅ little higher
    left: 0,
    right: 0,
    alignItems: "center",
  }}
>
  <View
    style={{
      flexDirection: "row",
      gap: 16,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 30,

      // 🔥 PREMIUM GLASS LOOK
      backgroundColor: "rgba(20,20,20,0.65)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
    }}
  >
    <Btn
      icon="remove"
      onPress={() =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start()
      }
    />

    <Btn
      icon="add"
      onPress={() =>
        Animated.spring(scale, {
          toValue: 1.5,
          useNativeDriver: true,
        }).start()
      }
    />

<Btn icon="download" onPress={downloadImage} loading={downloading} />
  </View>
</View>
<View
  style={{
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 20,
  }}
>
  <TouchableOpacity
    onPress={closeModal}
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "rgba(20,20,20,0.7)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Ionicons name="close" size={22} color="#fff" />
  </TouchableOpacity>
</View>
        </View>
      </Modal>
    </View>
  );
}

/* BUTTON */
function Btn({ icon, onPress, loading }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={loading}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Ionicons name={icon} size={20} color="#fff" />
      )}
    </TouchableOpacity>
  );
}
/* EMPTY */
function NoBookmarksFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      <Text style={{ color: "#fff" }}>No Bookmarks</Text>
    </View>
  );
}