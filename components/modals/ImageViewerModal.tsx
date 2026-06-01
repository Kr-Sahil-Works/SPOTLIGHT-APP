import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";

interface Props {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageViewerModal({
  visible,
  imageUrl,
  onClose,
}: Props) {
  const [downloading, setDownloading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const successScale = useRef(
    new Animated.Value(0)
  ).current;

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(
        msg,
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert(msg);
    }
  };

  const downloadImage = async () => {
    try {
      if (!imageUrl || downloading) return;

      setDownloading(true);

      const { status } =
        await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        showToast("Permission denied");
        return;
      }

      const filename = `img_${Date.now()}.jpg`;

      const fileUri =
        FileSystem.documentDirectory + filename;

      const res =
        await FileSystem.downloadAsync(
          imageUrl,
          fileUri
        );

      const asset =
        await MediaLibrary.createAssetAsync(
          res.uri
        );

      const album =
        await MediaLibrary.getAlbumAsync(
          "Download"
        );

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
      } else {
        await MediaLibrary.createAlbumAsync(
          "Download",
          asset,
          false
        );
      }

      setShowSuccess(true);

      successScale.setValue(0);

      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);
      });

      showToast("Downloaded ✅");
    } catch {
      showToast("Download failed ❌");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            "rgba(0,0,0,0.96)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          activeOpacity={1}
          onPress={onClose}
        />

        {imageUrl && (
          <Animated.View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale }],
            }}
          >
       <Image
  source={
    imageUrl?.trim()
      ? { uri: imageUrl }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={{
    width: "100%",
    height: "100%",
  }}
  contentFit="contain"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
          </Animated.View>
        )}

        {showSuccess && (
          <Animated.View
            style={{
              position: "absolute",
              transform: [
                { scale: successScale },
              ],
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor:
                  "rgba(0,0,0,0.7)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="checkmark"
                size={40}
                color="#00ff88"
              />
            </View>
          </Animated.View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 60,
            flexDirection: "row",
            gap: 16,
            padding: 10,
            borderRadius: 30,
            backgroundColor:
              "rgba(20,20,20,0.6)",
          }}
        >
          <Btn
            icon="remove"
            onPress={() =>
              scale.setValue(1)
            }
          />

          <Btn
            icon="add"
            onPress={() =>
              scale.setValue(1.5)
            }
          />

          <Btn
            icon="download"
            onPress={downloadImage}
            loading={downloading}
          />
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 50,
            right: 16,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor:
              "rgba(20,20,20,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="close"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function Btn({
  icon,
  onPress,
  loading,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:
          "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Ionicons
          name={icon}
          size={20}
          color="#fff"
        />
      )}
    </TouchableOpacity>
  );
}