import { Ionicons } from "@expo/vector-icons";

import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;

  onWhatsApp: () => void;
  onInstagram: () => void;
  onTelegram: () => void;
  onCall: () => void;
};

export default function CallOptionsModal({
  visible,
  onClose,

  onWhatsApp,
  onInstagram,
  onTelegram,
  onCall,
}: Props) {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 58,
            right: 12,
            width: 190,

            backgroundColor:
              "rgba(20,20,20,0.92)",

            borderRadius: 24,

            paddingVertical: 10,

            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.08)",
          }}
        >
          {/* WHATSAPP */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClose();

              onWhatsApp();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Ionicons
              name="logo-whatsapp"
              size={20}
              color="#25D366"
            />

            <Text
              style={{
                color: "#fff",
                marginLeft: 14,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>

          {/* INSTAGRAM */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClose();

              onInstagram();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Ionicons
              name="logo-instagram"
              size={20}
              color="#ff4fd8"
            />

            <Text
              style={{
                color: "#fff",
                marginLeft: 14,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Instagram
            </Text>
          </TouchableOpacity>

          {/* TELEGRAM */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClose();

              onTelegram();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Ionicons
              name="paper-plane"
              size={20}
              color="#2AABEE"
            />

            <Text
              style={{
                color: "#fff",
                marginLeft: 14,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Telegram
            </Text>
          </TouchableOpacity>

          {/* CALL */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClose();

              onCall();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Ionicons
              name="call"
              size={20}
              color="#4da6ff"
            />

            <Text
              style={{
                color: "#fff",
                marginLeft: 14,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Contacts
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}