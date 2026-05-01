import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  PanResponder,
  Image as RNImage,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const { width } = Dimensions.get("window");

export default function Profile() {


const WEBSITE_URL = "https://www.sleekchats.com";

const handleShare = async () => {
  const message =
    "spotlight ✨\nminimal chats. real people.\n\njoin here ↓\n" +
    WEBSITE_URL;

  try {
    const result = await Share.share({
      message,
      url: WEBSITE_URL, // iOS support
    });

    // optional log
    if (result.action === Share.sharedAction) {
      console.log("Shared successfully");
    }
  } catch (error) {
    // 🔥 FALLBACK → COPY LINK
    await Clipboard.setStringAsync(WEBSITE_URL);

    Alert.alert(
      "Link copied",
      "Could not open share sheet. Link copied to clipboard."
    );
  }
};


// ✅ ALL HOOKS FIRST (no conditions, no JSX)
const { signOut, userId } = useAuth();
const router = useRouter();
const [showLogoutModal, setShowLogoutModal] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [isEditModalVisible, setIsEditModalVisible] = useState(false);
type Post = {
  _id: string;
  imageUrl: string;
  caption?: string;
};

const [selectedPost, setSelectedPost] = useState<Post | null>(null);
const [activeTab, setActiveTab] = useState<"grid" | "reels" | "tags">("grid");

const tabIndex = useRef(new Animated.Value(0)).current;
const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);
const containerX = useRef(new Animated.Value(0)).current;

const scale = useRef(new Animated.Value(1)).current;
const translateY = useRef(new Animated.Value(0)).current;
const btnScale = useRef(new Animated.Value(1)).current;
const glow = useRef(new Animated.Value(0)).current;
const menuAnim = useRef(new Animated.Value(0)).current;
const backAnim = useRef(new Animated.Value(0)).current;
const [menuOpen, setMenuOpen] = useState(false);

const [showSecure, setShowSecure] = useState(false);
const secureAnim = useRef(new Animated.Value(0)).current;
const pressScale = useRef(new Animated.Value(1)).current;
const tickScale = useRef(new Animated.Value(0)).current;

const switchTab = (index: number) => {
  Animated.spring(tabIndex, {
    toValue: index,
    stiffness: 180,
    damping: 18,
    mass: 0.6,
    useNativeDriver: true,
  }).start();

  Animated.spring(containerX, {
    toValue: -index * width,
    stiffness: 140,
    damping: 16,
    mass: 0.7,
    useNativeDriver: true,
  }).start();

  setActiveTab(index === 0 ? "grid" : index === 1 ? "reels" : "tags");
};

const tabPan = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => false,

    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 12 && Math.abs(g.dy) < 8,

    onPanResponderTerminationRequest: () => true,

    onPanResponderRelease: (_, g) => {
      const velocity = g.vx;

      if (Math.abs(g.dx) < 25 && Math.abs(velocity) < 0.2) return;

      if (velocity < -0.4 || g.dx < -50) {
        if (activeTab === "grid") switchTab(1);
        else if (activeTab === "reels") switchTab(2);
      } else if (velocity > 0.4 || g.dx > 50) {
        if (activeTab === "tags") switchTab(1);
        else if (activeTab === "reels") switchTab(0);
      }
    },
  })
).current;

