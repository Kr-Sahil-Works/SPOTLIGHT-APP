import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";

import {
  ActivityIndicator,
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
       borderWidth: 1.2,

borderColor:
  "rgba(34,197,94,0.22)",

shadowColor:
  "#22c55e",

shadowOpacity: 0.08,

shadowRadius: 20,
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

{/* PROFILE HEADER IMAGE */}
<View
  style={{
    height: 230,

    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 40,

    overflow: "hidden",
  }}
>
  <Image
    source={require(
      "@/assets/images/profilepage/profileeditbg.webp"
    )}
    contentFit="cover"
    cachePolicy="memory-disk"
    transition={120}
    style={{
      width: "100%",
      height: "100%",
    }}
  />

  <View
  style={{
    position: "absolute",
    bottom: 18,
    left: -30,
    right: -30,
    height: 90,

    borderTopWidth: 4,
    borderColor: "#22c55e",

    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,

    backgroundColor: "transparent",
  }}
/>

  {/* DARK OVERLAY */}
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor:
        "rgba(0,0,0,0.18)",
    }}
  />

  {/* PROFILE IMAGE */}
  <View
    style={{
      position: "absolute",

      bottom: 15,

      left: 0,
      right: 0,

      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 122,
        height: 122,

        borderRadius: 999,

        padding: 4,

        backgroundColor:
          "#22c55e",

        shadowColor:
          "#22c55e",

        shadowOpacity: 0.35,

        shadowRadius: 18,

        elevation: 14,
      }}
    >
      <Image
        source={
          profile?.image?.trim()
            ? {
                uri:
                  profile.image,
              }
            : require(
                "@/assets/images/icons/iconbg.webp"
              )
        }
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={120}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 999,
        }}
      />
    </View>

   <TouchableOpacity
  onPress={onChangePhoto}
  activeOpacity={0.8}
  style={{
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  }}
>
  <Text
    style={{
      color: "#22c55e",
      fontWeight: "700",
      fontSize: 15,
    }}
  >
    Change Photo
  </Text>

  <Ionicons
    name="create-outline"
    size={14}
    color="#22c55e"
    style={{
      marginLeft: 6,
    }}
  />
</TouchableOpacity>
  </View>
</View>
<View
  style={{
    marginTop: 24,

    backgroundColor: "#050505",

    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 24,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.04)",
  }}
>
        
                {/* USERNAME */}
                <View
                  style={{
                    marginTop:10,
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
  underlineColorAndroid="transparent"
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
                    underlineColorAndroid="transparent"
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
  underlineColorAndroid="transparent"
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
                    : "#09873a",
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
           color: "#fdfdfd",

fontSize: 16,
fontWeight: "800",
                  }}
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
             </View>
               <View
                style={{
                  opacity: 0.45,
                  gap: 14,
                  marginTop:40,
                }}
              >
                {[
                  "Private account",
                  "Show activity",
                  "AutoTimer messages",
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
          </View>
        </ScrollView>
</View>
    </Modal>
    
  );
}