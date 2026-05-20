import { Loader } from "@/components/LoaderSkeletons/Loader";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";

import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  PanResponder,
  ScrollView,
  Share,
  View
} from "react-native";

import ProfileGrid from "@/app/Page_components/profile/grid/ProfileGrid";
import ProfileHeader from "@/app/Page_components/profile/header/ProfileHeader";
import SecureOverlay from "@/app/Page_components/profile/header/SecureOverlay";
import ProfileInfo from "@/app/Page_components/profile/info/ProfileInfo";
import ProfileTabs from "@/app/Page_components/profile/tabs/ProfileTabs";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";


/* ✅ MODALS */
import EditProfileModal from "@/app/Page_components/profile/modals/EditProfileModal";
import ImagePreviewModal from "@/app/Page_components/profile/modals/ImagePreviewModal";

/* ✅ HOOKS */
import { Id } from "@/convex/_generated/dataModel";
import useProfileTabs from "@/hooks/useProfileTabs";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useAuth();

  /* 🔥 DATA */
  const currentUser = useQuery(api.users.index.getCurrentUser);
  const posts = useQuery(api.posts.index.getPostsByUser, {});
  const updateProfile = useMutation(api.users.index.updateProfile);


  const generateUploadUrl = useMutation(
  api.files.generateUploadUrl
);

const deleteStorageFile = useMutation(
  api.files.deleteStorageFile
);

const getStorageUrl = useMutation(
  api.files.getStorageUrl
);

  /* 🔥 STATES */
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [saving, setSaving] =
  useState(false);

  const [imageVersion, setImageVersion] =
  useState(Date.now());
  
  const [hasLocalChanges, setHasLocalChanges] =
  useState(false);

const [editedProfile, setEditedProfile] = useState({
  username: "",
  fullname: "",
  bio: "",
  image: "",
  imageStorageId:
  undefined as
    | Id<"_storage">
    | undefined,
});

  /* 🔥 ANIMATIONS */
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  const [showSecure, setShowSecure] = useState(false);
  const secureAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const tickScale = useRef(new Animated.Value(0)).current;



useFocusEffect(
  React.useCallback(() => {
    setMenuOpen(false);
    setShowSecure(false);

    // 🔥 CRITICAL FIX
    menuAnim.setValue(0);
  }, [])
);

  /* 🔥 TABS HOOK */
  const {
    activeTab,
    tabIndex,
    containerX,
    tabLayouts,
    setTabLayouts,
    switchTab,
    tabPan,
    width,
  } = useProfileTabs();

const modalPanResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dy) > 8 && Math.abs(g.dx) < 10,

    onPanResponderMove: (_, g) => {
      if (g.dy > 0) {
        translateY.setValue(g.dy);
      }
    },

    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
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

  /* 🔥 SHARE */
  const WEBSITE_URL = "https://www.sleekchats.com";

  const handleShare = async () => {
    try {
      await Share.share({
        message: WEBSITE_URL,
      });
    } catch {
      await Clipboard.setStringAsync(WEBSITE_URL);
      Alert.alert("Link copied");
    }
  };

  /* 🔥 LOAD PROFILE */
useEffect(() => {
  if (
    currentUser &&
    !hasLocalChanges
  ) {
    setEditedProfile({
      username:
        currentUser.username || "",
      fullname:
        currentUser.fullname || "",
      bio: currentUser.bio || "",
      image:
        currentUser.image || "",
      imageStorageId:
        currentUser.imageStorageId,
    });
  }
}, [currentUser, hasLocalChanges]);

  /* 🔥 GLOW ANIMATION */
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
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  const pickImage = async () => {
  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

  if (result.canceled) return;

  const asset = result.assets[0];

 setHasLocalChanges(true);

setEditedProfile((p: any) => ({
  ...p,
  image: asset.uri,
}));
};

const handleSaveProfile = async () => {
  try {
    setSaving(true);

    let imageUrl = editedProfile.image;
    let imageStorageId =
      editedProfile.imageStorageId;

    /* NEW LOCAL IMAGE */
    if (
      editedProfile.image?.startsWith(
        "file"
      )
    ) {
      /* GET UPLOAD URL */
      const uploadUrl =
        await generateUploadUrl();

      /* FILE -> BLOB */
      const response = await fetch(
        editedProfile.image
      );

      const blob = await response.blob();

      /* UPLOAD */
      const uploadResult = await fetch(
        uploadUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": blob.type,
          },
          body: blob,
        }
      );

      const { storageId } =
        await uploadResult.json();

      /* DELETE OLD IMAGE */
     if (
  currentUser?.imageStorageId
) {
        try {
        if (currentUser?.imageStorageId) {
  try {
    await deleteStorageFile({
      storageId:
        currentUser.imageStorageId,
    });
  } catch {}
}
        } catch {}
      }

      imageStorageId = storageId;

      imageUrl =
  await getStorageUrl({
    storageId,
  });
    }

    await updateProfile({
      username:
        editedProfile.username,
      fullname:
        editedProfile.fullname,
      bio: editedProfile.bio,
      image: imageUrl,
      imageStorageId,
    });
setHasLocalChanges(false);
setImageVersion(Date.now());
    setIsEditModalVisible(false);
  } finally {
    setSaving(false);
  }
};

  /* 🔥 LOADING */
  if (!currentUser || posts === undefined) return <Loader />;
  if (loggingOut) return <Loader />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <ProfileHeader
        username={currentUser.username}
        showSecure={showSecure}
        setShowSecure={setShowSecure}
        pressScale={pressScale}
        tickScale={tickScale}
        secureAnim={secureAnim}
        menuAnim={menuAnim}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        router={router}
      />

      {/* OVERLAY */}
      <SecureOverlay
        showSecure={showSecure}
        secureAnim={secureAnim}
        tickScale={tickScale}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE INFO */}
   <ProfileInfo
  user={currentUser}
  glow={glow}
  onEdit={() => setIsEditModalVisible(true)}
  onShare={handleShare}
  onFollowersPress={() =>
    router.push({
  pathname: "/user/connections",
      params: {
        userId: currentUser._id,
        type: "followers",
      },
    })
  }
  onFollowingPress={() =>
    router.push({
    pathname: "/user/connections",
      params: {
        userId: currentUser._id,
        type: "following",
      },
    })
  }
/>
        {/* TABS */}
        <ProfileTabs
          activeTab={activeTab}
          switchTab={switchTab}
          tabLayouts={tabLayouts}
          setTabLayouts={setTabLayouts}
          tabIndex={tabIndex}
        />

        {/* GRID + SWIPE */}
        <Animated.View
          {...tabPan.panHandlers}
          style={{
            flexDirection: "row",
            width: width * 3,
            transform: [{ translateX: containerX }],
          }}
        >
          <View style={{ width }}>
            <ProfileGrid
              posts={posts}
              setSelectedPost={setSelectedPost}
            />
          </View>

          <View style={{ width }} />
          <View style={{ width }} />
        </Animated.View>
      </ScrollView>

      {/* MODALS */}
      <ImagePreviewModal
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        scale={scale}
        translateY={translateY}
         panResponder={modalPanResponder} 
      />

   <EditProfileModal
  visible={isEditModalVisible}
  setVisible={setIsEditModalVisible}
  profile={editedProfile}
  setProfile={setEditedProfile}
  originalProfile={currentUser}
  onSave={handleSaveProfile}
  onChangePhoto={pickImage}
  saving={saving}
  btnScale={btnScale}
  setHasLocalChanges={
  setHasLocalChanges
}
/>
    </View>
  );
}