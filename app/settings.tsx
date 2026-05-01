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
  TouchableOpacity,
  View
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

        <Text style={{ color: "#01ca08", fontSize: 20, marginLeft: 16 }}>
          Settings
        </Text>
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