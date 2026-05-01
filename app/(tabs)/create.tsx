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
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Image as RNImage } from "react-native";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  

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
    if (!selectedImage) return;

    try {
      setIsSharing(true);

      const uploadUrl = await generateUploadUrl();

      const imageResponse = await fetch(selectedImage);
      const blob = await imageResponse.blob();

      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: blob,
      });

      if (!uploadResult.ok) throw new Error("Upload failed");

      const { storageId } = await uploadResult.json();

      await createPost({ storageId, caption });

      setSelectedImage(null);
      setCaption("");

      router.push("/(tabs)");
    } catch (error) {
      console.log("Error sharing post:", error);
    } finally {
      setIsSharing(false);
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
              <RNImage
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode="cover"
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
                <RNImage
                  source={{ uri: user?.imageUrl }}
                  style={styles.userAvatar}
                  resizeMode="cover"
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