import { Loader } from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* GRID */}
      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(item, index) => item?._id ?? index.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => {
          if (!item) return null;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedImage(item.imageUrl)}
              style={{
                width: "33.33%",
                padding: 3,
              }}
            >
              <View
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  backgroundColor: "#0a0a0a",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <Image
                  source={item.imageUrl}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                  }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* 🔥 FULLSCREEN MODAL */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={selectedImage!}
            style={{
              width: "100%",
              height: "80%",
            }}
            contentFit="contain"
            transition={200}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
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
        <Text style={{ fontSize: 32 }}>🔖</Text>
      </View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 20,
          color: "#fff",
          fontWeight: "600",
        }}
      >
        No Bookmarks Yet
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#888",
          textAlign: "center",
          paddingHorizontal: 40,
        }}
      >
        Save posts to revisit them anytime.
      </Text>
    </View>
  );
}