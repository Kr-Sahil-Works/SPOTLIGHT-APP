import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import {
  Image,
  Modal,
  ScrollView,
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
}: any) {
  const [activeTab, setActiveTab] =
    useState<"info" | "extra">("info");

  return (
    <Modal visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "#050807",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: 58,
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD */}
          <View
            style={{
              backgroundColor: "#0b1210",
              borderRadius: 28,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(34,197,94,0.28)",
            }}
          >
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#111917",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#d2ffe9"
                />
              </TouchableOpacity>

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  marginRight: 42,
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#ecfdf5",
                }}
              >
                Edit Profile
              </Text>
            </View>

            {/* PROFILE IMAGE */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {/* OUTER RING */}
              <View
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(34,197,94,0.14)",
                  shadowColor: "#fff",
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                }}
              >
                {/* INNER RING */}
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#0d1513",
                    borderWidth: 2,
                    borderColor: "rgba(34,197,94,0.22)",
                  }}
                >
                  <Image
                    source={{
                      uri: profile.image,
                    }}
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: 999,
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 14,
                }}
              >
                <Text
                  style={{
                    color: "#4ade80",
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  Change profile picture
                </Text>
              </TouchableOpacity>
            </View>

            {/* SWITCH BUTTONS */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 24,
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab("info")}
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "info"
                      ? "#166534"
                      : "#111917",
                  borderRadius: 18,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color:
                      activeTab === "info"
                        ? "#fff"
                        : "#0f172a",
                    fontWeight: "700",
                  }}
                >
                  Info
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("extra")}
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "extra"
                      ? "#0f766e"
                      : "#c7d0d7",
                  borderRadius: 18,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color:
                      activeTab === "extra"
                        ? "#fff"
                        : "#0f172a",
                    fontWeight: "700",
                  }}
                >
                  Extra Settings
                </Text>
              </TouchableOpacity>
            </View>

            {/* INFO FORM */}
            {activeTab === "info" && (
              <>
                {/* USERNAME */}
                <View style={{ marginBottom: 18 }}>
                  <Text
                    style={{
                      color: "#ecfdf5",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Username
                  </Text>

                  <TextInput
                    value={profile.username}
                    onChangeText={(t) =>
                      setProfile((p: any) => ({
                        ...p,
                        username: t,
                      }))
                    }
                    placeholder="Username"
                    placeholderTextColor="#64748b"
                    style={{
                      backgroundColor: "#101715",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.06)",
                      paddingHorizontal: 16,
                      paddingVertical: 15,
                      color: "#ecfdf5",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* FULLNAME */}
                <View style={{ marginBottom: 18 }}>
                  <Text
                    style={{
                      color: "#ecfdf5",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Full Name
                  </Text>

                  <TextInput
                    value={profile.fullname}
                    onChangeText={(t) =>
                      setProfile((p: any) => ({
                        ...p,
                        fullname: t,
                      }))
                    }
                    placeholder="Full name"
                    placeholderTextColor="#64748b"
                    style={{
                      backgroundColor: "#101715",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.06)",
                      paddingHorizontal: 16,
                      paddingVertical: 15,
                      color: "#ecfdf5",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* BIO */}
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      color: "#ecfdf5",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Bio
                  </Text>

                  <TextInput
                    value={profile.bio}
                    onChangeText={(t) =>
                      setProfile((p: any) => ({
                        ...p,
                        bio: t,
                      }))
                    }
                    placeholder="Write something..."
                    placeholderTextColor="#64748b"
                    multiline
                    style={{
                      backgroundColor: "#101715",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.06)",
                      paddingHorizontal: 16,
                      paddingTop: 16,
                      height: 120,
                      color: "#ecfdf5",
                      textAlignVertical: "top",
                      fontSize: 15,
                    }}
                  />
                </View>
              </>
            )}

            {/* EXTRA SETTINGS */}
            {activeTab === "extra" && (
              <View
                style={{
                  gap: 14,
                }}
              >
                {[
                  "Private account",
                  "Show activity",
                  "Allow messages",
                  "Show online status",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={{
                      backgroundColor: "#101715",
                      borderRadius: 18,
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#ecfdf5",
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#d2ffe9"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* SAVE BUTTON */}
            <TouchableOpacity
              onPress={onSave}
              activeOpacity={0.9}
              style={{
                marginTop: 28,
                backgroundColor: "#15803d",
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
                shadowColor: "#065f5b",
                shadowOpacity: 0.35,
                shadowRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}