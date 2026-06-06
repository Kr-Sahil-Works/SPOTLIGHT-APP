import {
  CHAT_LIST_THEMES,
} from "@/constants/chatThemes/chatListThemes";
import { useMMKVString } from "react-native-mmkv";

import { storage } from "@/lib/mmkv";

import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ChatListThemeModal({
  visible,
  onClose,
}: Props) {
  
  
  const [selectedTheme] =
  useMMKVString(
    "selected-chat-list-theme",
    storage
  );

  const [layout] =
  useMMKVString(
    "chat-list-layout",
    storage
  );

  const [glowEnabled] =
  useMMKVString(
    "chat-list-glow",
    storage
  );


  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          justifyContent:
            "flex-end",
          backgroundColor:
            "#00000055",
        }}
      >
        <View
         style={{
  backgroundColor: "#0a0a0a",

  borderTopWidth: 1,
  borderColor: "#1f1f1f",

  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,

  height: "50%",

  padding: 16,
}}
        >
        <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  }}
>
  <Text
    style={{
      color: "#fff",
      fontSize: 20,
      fontWeight: "700",
    }}
  >
    App Themes
  </Text>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    }}
  >
    <TouchableOpacity
      onPress={() => {
        const current =
          storage.getString(
            "chat-list-layout"
          ) ?? "container";

        storage.set(
          "chat-list-layout",
          current ===
            "container"
            ? "classic"
            : "container"
        );
      }}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,

        backgroundColor:
          "rgba(255,255,255,0.06)",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Ionicons
  name={
    (layout ??
      "container") ===
    "container"
      ? "layers"
      : "layers-outline"
  }
  size={18}
  color="#fff"
/>
    </TouchableOpacity>

       <TouchableOpacity
  onPress={() => {
    storage.set(
      "chat-list-glow",
      glowEnabled === "off"
        ? "on"
        : "off"
    );
  }}
  style={{
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor:
      "rgba(255,255,255,0.06)",

    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Ionicons
    name={
      glowEnabled === "off"
        ? "sparkles-outline"
        : "sparkles"
    }
    size={18}
    color="#fff"
  />
</TouchableOpacity>

    <TouchableOpacity
      onPress={onClose}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,

        backgroundColor:
          "rgba(255,255,255,0.06)",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="close"
        size={20}
        color="#9ca3af"
      />
    </TouchableOpacity>
  </View>
</View>

   <FlatList
  data={CHAT_LIST_THEMES}
  keyExtractor={(item) =>
    item.id
  }
  showsVerticalScrollIndicator={
    false
  }
  contentContainerStyle={{
    paddingBottom: 20,
  }}
  renderItem={({ item: theme }) => (
    <TouchableOpacity
      onPress={() => {
        storage.set(
          "selected-chat-list-theme",
          theme.id
        );

        onClose();
      }}
      style={{
        borderRadius: 18,

        backgroundColor:
          theme.cardBg,

        borderWidth: 2,

        borderColor:
          selectedTheme ===
          theme.id
            ? theme.glow ??
              "#22c55e"
            : theme.cardBorder,

        padding: 14,

        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent:
            "space-between",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          {theme.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 6,
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor:
                theme.background,
            }}
          />

          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor:
                theme.searchBg,
            }}
          />

          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor:
                theme.glow ??
                theme.cardBorder,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  )}
/>
        </View>
      </View>
    </Modal>
  );
}