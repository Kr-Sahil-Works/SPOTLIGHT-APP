import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [restrictedOpen, setRestrictedOpen] = useState(false);
  const [toast, setToast] = useState("");

  const toastAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const dbUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const stats = useQuery(api.stats.getUserStats);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);

    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }, 1800);
    });
  };

  if (!user || !dbUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#020403" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#22c55e" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* PROFILE */}
        <BlurView intensity={70} tint="dark" style={styles.glassCard}>
          <View style={styles.avatarWrapper}>
            <Animated.View
              style={[
                styles.glowRing,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                  transform: [
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.12],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Image source={{ uri: dbUser.image }} style={styles.avatar} />
          </View>

          <Text style={styles.name}>{dbUser.fullname}</Text>
          <Text style={styles.email}>{dbUser.email}</Text>

          <View style={styles.row}>
            <MiniStat value={dbUser.posts} label="Posts" />
            <MiniStat value={dbUser.followers} label="Followers" />
            <MiniStat value={dbUser.following} label="Following" />
          </View>
        </BlurView>

        {/* MEMBER */}
        <BlurView intensity={60} tint="dark" style={styles.memberCard}>
          <Text style={styles.memberTitle}>Member since</Text>
          <Text style={styles.memberDate}>
            {new Date(dbUser._creationTime).toDateString()}
          </Text>
        </BlurView>

        {/* ACTIVITY */}
        <BlurView intensity={70} tint="dark" style={styles.glassCard}>
          <Text style={styles.cardTitle}>Activity</Text>

          <View style={styles.modularGrid}>
            <ModBox title="Messages" value={stats?.messages ?? 0} icon="chatbubble" />
            <ModBox title="Likes" value={stats?.likes ?? 0} icon="heart" />
            <ModBox title="Bookmarks" value={stats?.bookmarks ?? 0} icon="bookmark" />
            <ModBox title="Comments" value={stats?.comments ?? 0} icon="chatbox" />
          </View>
        </BlurView>

        {/* RESTRICTED */}
        <View style={styles.dangerCard}>
          <TouchableOpacity
            onPress={() => setRestrictedOpen(!restrictedOpen)}
            style={styles.dangerHeader}
          >
            <Text style={styles.dangerTitle}>Restricted Settings</Text>
            <Ionicons
              name={restrictedOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#ef4444"
            />
          </TouchableOpacity>

          {restrictedOpen && (
            <View style={{ marginTop: 10 }}>
              <DangerBtn
                title="Deactivate Account"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  showToast("Feature in testing");
                }}
              />
              <DangerBtn
                title="Delete Account"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  showToast("Feature in testing");
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* TOAST */}
      <Animated.View
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.toastInner}>
          <Text style={{ color: "#ffb4b4", fontSize: 13 }}>{toast}</Text>
        </BlurView>
      </Animated.View>
    </View>
  );
}

/* COMPONENTS */

const MiniStat = ({ value, label }: any) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ color: "#ccff00" }}>{value}</Text>
    <Text style={{ color: "#6b7280", fontSize: 11 }}>{label}</Text>
  </View>
);

const ModBox = ({ title, value, icon }: any) => (
  <View style={styles.modBox}>
    <Ionicons name={icon} size={18} color="#22c55e" style={{ marginBottom: 6 }} />
    <Text style={styles.modValue}>{value}</Text>
    <Text style={styles.modLabel}>{title}</Text>
  </View>
);

const DangerBtn = ({ title, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.dangerBtn}>
    <Text style={{ color: "#fff" }}>{title}</Text>
  </TouchableOpacity>
);

/* STYLES */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },

  headerText: { color: "#22c55e", fontSize: 17 },

  glassCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
      backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
    alignItems: "center",
  },

  avatarWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  glowRing: {
    position: "absolute",
    width: 102,
    height: 102,
    borderRadius: 60,
    backgroundColor: "#12bb0f49",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  name: { color: "#40c801", fontSize: 22, fontWeight: "700" },
  email: { color: "#ccff00", fontSize: 12 },

  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 14,
  },

  memberCard: {
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
    alignItems: "center",
  },

  memberTitle: { color: "#40c801", fontSize: 12 },
  memberDate: { color: "#ccff00", fontSize: 18, fontWeight: "700" },

  cardTitle: { color: "#40c801", marginBottom: 10 },

  modularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  modBox: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },

  modValue: { color: "#ccff00", fontSize: 18, fontWeight: "600" },
  modLabel: { color: "#ffffff", fontSize: 11 },

  dangerCard: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: "rgba(239,68,68,0.05)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },

  dangerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dangerTitle: { color: "#ef4444" },

  dangerBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.12)",
    marginTop: 8,
    alignItems: "center",
  },

toast: {
  position: "absolute",
  bottom: 200,
  alignSelf: "center",
  left: 20,
  right: 20,
},

  toastInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(30,0,0,0.7)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",

      shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  },
});