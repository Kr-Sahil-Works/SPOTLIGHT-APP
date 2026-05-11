import { styles } from "@/styles/profile.styles";
import React from "react";
import {
  FlatList, Image, TouchableOpacity,
  View
} from "react-native";
import NoPosts from "./NoPosts";

export default function ProfileGrid({
  posts,
  setSelectedPost,
}: any) {
  return (
    <View style={{ width: "100%" }}>
      {(!posts || posts.length === 0) && <NoPosts />}

      <FlatList
        data={posts || []}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => setSelectedPost(item)}
          >
       <Image
  source={
    item?.imageUrl && item.imageUrl.trim() !== ""
      ? { uri: item.imageUrl }
      : require("@/assets/images/iconbg.png")
  }
  style={styles.gridImage}
  resizeMode="cover"
/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}