import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, Image as RNImage, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const profile = useQuery(api.users.index.getUserProfile, { id: id as Id<"users"> });
  const posts = useQuery(api.posts.index.getPostsByUser, { userId: id as Id<"users"> });
  const isFollowing = useQuery(api.users.index.isFollowing, { followingId: id as Id<"users"> });

  const toggleFollow = useMutation(api.users.index.toggleFollow);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.username}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            {/* AVATAR */}
         {profile.image && (
<RNImage
  source={{ uri: profile.image }}
  style={styles.avatar}
/>
)}

            {/* STATS */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

         <Pressable
  style={[
    {
      marginTop: 16,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: isFollowing ? "#111" : COLORS.lime,
      borderWidth: isFollowing ? 1 : 0,
      borderColor: "rgba(255,255,255,0.08)",
    },
  ]}
  onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
>
<Text
  style={{
    color: isFollowing ? "#fff" : "#e8f8bc",
    fontWeight: "600",
    fontSize: 14,
  }}
>
  {isFollowing ? "Following" : "Follow"}
</Text>
          </Pressable>
        </View>

        <View style={{ paddingTop: 10 }}>
          {posts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
               <TouchableOpacity style={styles.gridItem}>
<RNImage
  source={{ uri: item.imageUrl }}
  style={styles.gridImage}
/>
</TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}