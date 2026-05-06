import EmptyCenter from "@/components/EmptyCenter";
import { Loader } from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  Image as RNImage,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

/* ========================= */
export default function Bookmarks() {
  const router = useRouter();

  const bookmarkedPosts =
    useQuery(api.bookmarks.getBookmarkedPosts, { limit: 30 }) ?? [];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  /* ========================= */
  const openModal = (uri: string) => {
    setSelectedImage(uri);
    scale.setValue(1);
  };

  const closeModal = () => setSelectedImage(null);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  /* ========================= */
  const downloadImage = async () => {
    try {
      if (!selectedImage || downloading) return;

      setDownloading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showToast("Permission denied");
        return;
      }

      const filename = `img_${Date.now()}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;

      const res = await FileSystem.downloadAsync(selectedImage, fileUri);

      const asset = await MediaLibrary.createAssetAsync(res.uri);
      const album = await MediaLibrary.getAlbumAsync("Download");

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      }

      /* ✅ SUCCESS ANIMATION */
      setShowSuccess(true);
      successScale.setValue(0);

      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowSuccess(false), 1200);
      });

      showToast("Downloaded ✅");
    } catch {
      showToast("Download failed ❌");
    } finally {
      setDownloading(false);
    }
  };

  /* ========================= */
  if (bookmarkedPosts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* EMPTY */}
      {bookmarkedPosts.length === 0 ? (
        <NoBookmarksFound onExplore={() => router.push("/")} />
      ) : (
        <FlatList
          data={bookmarkedPosts}
          keyExtractor={(item, i) =>
            item?._id?.toString() || i.toString()
          }
          numColumns={3}
          removeClippedSubviews
          initialNumToRender={9}
          windowSize={7}
          renderItem={({ item }) => {
            if (!item?.imageUrl) return null;

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
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* ========================= */}
      {/* MODAL */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.96)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* CLOSE BG */}
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
            >
              <RNImage
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </Animated.View>
          )}

          {/* SUCCESS */}
          {showSuccess && (
            <Animated.View
              style={{
                position: "absolute",
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
              bottom: 60,
              flexDirection: "row",
              gap: 16,
              padding: 10,
              borderRadius: 30,
              backgroundColor: "rgba(20,20,20,0.6)",
            }}
          >
            <Btn icon="remove" onPress={() => scale.setValue(1)} />
            <Btn icon="add" onPress={() => scale.setValue(1.5)} />
            <Btn icon="download" onPress={downloadImage} loading={downloading} />
          </View>

          {/* CLOSE BUTTON */}
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: "absolute",
              top: 50,
              right: 16,
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
      </Modal>
    </View>
  );
}

/* ========================= */
function Btn({ icon, onPress, loading }: any) {
  return (
    <TouchableOpacity
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
        <ActivityIndicator color="#fff" />
      ) : (
        <Ionicons name={icon} size={20} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

/* ========================= */
function NoBookmarksFound({ onExplore }: any) {
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
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Ionicons name="bookmark-outline" size={40} color="#666" />
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
          <Text style={{ color: "#000", fontWeight: "600" }}>
            Explore Posts
          </Text>
        </TouchableOpacity>
      </View>
    </EmptyCenter>
  );
}