/* 🔥 PAN GESTURE (swipe down to close) */
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => false,

    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dy) > 12 && Math.abs(gesture.dx) < 10,

    onPanResponderTerminationRequest: () => true,

    onPanResponderMove: (_, gesture) => {
      translateY.setValue(gesture.dy);
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 120) {
        Animated.timing(translateY, {
          toValue: 500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setSelectedPost(null);
          translateY.setValue(0);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;


const currentUser = useQuery(api.users.index.getCurrentUser);

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

useFocusEffect(
  React.useCallback(() => {
    setMenuOpen(false);
backAnim.setValue(0);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [])
);
 

useEffect(() => {
  if (!showSecure) return;

  // 🔥 auto close after 5s
  const timer = setTimeout(() => {
    Animated.timing(secureAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSecure(false);
    });
  }, 5000);

  return () => clearTimeout(timer);
}, [showSecure]);


  const posts = useQuery(api.posts.index.getPostsByUser, {});

const updateProfile = useMutation(api.users.index.updateProfile);

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
<View
  style={[
    styles.header,
    {
      zIndex: 100,
      elevation: 100,
      flexDirection: "row",
      justifyContent: "space-between", // 🔥 important
      alignItems: "center",
    },
  ]}
>
{/* LEFT LOCK */}
<TouchableOpacity
  disabled={showSecure}
  activeOpacity={0.6}
  onPress={() => {
    if (showSecure) return;

    setShowSecure(true);
    tickScale.setValue(0);
Animated.spring(tickScale, {
  toValue: 1,
  friction: 5,
  useNativeDriver: true,
}).start();

    secureAnim.setValue(0);

    Animated.timing(secureAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    // auto close
    setTimeout(() => {
      Animated.timing(secureAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowSecure(false));
    }, 2000);
  }}
  onPressIn={() => {
    Animated.spring(pressScale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }}
  onPressOut={() => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }}
style={{
  width: 38,
  height: 38,
  borderRadius: 10, // 🔥 perfect circle
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0000000f",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
}}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Animated.View style={{ transform: [{ scale: pressScale }] }}>
    <Ionicons name="lock-closed-outline" size={22} color="#22c55e" />
  </Animated.View>
</TouchableOpacity>

{/* CENTER USERNAME */}
<Text
  pointerEvents="none"
  style={[
    styles.username,
    {
      position: "absolute",
      left: 60,   // 🔥 avoid left button
      right: 60,  // 🔥 avoid right button
      textAlign: "center",
    },
  ]}
>
  @{currentUser.username}
</Text>

{/* RIGHT MENU */}
<View style={styles.headerRight}>
<TouchableOpacity
style={[
  styles.headerIcon,
  {
    width: 38,
    height: 38,
    borderRadius: 14, // 🔥 square rounded
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000000f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
]}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    onPress={() => {
      if (menuOpen) return;

      setMenuOpen(true);

      Animated.spring(menuAnim, {
        toValue: 1,
        tension: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        router.push("/settings");
      }, 140);
    }}
  >


  <View style={{ width: 16, height: 14, justifyContent: "center", alignItems: "center" }}>
  
  {/* TOP */}
  <Animated.View
    style={{
      position: "absolute",
      width: 16,
      height: 2,
      backgroundColor: "#22c55e",
      borderRadius: 2,
      transform: [
        {
          translateY: menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-5, 0],
          }),
        },
        {
          rotate: menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"],
          }),
        },
      ],
    }}
  />

  {/* MIDDLE */}
  <Animated.View
    style={{
      width: 16,
      height: 2,
      backgroundColor: "#22c55e",
      borderRadius: 2,
      opacity: menuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }}
  />

  {/* BOTTOM */}
  <Animated.View
    style={{
      position: "absolute",
      width: 16,
      height: 2,
      backgroundColor: "#22c55e",
      borderRadius: 2,
      transform: [
        {
          translateY: menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 0],
          }),
        },
        {
          rotate: menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "-45deg"],
          }),
        },
      ],
    }}
  />

</View>
    </TouchableOpacity>
  </View>
</View>

    <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingTop: 20 }}
>
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
<RNImage
  source={{ uri: currentUser.image || "" }}
  style={styles.avatar}
/>
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

        <Text style={[styles.name, { marginLeft: 2 }]}>{currentUser.fullname}</Text>
        {currentUser.bio && <Text style={[styles.bio, { marginLeft: 2 }]}>{currentUser.bio}</Text>}

        {/* ACTIONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
<TouchableOpacity
  style={styles.shareButton}
  onPress={handleShare}
>
            <Ionicons name="share-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 TABS */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
paddingHorizontal: width / 6 - 12,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.06)",
    marginTop: 10,
    position: "relative",
  }}
