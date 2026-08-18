import { useAppToast } from "@/components/common/AppToast";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import useNetwork from "@/hooks/useNetwork";
import { triggerFeedRefresh } from "@/lib/feedRefresh";

import { useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import CaptionInput from "./CaptionInput";
import CreateHeader from "./CreateHeader";
import ImagePickerPreview from "./ImagePickerPreview";

export default function CreateScreen() {
  const router = useRouter();
  const isOnline = useNetwork();
  const { user } = useUser();
  const { showToast } = useAppToast();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showLimitInfo, setShowLimitInfo] = useState(false);

  const generateUploadUrl = useMutation(
    api.posts.index.generateUploadUrl
  );

  const createPost = useMutation(
    api.posts.index.createPost
  );

  const currentUser = useQuery(
    api.users.index.getCurrentUser
  );

  const hasReachedPostLimit =
    (currentUser?.posts ?? 0) >= 12;

  const pickImage = async () => {
    if (hasReachedPostLimit) {
      showToast({
        type: "error",
        message:
          "Delete an older post before uploading a new one",
      });
      return;
    }

    if (!isOnline) {
      showToast({
        type: "error",
        message:
          "Connect to the internet to upload a post",
      });
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    if (result.canceled) return;

    const asset = result.assets[0];

    if ((asset.fileSize ?? 0) > 8 * 1024 * 1024) {
      showToast({
        type: "error",
        message:
          "Please select an image smaller than 8 MB",
      });
      return;
    }

    const fileSize = asset.fileSize ?? 0;

    let compress = 0.9;

    if (fileSize > 500 * 1024) {
      compress = 0.85;
    }

    if (fileSize > 1500 * 1024) {
      compress = 0.75;
    }

    try {
      const optimized =
        await ImageManipulator.manipulateAsync(
          asset.uri,
          [
            {
              resize: {
                width: 1080,
              },
            },
          ],
          {
            compress,
            format:
              ImageManipulator.SaveFormat.WEBP,
          }
        );

      setSelectedImage(optimized.uri);
    } catch {
      showToast({
        type: "error",
        message: "Failed to process image",
      });
    }
  };

  const handleShare = async () => {
    if (
      isSharing ||
      !selectedImage ||
      !isOnline
    ) {
      return;
    }

    setIsSharing(true);

    try {
      const uploadUrl =
        await generateUploadUrl();

      const response =
        await fetch(selectedImage);

      const blob =
        await response.blob();

      const upload =
        await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type":
              blob.type || "image/webp",
          },
          body: blob,
        });

      if (!upload.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } =
        await upload.json();

      const postId =
        await createPost({
          caption: caption.trim(),
          storageId,
        });

      triggerFeedRefresh();

      showToast({
        type: "success",
        message:
          "Post uploaded successfully",
      });

      setSelectedImage(null);
      setCaption("");

      router.push({
        pathname: "/post/[id]",
        params: {
          id: String(postId),
        },
      });
    } catch (error: any) {
      console.log("Create post error:", error);

      showToast({
        type: "error",
        message:
          error?.message === "POST_LIMIT_REACHED"
            ? "Maximum 12 posts allowed"
            : "Failed to upload post",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <CreateHeader
          isSharing={false}
          isOnline={isOnline}
          hasImage={false}
          onClose={() => router.back()}
          onShare={handleShare}
        />

        {hasReachedPostLimit && (
          <View style={styles.limitBox}>
            <TouchableOpacity
              onPress={() =>
                setShowLimitInfo((value) => !value)
              }
              style={styles.limitHeader}
            >
              <View style={styles.limitTitleRow}>
                <Text style={styles.infoIcon}>
                  ⓘ
                </Text>

                <Text style={styles.limitTitle}>
                  Keeping MilesSpot Free
                </Text>
              </View>

              <Text style={styles.chevron}>
                {showLimitInfo ? "⌃" : "⌄"}
              </Text>
            </TouchableOpacity>

            {showLimitInfo && (
              <Text style={styles.limitText}>
                MilesSpot is an independent platform
                designed, built, and maintained by{" "}
                <Text style={styles.highlight}>
                  Sahil KR
                </Text>
                {"\n\n"}
                Instead of showing ads or charging
                for premium features, MilesSpot limits
                each account to 12 active posts.
                {"\n\n"}
                This helps keep MilesSpot{" "}
                <Text style={styles.highlight}>
                  completely free
                </Text>{" "}
                while managing server storage costs.
                {"\n\n"}
                Delete an older post to create a new
                one.
              </Text>
            )}
          </View>
        )}

        <View style={styles.emptyArea}>
          <TouchableOpacity
            onPress={pickImage}
            disabled={
              !isOnline || hasReachedPostLimit
            }
            activeOpacity={0.9}
            style={[
              styles.pickCard,
              {
                opacity:
                  isOnline && !hasReachedPostLimit
                    ? 1
                    : 0.5,
              },
            ]}
          >
            <View style={styles.pickImage}>
              <Text style={styles.imageIcon}>
                ▧
              </Text>

              <Text style={styles.pickText}>
                {hasReachedPostLimit
                  ? "12 / 12 Posts Used"
                  : "Tap to select image"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 100 : 0
      }
    >
      <CreateHeader
        isSharing={isSharing}
        isOnline={isOnline}
        hasImage={!!selectedImage}
        onClose={() => {
          setSelectedImage(null);
          setCaption("");
        }}
        onShare={handleShare}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View
          style={{
            opacity: isSharing ? 0.5 : 1,
          }}
        >
          <ImagePickerPreview
            image={selectedImage}
            disabled={isSharing}
            onPick={pickImage}
          />

          <CaptionInput
            userImage={user?.imageUrl}
            caption={caption}
            disabled={isSharing}
            onChange={setCaption}
          />
        </View>

        {isSharing && (
          <View style={styles.uploading}>
            <ActivityIndicator
              color={COLORS.primary}
            />

            <Text style={styles.uploadingText}>
              Uploading post...
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  emptyArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  pickCard: {
    width: "100%",
    maxWidth: 420,
  },

  pickImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#111",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  imageIcon: {
    color: COLORS.primary,
    fontSize: 48,
  },

  pickText: {
    color: "#888",
    marginTop: 8,
    fontSize: 14,
  },

  scroll: {
    padding: 16,
    paddingBottom: 80,
  },

  limitBox: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "rgba(174,255,24,0.06)",
    borderWidth: 1,
    borderColor: "rgba(174,255,24,0.20)",
    overflow: "hidden",
  },

  limitHeader: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  limitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoIcon: {
    color: "#AEFF18",
    fontSize: 18,
  },

  limitTitle: {
    color: "#AEFF18",
    fontSize: 14,
    fontWeight: "600",
  },

  chevron: {
    color: "#AEFF18",
    fontSize: 18,
  },

  limitText: {
    color: "#CFCFCF",
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  highlight: {
    color: "#AEFF18",
    fontWeight: "700",
  },

  uploading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },

  uploadingText: {
    color: "#999",
    fontSize: 13,
  },
});