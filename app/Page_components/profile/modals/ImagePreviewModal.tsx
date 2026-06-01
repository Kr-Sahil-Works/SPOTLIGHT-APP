import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Animated,
  Modal,
  TouchableOpacity
} from "react-native";

import { Image } from "expo-image";

export default function ImagePreviewModal({
  selectedPost,
  setSelectedPost,
  scale,
  translateY,
  panResponder,
}: any) {
  return (
    <Modal visible={!!selectedPost} transparent animationType="fade">
      <BlurView
        intensity={25}
        tint="dark"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        {/* CLOSE */}
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
  renderToHardwareTextureAndroid={false}
  {...panResponder.panHandlers}
            style={{
              width: "100%",
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "#000",
              transform: [{ translateY }, { scale }],
            }}
          >
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
  source={{ uri: selectedPost.imageUrl }}
  style={{ width: "100%", aspectRatio: 1 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  allowDownscaling
  transition={120}
/>
            </TouchableOpacity>
          </Animated.View>
        )}
      </BlurView>
    </Modal>
  );
}