import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileInfo({
  user,
  glow,
  onEdit,
  isOnline,
  onShare,
  onFollowersPress,
  onFollowingPress,
}: any) {
  const [showAvatarModal, setShowAvatarModal] =
  useState(false);
  const router = useRouter();

const screenWidth = Dimensions.get("window").width;

const [flipped, setFlipped] =
  useState(false);

const [showBack, setShowBack] =
  useState(false);

const flipAnim =
  React.useRef(
    new Animated.Value(0)
  ).current;

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
        <TouchableOpacity
  activeOpacity={0.9}
  onPress={() =>
  setShowAvatarModal(true)
}
>
<Image
  source={
    user?.image?.trim()
      ? { uri: user.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.avatar}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
</TouchableOpacity>
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
       <TouchableOpacity
       disabled={!isOnline}
  activeOpacity={0.7}
  onPress={() =>
    router.push({
      pathname:
        "/posts/[userId]",

      params: {
        userId: user._id,
      },
    })
  }
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
</TouchableOpacity>

          {/* FOLLOWERS */}
          <TouchableOpacity
           disabled={!isOnline}
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
           disabled={!isOnline}
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
<View
  style={{
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  }}
>
  {/* EDIT PROFILE */}
  <TouchableOpacity
    style={[
      styles.editButton,
      {
        flex: 1,

        height: 46,

        opacity:
          isOnline
            ? 1
            : 0.45,
      },
    ]}
    disabled={!isOnline}
    onPress={onEdit}
  >
    <Text
      style={
        styles.editButtonText
      }
    >
      Edit Profile
    </Text>
  </TouchableOpacity>

  {/* SHARE APP */}
  <TouchableOpacity
  disabled={!isOnline}
    onPress={onShare}
    style={{
      width: 46,
      height: 46,

      borderRadius: 14,

      backgroundColor:
        "#0c0c0c",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <Ionicons
      name="share-outline"
      size={20}
      color="#fff"
    />
  </TouchableOpacity>

  {/* DISCOVER */}
  <TouchableOpacity
   disabled={!isOnline}
    onPress={() =>
      router.push(
        "/user/discover"
      )
    }
    style={{
      width: 46,
      height: 46,

      borderRadius: 14,

      backgroundColor:
        "#0c0c0c",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <Ionicons
      name="person-add-outline"
      size={21}
      color="#fff"
    />
  </TouchableOpacity>
</View>
      <Modal
  visible={showAvatarModal}
  transparent
  animationType="fade"
  statusBarTranslucent
>
  <Pressable
    onPress={() => setShowAvatarModal(false)}
    style={{
      flex: 1,
      backgroundColor: "#000000e6",
      justifyContent: "center",
      alignItems: "center",
    }}
  >

    {/* IMAGE */}
<View
  style={{
    width: screenWidth * 0.82,
    height: 360,
    position: "relative",
  }}
>

{/* FRONT CARD */}
<Animated.View
  style={{
    position: "absolute",

    width: "100%",
    height: "100%",

    backgroundColor: "#0c0c0c",

    borderRadius: 32,

    paddingHorizontal: 24,
    paddingTop: 22,

    overflow: "hidden",

    borderWidth: 1,

    borderColor:
      "rgba(34,197,94,0.18)",

    shadowColor: "#22c55e",
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 12,

    backfaceVisibility:
      "hidden",

  transform: [
  {
    scale:
      flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.96],
      }),
  },
],
  }}
>
  <View
  style={{
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 50,
  }}
>
<TouchableOpacity
  activeOpacity={0.8}
onPress={() => {
  Animated.sequence([
    Animated.timing(
      flipAnim,
      {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }
    ),

    Animated.timing(
      flipAnim,
      {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }
    ),
  ]).start();

  setShowBack(
    !showBack
  );
}}
  style={{
    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor:
      "rgba(34,197,94,0.08)",

    justifyContent:
      "center",

    alignItems:
      "center",

    borderWidth: 1,

    borderColor:
      "rgba(34,197,94,0.14)",
  }}
>
  <Ionicons
    name="shuffle-outline"
    size={18}
    color="#22c55e"
  />
</TouchableOpacity>
</View>
  {/* SPOTLIGHT */}
  <Animated.View
  style={{
opacity: showBack
  ? 0
  : 1,

pointerEvents:
  showBack
    ? "none"
    : "auto",
  }}
>
  
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <Ionicons
    name="leaf"
    size={16}
    color="#22c55e"
  />

  <Text
    style={{
      color: "#22c55e",
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 2,
      marginLeft: 6,
    }}
  >
    SPOTLIGHT
  </Text>
</View>

  {/* PROFILE PIC */}
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Image
      source={
        user?.image?.trim()
          ? { uri: user.image }
          : require("@/assets/images/icons/iconbg.webp")
      }
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={120}
      style={{
        width: 140,
        height: 140,
        borderRadius: 999,
        marginBottom:10,

        borderWidth: 4,
      borderColor: "#28a054",
      }}
    />
  </View>

  {/* NAME */}
  <Text
    style={{
      color: "#ffffff",
      fontSize: 28,
      fontWeight: "700",
      marginTop: 24,
    }}
  >
    {user?.fullname}
  </Text>

  {/* USERNAME */}
  <Text
    style={{
      color: "#9ca3af",
      fontSize: 15,
      marginTop: 6,
    }}
  >
    @{user?.username}
  </Text>

  <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  }}
>
  <Ionicons
    name="shield-checkmark"
    size={14}
    color="#22c55e"
  />

  <Text
    style={{
      color: "#22c55e",
      fontSize: 12,
      marginLeft: 6,
      fontWeight: "600",
    }}
  >
    Spotlight Member
  </Text>
</View>
</Animated.View>

<Animated.View
  style={{
    position: "absolute",
    top: 0,
    bottom:0,
    left: 0,
    right: 0,

  opacity: showBack
  ? 1
  : 0,

pointerEvents:
  showBack
    ? "auto"
    : "none",
  }}
>
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 320,
    }}
  >
    <Animated.View
      style={{
        width: 160,
        height: 160,
        borderRadius: 18,

        borderWidth: 2,
        borderColor:
          "#22c55e",

        justifyContent:
          "center",

        alignItems:
          "center",

        backgroundColor:
          "#111",
      }}
    >
      <Ionicons
        name="qr-code"
        size={90}
        color="#22c55e"
      />
    </Animated.View>

    <Text
      style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 22,
      }}
    >
      QR Profile
    </Text>

    <Text
      style={{
        color: "#9ca3af",
        marginTop: 8,
        textAlign: "center",
      }}
    >
      Coming Soon
    </Text>

    <Text
      style={{
        color: "#6b7280",
        marginTop: 12,
        fontSize: 12,
        textAlign: "center",
      }}
    >
      Share your Spotlight profile
      instantly using a QR code
    </Text>
  </View>
</Animated.View>
</Animated.View>
</View>
  </Pressable>
</Modal>
    </View>
  );
}