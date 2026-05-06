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
}: any) {
  return (
    <View style={styles.profileInfo}>
      {/* 🔥 AVATAR + STATS */}
      <View style={styles.avatarAndStats}>
        {/* AVATAR WITH GLOW */}
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
            source={{ uri: user.image || "" }}
            style={styles.avatar}
          />
        </Animated.View>

        {/* 📊 STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* 🧾 NAME + BIO */}
      <Text style={[styles.name, { marginLeft: 2 }]}>
        {user.fullname}
      </Text>

      {user.bio && (
        <Text style={[styles.bio, { marginLeft: 2 }]}>
          {user.bio}
        </Text>
      )}

      {/* ⚙️ ACTION BUTTONS */}
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