import { useAppToast } from "@/components/common/AppToast";
import { api } from "@/convex/_generated/api";
import useNetwork from "@/hooks/useNetwork";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Linking,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


/* ================= TYPES ================= */

type ItemProps = {
  isOnline: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (v: boolean) => void;
};

/* ================= ITEM ================= */

const Item = ({
  icon,
  title,
  onPress,
  toggle,
  value,
  onToggle,
  isOnline,
}: ItemProps) => {
const isAllowed =
  title === "Developer's Github" ||
  title === "Documentation" ||
  title === "Logout" ||
  // title === "Backup chats" ||
  // title === "Export data" ||
  title === "Account settings";

const canUse =
  isOnline &&
  isAllowed;

const handlePress = () => {
  if (!canUse) return;

  Haptics.impactAsync(
    Haptics
      .ImpactFeedbackStyle
      .Light
  );

  onPress?.();
};

  return (
    <TouchableOpacity
      activeOpacity={
  canUse ? 0.7 : 1
}
      onPress={handlePress}
      disabled={!canUse}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        backgroundColor: isAllowed
  ? "rgba(34,197,94,0.08)"   // subtle green glass
  : "rgba(34,197,94,0.03)",

borderWidth: 1,
borderColor: isAllowed
  ? "rgba(34,197,94,0.15)"
  : "rgba(255,255,255,0.05)",
        marginBottom: 10,
        opacity:
  canUse
    ? 1
    : 0.35,
      }}
    >
      <Ionicons name={icon} size={20} color="#9be7c4" />

      <Text style={{ color: "#e6fff2", marginLeft: 12, flex: 1 }}>
        {title}
      </Text>

      {!canUse && (
        <Ionicons name="lock-closed" size={16} color="#6b7280" />
      )}

      {toggle && (
        <Switch
          value={value}
          onValueChange={(v) => {
            if (!isAllowed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle && onToggle(v);
          }}
          trackColor={{ false: "#333", true: "#22c55e" }}
          thumbColor="#fff"
          disabled={!canUse}
        />
      )}
    </TouchableOpacity>
  );
};

/* ================= SECTION ================= */

