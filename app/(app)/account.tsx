import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const IOS_COLORS = {
  bg: "#020403",

  card: "rgba(255,255,255,0.03)",

  border: "rgba(34,197,94,0.12)",

  primary: "#22C55E",

  accent: "#F8FAFC",

  accentDim: "#94A3B8",

  danger: "#EF4444",

  headercolor: "#22C55E",
};

export default function AccountScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [restrictedOpen, setRestrictedOpen] = useState(false);
  const [toast, setToast] = useState("");

  const toastAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

 const dbUser = useQuery(api.users.index.getCurrentUser);

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

const words = [
  "Thank You ",
  "So Much 🥺",
  "For Your Support",
  "Spotlight",
  "Fast ⚡",
  "Free 🌍",
  "For Everyone",
  "Built With Love",
  "By- Sahil :) ",
];

const [displayText, setDisplayText] =
  useState("");

const [wordIndex, setWordIndex] =
  useState(0);

const [showCursor, setShowCursor] =
  useState(true);

useEffect(() => {
  const cursor = setInterval(() => {
    setShowCursor(
      (prev) => !prev
    );
  }, 500);

  return () =>
    clearInterval(cursor);
}, []);

const hasFinishedRef =
  useRef(false);

useEffect(() => {
  if (
    hasFinishedRef.current
  ) {
    return;
  }

  const currentWord =
    words[wordIndex];

  let typingTimeout: any;
  let deletingTimeout: any;

  let i = 0;

  const type = () => {
    if (
      i <= currentWord.length
    ) {
      setDisplayText(
        currentWord.slice(
          0,
          i
        )
      );

      i++;

      typingTimeout =
        setTimeout(
          type,
          80
        );
    } else {
      setTimeout(() => {
       if (
  wordIndex ===
  words.length - 1
) {
  hasFinishedRef.current =
    true;

  setShowCursor(false);

  return;
}
        remove(
          currentWord.length
        );
      }, 1200);
    }
  };

  const remove = (
    length: number
  ) => {
    if (length >= 0) {
      setDisplayText(
        currentWord.slice(
          0,
          length
        )
      );

      deletingTimeout =
        setTimeout(
          () =>
            remove(
              length - 1
            ),
          25
        );
    } else {
      setWordIndex(
        (prev) =>
          prev + 1
      );
    }
  };

  type();

  return () => {
    clearTimeout(
      typingTimeout
    );

    clearTimeout(
      deletingTimeout
    );
  };
}, [wordIndex]);



  if (!user || dbUser === undefined || dbUser === null)  {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={IOS_COLORS.headercolor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#020403" }}>
      {/* HEADER */}
{/* HEADER */}
<View
  style={[
    styles.header,
    {
      flexDirection: "row",
      alignItems: "center",
    },
  ]}
>
  <Text
    style={[
      styles.headerText,
      {
        flex: 1,
        textAlign: "left",
      },
    ]}
  >
    Profile
  </Text>

  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => router.back()}
    style={{
      width: 38,
      height: 38,
      borderRadius: 12,

      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "rgba(255,255,255,0.04)",

      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.06)",
    }}
  >
    <Ionicons
      name="arrow-back"
      size={20}
      color={IOS_COLORS.headercolor}
    />
  </TouchableOpacity>