>
  <TouchableOpacity
  onPress={() => switchTab(0)}
  onLayout={(e) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const copy = [...prev];
      copy[0] = { x, width };
      return copy;
    });
  }}
>
    <Ionicons
      name="grid-outline"
      size={22}
      color={activeTab === "grid" ? "#fff" : "#555"}
    />
  </TouchableOpacity>

  <TouchableOpacity
  onPress={() => switchTab(1)}
  onLayout={(e) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const copy = [...prev];
      copy[1] = { x, width };
      return copy;
    });
  }}
>
    <Ionicons
      name="play-outline"
      size={22}
      color={activeTab === "reels" ? "#fff" : "#555"}
    />
  </TouchableOpacity>

  <TouchableOpacity
  onPress={() => switchTab(2)}
  onLayout={(e) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const copy = [...prev];
      copy[2] = { x, width };
      return copy;
    });
  }}
>
    <Ionicons
      name="person-outline"
      size={22}
      color={activeTab === "tags" ? "#fff" : "#555"}
    />
  </TouchableOpacity>

  {/* 🔥 UNDERLINE (NOW INSIDE) */}
{tabLayouts.length === 3 && (
  <Animated.View
    style={{
      position: "absolute",
      bottom: 0,
      height: 2,
      width: 28,
      borderRadius: 2,
      backgroundColor: "#fff",
      transform: [
        {
          translateX: tabIndex.interpolate({
            inputRange: [0, 1, 2],
            outputRange: tabLayouts.map(
              (l) => l.x + l.width / 2 - 14
            ),
          }),
        },
      ],
    }}
  />
)}
</View>



<View style={{ flex: 1 }}>
<Animated.View
  {...tabPan.panHandlers}
  style={{
    flexDirection: "row",
    width: width * 3,
    transform: [{ translateX: containerX }],
  }}
>
  {/* GRID */}
  <View style={{ width }}>
    {(!posts || posts.length === 0) && <NoPostsFound />}
    <FlatList
      data={posts || []}
      numColumns={3}
      keyExtractor={(item) => item._id.toString()}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => setSelectedPost(item)}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.gridImage}
            contentFit="cover"
          />
        </TouchableOpacity>
      )}
    />
  </View>

  {/* REELS */}
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <Ionicons name="play-outline" size={44} color="#555" />
    <Text style={styles.noPostsText}>No reels yet</Text>
  </View>

  {/* TAGS */}
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <Ionicons name="person-outline" size={44} color="#555" />
    <Text style={styles.noPostsText}>No tagged posts</Text>
  </View>
</Animated.View>
</View>


{showSecure && (
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.47)",
    }}
  >
    <BlurView intensity={55} tint="dark" style={{ flex: 1 }}>
  <Animated.View
    pointerEvents="none"
    style={{
      position: "absolute",
      bottom: 90,
      left: 40,
      right: 40,
      padding: 14,
      borderRadius: 16,
      backgroundColor: "rgba(10,10,10,0.85)",
      borderWidth: 1,
      borderColor: "rgba(34,197,94,0.4)",
flexDirection: "row",
alignItems: "center",
justifyContent: "center",

 transform: [
  {
    translateY: secureAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -40], // 🔥 center lift
    }),
  },
],
      opacity: secureAnim,
    }}
  >
    <Animated.View style={{ transform: [{ scale: tickScale }] }}>
  <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
</Animated.View>

    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ color: "#22c55e", fontWeight: "600" }}>
        Verified Secure
      </Text>
      <Text style={{ color: "#aaa", fontSize: 12 }}>
        End-to-end encrypted
      </Text>
    </View>
  </Animated.View>
    </BlurView>
  </View>
)}


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
        {selectedPost?.imageUrl && (
<RNImage
  source={{ uri: selectedPost.imageUrl }}
  style={{
    width: "100%",
    aspectRatio: 1,
  }}
  resizeMode="cover"
/>
)}
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

<View style={{ flex: 1, alignItems: "center" }}>
            
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

  // 🚀 FORCE REDIRECT (FIX)c
  router.replace("/(auth)/login");
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