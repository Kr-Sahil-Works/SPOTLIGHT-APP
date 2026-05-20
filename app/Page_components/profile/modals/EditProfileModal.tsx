import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function EditProfileModal({
  visible,
  setVisible,
  profile,
  setProfile,
  originalProfile,
  onSave,
  onChangePhoto,
saving,
setHasLocalChanges,
}: any) {
  const scrollRef = React.useRef<any>(null);
  const [activeTab, setActiveTab] =
    useState<"info" | "extra">("info");

  const hasChanges = useMemo(() => {
    return (
      profile?.fullname !==
        originalProfile?.fullname ||
      profile?.username !==
        originalProfile?.username ||
      profile?.bio !== originalProfile?.bio ||
      profile?.image !== originalProfile?.image
    );
  }, [profile, originalProfile]);

  return (
<Modal
  hardwareAccelerated
  statusBarTranslucent
      visible={visible}
      animationType="slide"
    >
<View
  style={{
    flex: 1,
    backgroundColor: "#000",
  }}
>
  <ScrollView
  ref={scrollRef}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
  nestedScrollEnabled
  contentContainerStyle={{
    flexGrow: 1,
    paddingTop: 58,
    paddingBottom: 140,
    paddingHorizontal: 16,
  }}
>
          {/* CARD */}
          <View
            style={{
              backgroundColor: "#090909",
              borderRadius: 30,
              padding: 18,
              borderWidth: 1,
              borderColor:
                "rgba(34,197,94,0.14)",
            }}
          >
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <TouchableOpacity
                onPress={() => {
  setHasLocalChanges?.(false);
  setVisible(false);
}}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#111",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>

              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  marginRight: 42,
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                Edit Profile
              </Text>
            </View>

            {/* PROFILE IMAGE */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 999,
                  padding: 4,
                  backgroundColor:
                    "rgba(34,197,94,0.18)",
                }}
              >
                <Image
                  source={{
                    uri:
  profile?.image ||
  "https://ui-avatars.com/api/?background=111111&color=ffffff&name=U",
                  }}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 999,
                    backgroundColor: "#111",
                  }}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onChangePhoto}
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
                  Change profile photo
                </Text>
              </TouchableOpacity>
            </View>

            {/* CONNECTED TABS */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#0f0f0f",
                borderRadius: 18,
                padding: 4,
                marginBottom: 26,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setActiveTab("info")
                }
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor:
                    activeTab === "info"
                      ? "#166534"
                      : "transparent",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                  }}
                >
                  Info
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                disabled
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor:
                    activeTab === "extra"
                      ? "#166534"
                      : "transparent",
                  opacity: 0.45,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                  }}
                >
                  Extra
                </Text>
              </TouchableOpacity>
            </View>

            {/* INFO */}
            {activeTab === "info" && (
              <>
                {/* USERNAME */}
                <View
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Username
                  </Text>

           <TextInput
  value={profile.username}
  onChangeText={(t) => {
    setHasLocalChanges?.(true);

    setProfile((p: any) => ({
      ...p,
      username: t,
    }));
  }}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    style={{
                      backgroundColor: "#0f0f0f",
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor:
                        "rgba(255,255,255,0.05)",
                      paddingHorizontal: 16,
                      paddingVertical: 15,
                      color: "#fff",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* FULLNAME */}
                <View
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Full Name
                  </Text>

                  <TextInput
                    value={profile.fullname}
                    onChangeText={(t) => {
                          setHasLocalChanges?.(true);
                    
                      setProfile((p: any) => ({
                        ...p,
                        fullname: t,
                      }))
                    }}
                    placeholder="Full name"
                    placeholderTextColor="#666"
                    style={{
                      backgroundColor: "#0f0f0f",
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor:
                        "rgba(255,255,255,0.05)",
                      paddingHorizontal: 16,
                      paddingVertical: 15,
                      color: "#fff",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* BIO */}
                <View>
                  <Text
                    style={{
                      color: "#fff",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Bio
                  </Text>

               <TextInput
  value={profile.bio}
  scrollEnabled={false}
  blurOnSubmit={false}
  returnKeyType="done"
                    multiline
                    onChangeText={(t) => {
                          setHasLocalChanges?.(true);
                      setProfile((p: any) => ({
                        ...p,
                        bio: t,
                      }))
                    }}
                    placeholder="Write something..."
                    placeholderTextColor="#666"
                    style={{
                      backgroundColor: "#0f0f0f",
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor:
                        "rgba(255,255,255,0.05)",
                      paddingHorizontal: 16,
                      paddingTop: 16,
                      minHeight: 120,
maxHeight: 160,
                      color: "#fff",
                      textAlignVertical: "top",
                      fontSize: 15,
                    }}
                  />
                </View>
              </>
            )}

            {/* DISABLED EXTRA SETTINGS */}
            {activeTab === "extra" && (
              <View
                style={{
                  opacity: 0.45,
                  gap: 14,
                }}
              >
                {[
                  "Private account",
                  "Show activity",
                  "Allow messages",
                  "Online status",
                ].map((item) => (
                  <View
                    key={item}
                    style={{
                      backgroundColor: "#111",
                      borderRadius: 18,
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>

                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color="#777"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* SAVE */}
            <TouchableOpacity
              disabled={!hasChanges || saving}
              activeOpacity={0.9}
              onPress={onSave}
              style={{
                marginTop: 30,
                backgroundColor:
                  !hasChanges || saving
                    ? "#1a1a1a"
                    : "#166534",
                borderRadius: 20,
                paddingVertical: 17,
                alignItems: "center",
                justifyContent: "center",
                opacity:
                  !hasChanges || saving
                    ? 0.6
                    : 1,
              }}
            >
              {saving ? (
                <ActivityIndicator
                  color="#fff"
                />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
</View>
    </Modal>
  );
}