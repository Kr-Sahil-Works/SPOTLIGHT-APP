import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  PanResponder,
  ScrollView, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const { width } = Dimensions.get("window");

export default function Profile() {
// ✅ ALL HOOKS FIRST (no conditions, no JSX)
const { signOut, userId } = useAuth();

const [showLogoutModal, setShowLogoutModal] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [isEditModalVisible, setIsEditModalVisible] = useState(false);
type Post = {
  _id: string;
  imageUrl: string;
  caption?: string;
};

const [selectedPost, setSelectedPost] = useState<Post | null>(null);

const scale = useRef(new Animated.Value(1)).current;
const translateY = useRef(new Animated.Value(0)).current;
const btnScale = useRef(new Animated.Value(1)).current;
const glow = useRef(new Animated.Value(0)).current;



/* 🔥 PAN GESTURE (swipe down to close) */
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dy) > 5;
    },

    onPanResponderMove: (_, gesture) => {
      translateY.setValue(gesture.dy);
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 120) {
        // close
        Animated.timing(translateY, {
          toValue: 500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setSelectedPost(null);
          translateY.setValue(0);
        });
      } else {
        // bounce back
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;


  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const [editedProfile, setEditedProfile] = useState({
  fullname: "",
  bio: "",
});

useEffect(() => {
  if (currentUser) {
    setEditedProfile({
      fullname: currentUser.fullname || "",
      bio: currentUser.bio || "",
    });
  }
}, [currentUser]);

 
  const posts = useQuery(api.posts.getPostsByUser, {});

  const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(glow, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(glow, {
        toValue: 0,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ])
  ).start();
}, []);

if (!currentUser || posts === undefined) return <Loader />;
if (loggingOut) return <Loader />;

return (
  <View style={styles.container}>
    
    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.username}>{currentUser.username}</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.profileInfo}>
        
        {/* AVATAR & STATS */}
        <View style={styles.avatarAndStats}>
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
  <Image source={currentUser.image} style={styles.avatar} />
</Animated.View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <Text style={styles.name}>{currentUser.fullname}</Text>
        {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

        {/* ACTIONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {posts.length === 0 && <NoPostsFound />}

      <FlatList
        data={posts}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => setSelectedPost(item)}
          >
            <Image
              source={item.imageUrl}
              style={styles.gridImage}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        )}
      />
    </ScrollView>

    {/* ✨ IMAGE PREVIEW MODAL */}
<Modal visible={!!selectedPost} transparent animationType="fade">
  <BlurView
    intensity={80}
    tint="dark"
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    }}
  >
    {/* CLOSE BUTTON */}
    <TouchableOpacity
      onPress={() => setSelectedPost(null)}
      style={{
        position: "absolute",
        top: 60,
        right: 20,
        zIndex: 20,

        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="close" size={22} color="#fff" />
    </TouchableOpacity>

    {selectedPost && (
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#000",

          transform: [
            { translateY },
            { scale },
          ],

          shadowColor: "#000",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* IMAGE */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => {
            Animated.spring(scale, {
              toValue: 1.05,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Image
            source={selectedPost.imageUrl}
            style={{
              width: "100%",
              aspectRatio: 1,
            }}
            contentFit="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    )}
  </BlurView>
</Modal>

    {/* ✨ EDIT PROFILE MODAL */}
<Modal visible={isEditModalVisible} transparent animationType="fade">
  <BlurView
    intensity={60}
    tint="dark"
    style={{
      flex: 1,
      justifyContent: "flex-end",
    }}
  >
    <View
      style={{
        backgroundColor: "#0a0a0a",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* HANDLE */}
      <View
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#333",
          alignSelf: "center",
          marginBottom: 16,
        }}
      />

      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Edit Profile
        </Text>

        <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
          <Ionicons name="close" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* NAME */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "#888", marginBottom: 6 }}>Name</Text>
        <TextInput
          value={editedProfile.fullname}
          onChangeText={(text) =>
            setEditedProfile((prev) => ({ ...prev, fullname: text }))
          }
          style={{
            backgroundColor: "#111",
            borderRadius: 12,
            padding: 12,
            color: "#fff",

            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
          placeholderTextColor="#666"
        />
      </View>

      {/* BIO */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: "#888", marginBottom: 6 }}>Bio</Text>
        <TextInput
          value={editedProfile.bio}
          onChangeText={(text) =>
            setEditedProfile((prev) => ({ ...prev, bio: text }))
          }
          multiline
          style={{
            backgroundColor: "#111",
            borderRadius: 12,
            padding: 12,
            color: "#fff",
            height: 90,
            textAlignVertical: "top",

            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
          placeholderTextColor="#666"
        />
      </View>

      {/* SAVE BUTTON */}
  <TouchableOpacity
  style={styles.saveButton}
  onPress={handleSaveProfile}
  onPressIn={() => {
    Animated.spring(btnScale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }}
  onPressOut={() => {
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }}
>
  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
    <Text style={styles.saveButtonText}>Save Changes</Text>
  </Animated.View>
</TouchableOpacity>
    </View>
  </BlurView>
</Modal>

    {/* 🔥 LOGOUT MODAL (FIXED POSITION) */}
    <Modal visible={showLogoutModal} transparent animationType="fade">
      <BlurView
        intensity={70}
        tint="dark"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "82%",
            borderRadius: 20,
            padding: 22,
            backgroundColor: "rgba(20,20,20,0.95)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Logout?
          </Text>

          <Text
            style={{
              color: "#aaa",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 22,
            }}
          >
            You will need to login again to continue.
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            
            {/* CANCEL */}
            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: "#111",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#aaa" }}>Cancel</Text>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              onPress={() => {
                setShowLogoutModal(false);
                setLoggingOut(true);

                setTimeout(async () => {
                  await signOut();
                }, 200);
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: "#ff3b30",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>

  </View>

  
);

}


function NoPostsFound() {
  return (
    <View style={styles.noPostsContainer}>
      <Ionicons name="images-outline" size={44} color="#555" />

      <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
        No posts yet
      </Text>

      <Text style={{ color: "#888", fontSize: 14 }}>
        Share your first moment ✨
      </Text>
    </View>
  );
}