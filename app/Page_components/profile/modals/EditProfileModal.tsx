import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileModal({
  visible,
  setVisible,
  profile,
  setProfile,
  onSave,
  btnScale,
}: any) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /* 🔥 OPEN / CLOSE ANIMATION */
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* 🔥 BACKDROP */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: opacityAnim,
        }}
      >
        <BlurView
          intensity={40}
          tint="dark"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          {/* 🔥 SHEET */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              backgroundColor: "#0b0b0b",
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              paddingHorizontal: 18,
              paddingTop: 12,
              paddingBottom: 28,
            }}
          >
            {/* DRAG HANDLE */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 10,
                backgroundColor: "#333",
                alignSelf: "center",
                marginBottom: 14,
              }}
            />

            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Edit Profile
              </Text>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            {/* NAME */}
            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: "#888", marginBottom: 6 }}>
                Name
              </Text>

              <TextInput
                value={profile.fullname}
                onChangeText={(t) =>
                  setProfile((p: any) => ({ ...p, fullname: t }))
                }
                style={[
                  styles.input,
                  {
                    backgroundColor: "#111",
                    borderRadius: 14,
                    paddingVertical: 12,
                  },
                ]}
                placeholder="Your name"
                placeholderTextColor="#555"
              />
            </View>

            {/* BIO */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: "#888", marginBottom: 6 }}>
                Bio
              </Text>

              <TextInput
                value={profile.bio}
                onChangeText={(t) =>
                  setProfile((p: any) => ({ ...p, bio: t }))
                }
                style={[
                  styles.input,
                  {
                    height: 90,
                    backgroundColor: "#111",
                    borderRadius: 14,
                    paddingVertical: 12,
                    textAlignVertical: "top",
                  },
                ]}
                multiline
                placeholder="Tell something about you"
                placeholderTextColor="#555"
              />
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onSave}
              onPressIn={() => {
                Animated.spring(btnScale, {
                  toValue: 0.94,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(btnScale, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }}
              style={{
                backgroundColor: "#22c55e",
                borderRadius: 18,
                paddingVertical: 14,
                alignItems: "center",
                shadowColor: "#22c55e",
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}
            >
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <Text
                  style={{
                    color: "#000",
                    fontWeight: "600",
                    fontSize: 15,
                  }}
                >
                  Save Changes
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}