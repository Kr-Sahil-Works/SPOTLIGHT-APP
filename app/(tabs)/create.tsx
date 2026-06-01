import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
const [blockingUI, setBlockingUI] = useState(false);

const [showToast, setShowToast] = useState(false);
const toastAnim = useRef(new Animated.Value(0)).current;


  const shimmer = useRef(new Animated.Value(0)).current;
const breathe = useRef(new Animated.Value(0.6)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shimmer, {
        toValue: 0,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  Animated.loop(
    Animated.sequence([
      Animated.timing(breathe, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(breathe, {
        toValue: 0.6,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

  const generateUploadUrl = useMutation(api.posts.index.generateUploadUrl);
  const createPost = useMutation(api.posts.index.createPost);
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    if (!selectedImage) return;
setIsSharing(true);
setBlockingUI(true);


    try {
      setIsSharing(true);

      const uploadUrl = await generateUploadUrl();

      const imageResponse = await fetch(selectedImage);
      const blob = await imageResponse.blob();

      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": blob.type || "image/jpeg",
        },
        body: blob,
      });

      if (!uploadResult.ok) throw new Error("Upload failed");

      const { storageId } = await uploadResult.json();

      await createPost({
  storageId,
  caption: caption.trim(),
});

      setSelectedImage(null);
      setCaption("");



setShowToast(true);

Animated.timing(toastAnim, {
  toValue: 1,
  duration: 250,
  useNativeDriver: true,
}).start();

setTimeout(() => {
router.replace("/");
}, 500);


    } catch (error) {
      console.log("Error sharing post:", error);
    } finally {
  setIsSharing(false);
  setBlockingUI(false);

    }
  };

  const translateX = shimmer.interpolate({
  inputRange: [0, 1],
  outputRange: [-300, 300],
});

const Shimmer = () => (
  <Animated.View
    style={[
      StyleSheet.absoluteFillObject,
      {
        opacity: 0.25,
        transform: [{ translateX }],
      },
    ]}
  />
);

const RainbowLoader = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400], // slide across screen
  });

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        backgroundColor: "transparent",
      }}
    >
      <Animated.View
        style={{
          width: 200,
          height: 3,
          borderRadius: 2,
          transform: [{ translateX }],
          backgroundColor: "transparent",
        }}
      >
        {/* 🌈 FAKE GRADIENT (multi color segments) */}
        <View style={{ flexDirection: "row", flex: 1 }}>
         <View style={{ flex: 1, backgroundColor: "#aeff18" }} />
          <View style={{ flex: 1, backgroundColor: "#f5c918" }} />
          <View style={{ flex: 1, backgroundColor: "#5c9702" }} />
          <View style={{ flex: 1, backgroundColor: "#d1d100" }} />
          <View style={{ flex: 1, backgroundColor: "#0dff00" }} />
        </View>
      </Animated.View>
    </View>
  );
};



  /* ================= EMPTY STATE ================= */

if (!selectedImage) {
  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      
      {/* HEADER */}
      <View
        style={{
          height: 70,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.05)",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={COLORS.white} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: COLORS.primary,
            letterSpacing: 1,
          }}
        >
          New Post
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* CENTER POST-LIKE BOX */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.9}
          style={{
            width: "100%",
            borderRadius: 20,
            backgroundColor: "#0a0a0a",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          
          {/* HEADER FAKE */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
            }}
          >
           <View
  style={{
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111",
    overflow: "hidden",
    marginRight: 8,
  }}
>
  <Shimmer />
</View>

     <View
  style={{
    width: 80,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111",
    overflow: "hidden",
  }}
>
  <Shimmer />
</View>
</View>
          {/* IMAGE */}
        <View
  style={{
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }}
>
  <Animated.View style={{ opacity: breathe }}>
    <Ionicons name="image-outline" size={42} color={COLORS.primary} />
    <Text style={{ color: "#888", marginTop: 6 }}>
      Tap to select image
    </Text>
  </Animated.View>

  <Shimmer />
</View>

          {/* ACTIONS */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 14 }}>
              <Ionicons name="heart-outline" size={22} color="#666" />
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
            </View>

            <Ionicons name="bookmark-outline" size={20} color="#666" />
          </View>

          {/* TEXT */}
          <View style={{ paddingHorizontal: 10, paddingBottom: 12 }}>
          <View
  style={{
    width: "40%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111",
    overflow: "hidden",
    marginBottom: 6,
  }}
>
  <Shimmer />
</View>

         <View
  style={{
    width: "70%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111",
    overflow: "hidden",
  }}
>
  <Shimmer />
</View>
   </View>
        </TouchableOpacity>
   
      </View>
      </View>
  );
}

  /* ================= NORMAL FLOW ================= */

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
    {/* ✅ ADD HERE */}
    {blockingUI && <RainbowLoader />}
      {showToast && (
  <Animated.View
    style={{
      position: "absolute",
      bottom: 100,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.8)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      flexDirection: "row",
      alignItems: "center",
      transform: [
        {
          translateY: toastAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0],
          }),
        },
        {
          scale: toastAnim,
        },
      ],
      opacity: toastAnim,
      zIndex: 999,
    }}
  >
    <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
    <Text style={{ color: "#fff", marginLeft: 8 }}>
      Uploaded
    </Text>
  </Animated.View>
)}
      <View style={styles.contentContainer}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption("");
            }}
            disabled={isSharing}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Post</Text>

          <TouchableOpacity
            style={[
              styles.shareButton,
              isSharing && styles.shareButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            
            {/* IMAGE */}
            <View style={styles.imageSection}>
        <Image
  source={
    selectedImage?.trim()
      ? { uri: selectedImage }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.previewImage}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>

              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons
                  name="image-outline"
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* CAPTION */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
               <Image
  source={
    user?.imageUrl?.trim()
      ? { uri: user.imageUrl }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.userAvatar}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>

                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}