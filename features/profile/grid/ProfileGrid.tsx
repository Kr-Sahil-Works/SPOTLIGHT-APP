import { styles } from "@/styles/profile.styles";
import React from "react";
import {
  FlatList, TouchableOpacity,
  View
} from "react-native";
import NoPosts from "./NoPosts";

import { AppImage } from "@/shared/ui/AppImage";
import { useRouter } from "expo-router";

export default function ProfileGrid({
  posts,
  setSelectedPost,
}: any) {
  const router = useRouter();
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
onPress={() => {
  router.push({
    pathname:
      "/posts/[userId]",

    params: {
      userId:
        item.userId,

      postId:
        item._id,
    },
  });
}}

onLongPress={() =>
  setSelectedPost(item)
}

delayLongPress={400}
          >
<AppImage
  uri={item?.imageUrl}
  source={
    item?.imageUrl?.trim()
      ? undefined
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.gridImage}
  contentFit="cover"
/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}