import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

type BookmarkGridProps = {
  posts: any[];
  selectionMode: boolean;
  selectedPosts: string[];
  isOnline: boolean;
  onSelect: (postId: string) => void;
  onEnterSelection: (postId: string) => void;
  onOpenImage: (imageUrl: string) => void;
};

export default function BookmarkGrid({
  posts,
  selectionMode,
  selectedPosts,
  isOnline,
  onSelect,
  onEnterSelection,
  onOpenImage,
}: BookmarkGridProps) {
  return (
    <FlatList
      data={posts}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) =>
        item?._id?.toString() ?? index.toString()
      }
      removeClippedSubviews
      initialNumToRender={9}
      windowSize={7}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => {
        if (!item?.imageUrl) return null;

        const postId = item._id.toString();
        const selected = selectedPosts.includes(postId);

        return (
          <Pressable
            style={styles.item}
            onPress={() => {
              if (selectionMode) {
                onSelect(postId);
              } else {
                onOpenImage(item.imageUrl);
              }
            }}
            onLongPress={() => {
              if (!selectionMode) {
                onEnterSelection(postId);
              } else if (isOnline) {
                onSelect(postId);
              }
            }}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.imageUrl }}
                contentFit="cover"
                cachePolicy="memory-disk"
                style={styles.image}
              />

              {selectionMode && (
                <>
                  {selected && <View style={styles.selectedOverlay} />}

                  <View style={styles.check}>
                    <Ionicons
                      name={
                        selected
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={selected ? "#00ff88" : "#fff"}
                    />
                  </View>
                </>
              )}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 140,
  },

  item: {
    width: "33.333%",
    padding: 3,
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#0a0a0a",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  check: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,255,136,0.18)",
  },
});