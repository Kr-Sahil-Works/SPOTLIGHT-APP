import { api } from "@/convex/_generated/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import UserPostCard from "./UserPostCard";

export default function UserPostsPage() {
  const router = useRouter();

  const {
    userId,
    postId,
  } =
    useLocalSearchParams();

  const posts = useQuery(
    api.posts.index
      .getPostsByUser,
    {
      userId:
        userId as any,
    }
  );

  if (
    posts === undefined
  ) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            "#000",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#00ff88"
        />
      </View>
    );
  }

  const startIndex =
    Math.max(
      0,
      posts.findIndex(
        (p) =>
          String(p._id) ===
          String(postId)
      )
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          "#000",
      }}
    >
      <View
        style={{
          height: 58,
          flexDirection:
            "row",
          alignItems:
            "center",
          paddingHorizontal:
            16,

          borderBottomWidth:
            1,

          borderBottomColor:
            "rgba(255,255,255,0.06)",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight:
              "700",
            marginLeft: 14,
          }}
        >
          Posts
        </Text>
      </View>

      <FlashList
        data={posts}
        initialScrollIndex={
          startIndex
        }
        getItemType={() => "post"}
renderItem={({ item }) => (
 <UserPostCard
  post={item}
/>
)}
        keyExtractor={(
          item
        ) =>
          item._id.toString()
        }
      />
    </View>
  );
}