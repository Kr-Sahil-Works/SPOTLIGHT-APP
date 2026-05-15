import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Image as RNImage,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileInfo({
  user,
  glow,
  onEdit,
  onShare,
  onFollowersPress,
  onFollowingPress,
}: any) {
  return (
    <View style={styles.profileInfo}>
      {/* AVATAR + STATS */}
      <View style={styles.avatarAndStats}>
        {/* AVATAR */}
        <Animated.View
          style={{
            shadowColor: COLORS.primary,
            shadowOpacity: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.6],
            }),
            shadowRadius: 12,
          }}
        >
          <RNImage
            source={{
              uri: user?.image || "",
            }}
            style={styles.avatar}
          />
        </Animated.View>

        {/* STATS */}
        <View
          style={[
            styles.statsContainer,
            {
              flex: 1,
            },
          ]}
        >
          {/* POSTS */}
          <View
            style={[
              styles.statItem,
              {
                flex: 1,
                alignItems: "center",
              },
            ]}
          >
            <Text style={styles.statNumber}>
              {user?.posts || 0}
            </Text>

            <Text style={styles.statLabel}>
              Posts
            </Text>
          </View>

          {/* FOLLOWERS */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFollowersPress?.()}
            style={[
              styles.statItem,
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={styles.statNumber}>
              {user?.followers || 0}
            </Text>

            <Text style={styles.statLabel}>
              Followers
            </Text>
          </TouchableOpacity>

          {/* FOLLOWING */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFollowingPress?.()}
            style={[
              styles.statItem,
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={styles.statNumber}>
              {user?.following || 0}
            </Text>

            <Text style={styles.statLabel}>
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* NAME */}
      <Text
        style={[
          styles.name,
          {
            marginLeft: 2,
          },
        ]}
      >
        {user?.fullname}
      </Text>

      {/* BIO */}
      {!!user?.bio && (
        <Text
          style={[
            styles.bio,
            {
              marginLeft: 2,
            },
          ]}
        >
          {user.bio}
        </Text>
      )}

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
        >
          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={onShare}
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}