const Section = ({ title, children }: any) => {
  const [open, setOpen] = useState(title !== "Upcoming features");

  return (
    <View style={{ marginBottom: 18 }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text style={{ color: "#6ee7b7", fontSize: 13 }}>
          {title}
        </Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#6ee7b7"
        />
      </TouchableOpacity>

      {open && children}
    </View>
  );
};

/* ================= MAIN ================= */

export default function Settings() {
  const { signOut } = useAuth();
  const router = useRouter();

  const isOnline =
  useNetwork();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [camera, setCamera] = useState(false);
  const [moveScreen, setMoveScreen] = useState(false);
  const [tapCount, setTapCount] =
  useState(0);

  const [showDevSection, setShowDevSection] =
  useState(false);

  const scaleAnim =
  useState(
    new Animated.Value(1)
  )[0];
  

const [secretTapCount, setSecretTapCount] =
  useState(0);


const [showDevModal, setShowDevModal] =
  useState(false);

const [devCode, setDevCode] =
  useState("");


const verifyDeveloperCode =
  useMutation(
    api.security.verifyDeveloperCode
  );


  const { showToast } =
  useAppToast();

  return (
    <View style={{ flex: 1, backgroundColor: "#020403", paddingTop: 10 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#01ca08" />
        </TouchableOpacity>

<Text
  style={{
    color: "#01ca08",
    fontSize: 20,
    marginLeft: 16,
  }}
>
  Settings
</Text>

<View style={{ flex: 1 }} />

<TouchableOpacity
  activeOpacity={1}
  onPress={() => {
    const next =
      secretTapCount + 1;

    setSecretTapCount(next);

    if (next >= 4) {
      setSecretTapCount(0);

      setShowDevSection(true);

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType
          .Success
      );
    }
  }}
  style={{
    width: 34,
    height: 34,

    justifyContent: "center",
    alignItems: "center",

    opacity: 0.01,
  }}
>
  <Ionicons
    name="settings"
    size={20}
    color="#fff"
  />
</TouchableOpacity>
      </View>



      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Section title="Support">
          <Item
  isOnline={isOnline}
  icon="document-text"
  title="Documentation"
  onPress={() =>
    router.push(
      "/(app)/webview?url=https://spotlight-docs.onrender.com"
    )
  }
/>
          <Item
  isOnline={isOnline}
  icon="code"
  title="Developer's Github"
onPress={() =>
  router.push("/(app)/webview?url=https://github.com/Kr-Sahil-Works")
}
/>




        </Section>
{showDevSection && (
  <Section title="Dev settings">
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        setShowDevModal(true);
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,

        backgroundColor:
          "rgba(34,197,94,0.03)",

        borderWidth: 1,

        borderColor:
          "rgba(255,255,255,0.05)",
      }}
    >
      <Ionicons
        name="settings"
        size={20}
        color="#9be7c4"
      />

      <Text
        style={{
          color: "#e6fff2",
          marginLeft: 12,
          flex: 1,
        }}
      >
        For Developers Only
      </Text>

      <Ionicons
        name="lock-closed"
        size={16}
        color="#6b7280"
      />
    </TouchableOpacity>
  </Section>
)}

        <Section title="Upcoming features">
          <Item
  isOnline={isOnline} icon="options-outline" title="Enable / Disable Fields" />

          <Item
  isOnline={isOnline}
            icon="camera-outline"
            title="Integrated camera filters on post"
            toggle
            value={camera}
            onToggle={setCamera}
          />

          <Item
  isOnline={isOnline}
            icon="albums-sharp"
            title="Allow Tagging on your posts"
            toggle
            value={moveScreen}
            onToggle={setMoveScreen}
          />

          <Item
  isOnline={isOnline} icon="image-outline" title="Images" />
          <Item
  isOnline={isOnline} icon="phone-portrait-outline" title="Display" />
        </Section>

        <Section title="Data">
<Item
  isOnline={isOnline}
  icon="cloud-upload-outline"
  title="Backup chats"
  onPress={() => {
  showToast({
  message:
    "Chat backup coming soon : )",
  type:
    "success",
});
  }}
/>
          <Item
  isOnline={isOnline}
  icon="document-outline"
  title="Export data"
  onPress={() => {
  showToast({
  message:
    "Exporting Data Feature coming soon : )",
  type:
    "success",
});
  }}
/>
        </Section>

        <Section title="Account">
          <Item
  isOnline={isOnline}
  icon="person-outline"
  title="Account settings"
  onPress={() => router.push("/(app)/account")}
/>

          <Item
  isOnline={isOnline}
            icon="log-out-outline"
            title="Logout"
            onPress={() => setShowLogoutModal(true)}
          />
        </Section>


        <View
  style={{
    marginTop: 400,
    alignItems: "center",
  }}
>
  {/* CONNECT BUTTON */}
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={async () => {
      Animated.sequence([
        Animated.spring(
          scaleAnim,
          {
            toValue: 0.96,
            useNativeDriver: true,
          }
        ),

        Animated.spring(
          scaleAnim,
          {
            toValue: 1,
            friction: 3,
            tension: 120,
            useNativeDriver: true,
          }
        ),
      ]).start();

      const phone =
        "+919608540597";

      const whatsappUrl =
`whatsapp://send?phone=${phone}`;

      const dialerUrl =
        `tel:${phone}`;

      const supported =
        await Linking.canOpenURL(
          whatsappUrl
        );

      if (supported) {
        await Linking.openURL(
          whatsappUrl
        );
      } else {
        await Linking.openURL(
          dialerUrl
        );
      }
    }}
    style={{
      width: "100%",
    }}
  >
    <Animated.View
      style={{
        transform: [
          {
            scale: scaleAnim,
          },
        ],

        flexDirection: "row",

        alignItems: "center",

        justifyContent:
          "center",

        backgroundColor:
          "rgba(0,255,120,0.08)",

        borderWidth: 1,

        borderColor:
          "rgba(0,255,120,0.14)",

        borderRadius: 18,

        paddingVertical: 15,
      }}
    >
      <Ionicons
        name="logo-whatsapp"
        size={20}
        color="#00ff88"
      />

      <Text
        style={{
          color: "#eafff3",

          marginLeft: 10,

          fontWeight: "700",

          fontSize: 15,
        }}
      >
        Connect Developer
      </Text>
    </Animated.View>
  </TouchableOpacity>

  {/* WATERMARK */}
  <Text
    style={{
      color: "#2d2d2d",

      marginTop: 18,

      fontSize: 12,

      letterSpacing: 2,

      fontWeight: "700",
    }}
  >
    SPOTLIGHT V.1.7
  </Text>
</View>
      </ScrollView>

      {/* DEV SECRET MODAL */}
<Modal
  visible={showDevModal}
  transparent
  animationType="fade"
>
  <View
    style={{
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.88)",

      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: "84%",

        backgroundColor: "#050505",

        borderRadius: 28,

        padding: 24,

        borderWidth: 1,

        borderColor:
          "rgba(0,255,120,0.08)",
      }}
    >
      {/* ICON */}
      <View
        style={{
          width: 72,
          height: 72,

          borderRadius: 36,

          backgroundColor:
            "rgba(0,255,120,0.08)",

          justifyContent: "center",

          alignItems: "center",

          alignSelf: "center",
        }}
      >
        <Ionicons
          name="code-slash"
          size={34}
          color="#00ff88"
        />
      </View>

      {/* TITLE */}
      <Text
        style={{
          color: "#fff",

          fontSize: 22,

          fontWeight: "800",

          textAlign: "center",

          marginTop: 18,
        }}
      >
        Developer Access
      </Text>

      {/* TEXT */}
      <Text
        style={{
          color: "#777",

          textAlign: "center",

          marginTop: 10,

          lineHeight: 22,
        }}
      >
        Restricted internal tools
      </Text>

      {/* INPUT */}
      <TextInput
        value={devCode}
        onChangeText={setDevCode}
        underlineColorAndroid="transparent"
        placeholder="Enter access code"
        placeholderTextColor="#555"

        style={{
          marginTop: 22,

          backgroundColor:
            "rgba(255,255,255,0.04)",

          borderRadius: 16,

          paddingHorizontal: 16,

          height: 54,

          color: "#fff",

          borderWidth: 1,

          borderColor:
            "rgba(255,255,255,0.05)",
        }}
      />

      {/* BUTTONS */}
      <View
        style={{
          flexDirection: "row",

          gap: 12,

          marginTop: 22,
        }}
      >
        {/* CANCEL */}
        <TouchableOpacity
          onPress={() =>
            setShowDevModal(false)
          }
          style={{
            flex: 1,

            height: 50,

            borderRadius: 16,

            backgroundColor:
              "rgba(255,255,255,0.06)",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontWeight: "700",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        {/* ENTER */}
        <TouchableOpacity
       onPress={async () => {
  const valid =
    await verifyDeveloperCode({
      code: devCode,
    });

  if (!valid) {
    return;
  }

  setShowDevModal(false);

  router.push("/developer");
}}
          style={{
            flex: 1,

            height: 50,

            borderRadius: 16,

            backgroundColor:
              "#00c853",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontWeight: "800",
            }}
          >
            Enter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* LOGOUT MODAL */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.85)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%", backgroundColor: "#000", borderRadius: 20, padding: 20 }}>
            <Text style={{ color: "#fff", textAlign: "center", marginBottom: 12 }}>
              Logout?
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                style={{ flex: 1, backgroundColor: "#111", padding: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#aaa", textAlign: "center" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await signOut();
                  router.replace("/(auth)/login");
                }}
                style={{ flex: 1, backgroundColor: "#ff3b30", padding: 12, borderRadius: 12 }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}