</View>

      <ScrollView 
  showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}>
        {/* PROFILE */}
        <BlurView intensity={25} tint="dark" style={styles.glassCard}>
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
<Image
  source={
    dbUser?.image?.trim()
      ? { uri: dbUser.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  style={styles.avatar}
contentFit="cover"
/>
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
        <BlurView intensity={25} tint="dark" style={styles.memberCard}>
          <Text style={styles.memberTitle}>Member since</Text>
          <Text style={styles.memberDate}>
            {new Date(dbUser._creationTime).toDateString()}
          </Text>
        </BlurView>

        {/* ACTIVITY */}
        {/* <BlurView intensity={25} tint="dark" style={styles.glassCard}>
          <Text style={styles.cardTitle}>Activity</Text>

          <View style={styles.modularGrid}>
   <ModBox title="Posts" value={stats?.posts ?? 0} icon="grid" />
<ModBox title="Followers" value={stats?.followers ?? 0} icon="people" />
<ModBox title="Following" value={stats?.following ?? 0} icon="person-add" />
<ModBox title="Likes" value={stats?.likes ?? 0} icon="heart" />
<ModBox title="Comments" value={stats?.comments ?? 0} icon="chatbubble" />
<ModBox title="Messages" value={stats?.messages ?? 0} icon="mail" />
          </View>
        </BlurView> */}

<BlurView
  intensity={25}
  tint="dark"
  style={{
    marginTop: 40,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    backgroundColor:
      "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.06)",
  }}
>
<Text
  style={{
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  }}
>
  {displayText}
  <Text
    style={{
      opacity:
        showCursor
          ? 1
          : 0,
    }}
  >
    |
  </Text>
  {" 💚"}
</Text>

  <Text
    style={{
      color: "#d7d7d7",
      lineHeight: 22,
      fontSize: 14,
    }}
  >
    Thank you for being a part of
    Spotlight. Every message,
    reaction, post, and connection
    is special and means a lot to me.

    {"\n\n"}

    Spotlight was built with 
    passion, and countless late 
    nights and hours of
    coding. Your support, feedback,
    and presence mean more than
    you know ❤️
  </Text>

</BlurView>
  <View
    style={{
      height: 4,
      backgroundColor:
        "rgba(255, 255, 255, 0.12)",
      marginVertical: 14,
      marginTop:45,
    }}
  />

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
              color={IOS_COLORS.danger}
            />
          </TouchableOpacity>

          {restrictedOpen && (
            <View style={{ marginTop: 10 }}>
              <DangerBtn
                title="Deactivate Account"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
               showToast(
  "This feature isn't available yet. Reach out to the developer for support."
);
                }}
              />
              <DangerBtn
                title="Delete Account"
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              showToast(
  "This feature isn't available yet. Reach out to the developer for support."
);
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
        <BlurView intensity={25} tint="dark" style={styles.toastInner}>
          <Text style={{ color: "#ffb4b4", fontSize: 13 }}>{toast}</Text>
        </BlurView>
      </Animated.View>
    </View>
  );
}

/* COMPONENTS */

const MiniStat = ({ value, label }: any) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ color: IOS_COLORS.accent }}>{value}</Text>
    <Text style={{ color: "#6b7280", fontSize: 11 }}>{label}</Text>
  </View>
);

const ModBox = ({ title, value, icon }: any) => (
  <View style={styles.modBox}>
  <Ionicons name={icon} size={18} color={IOS_COLORS.primary} style={{ marginBottom: 6 }} />
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

headerText: {
  color: "#22C55E",
  fontSize: 18,
  fontWeight: "700",
  marginRight: 8,
},

  glassCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
backgroundColor: "rgba(255,255,255,0.02)",
borderWidth: 1,
borderColor: "rgba(255,255,255,0.06)",
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
    backgroundColor: "rgba(34,197,94,0.15)",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  name: { color: IOS_COLORS.primary, fontSize: 22, fontWeight: "700" },
  email: {
  color: IOS_COLORS.accentDim,
  fontSize: 13,
  marginTop: 4,
},

  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 14,
  },

  memberCard: {
    marginTop:40,
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: 14,
backgroundColor: "rgba(255,255,255,0.02)",
borderWidth: 1,
borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },

  memberTitle: {  color: IOS_COLORS.primary, fontSize: 12 },
  memberDate: {
  color: "#59b300",
  fontSize: 18,
  fontWeight: "700",
},

  cardTitle: {  color: IOS_COLORS.primary, marginBottom: 10 },

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

modValue: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "800",
},
  modLabel: {
  color: "#94A3B8",
  fontSize: 11,
},

  dangerCard: {
    marginTop:600,
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