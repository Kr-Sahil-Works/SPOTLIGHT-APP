import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
/* ================= TYPES ================= */

type ItemProps = {
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
}: ItemProps) => {
  const isAllowed =
    title === "Support Developer" ||
    title === "Backup chats" ||
    title === "Export data" ||
    title === "Account settings" ||
    title === "Login to another account" ||
    title === "Logout";

  const handlePress = () => {
    if (!isAllowed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress && onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={isAllowed ? 0.7 : 1}
      onPress={handlePress}
      disabled={!isAllowed}
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
        opacity: isAllowed ? 1 : 0.5,
      }}
    >
      <Ionicons name={icon} size={20} color="#9be7c4" />

      <Text style={{ color: "#e6fff2", marginLeft: 12, flex: 1 }}>
        {title}
      </Text>

      {!isAllowed && (
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
          disabled={!isAllowed}
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

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [camera, setCamera] = useState(false);
  const [moveScreen, setMoveScreen] = useState(false);
  const [tapCount, setTapCount] =
  useState(0);

  const [showDevSection, setShowDevSection] =
  useState(false);

const [secretTapCount, setSecretTapCount] =
  useState(0);


const [showDevModal, setShowDevModal] =
  useState(false);

const [devCode, setDevCode] =
  useState("");

const SECRET_CODE = "123";


const unlockDeveloperMode = () => {
  if (devCode === SECRET_CODE) {
    setShowDevModal(false);

router.push("/developer");
  }
};

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
  icon="heart-outline"
  title="Support Developer"
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
          <Item icon="options-outline" title="Enable / Disable Fields" />

          <Item
            icon="camera-outline"
            title="Integrated camera filters on post"
            toggle
            value={camera}
            onToggle={setCamera}
          />

          <Item
            icon="albums-sharp"
            title="Allow Tagging on your posts"
            toggle
            value={moveScreen}
            onToggle={setMoveScreen}
          />

          <Item icon="image-outline" title="Images" />
          <Item icon="phone-portrait-outline" title="Display" />
        </Section>

        <Section title="Data">
          <Item icon="cloud-upload-outline" title="Backup chats" onPress={() => {}} />
          <Item icon="document-outline" title="Export data" onPress={() => {}} />
        </Section>

        <Section title="Account">
          <Item
  icon="person-outline"
  title="Account settings"
  onPress={() => router.push("/(app)/account")}
/>

          <Item
            icon="log-out-outline"
            title="Logout"
            onPress={() => setShowLogoutModal(true)}
          />
        </Section>
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
          onPress={
            unlockDeveloperMode
          }
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