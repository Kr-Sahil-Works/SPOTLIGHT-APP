import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CHAT_THEMES } from "@/constants/chatThemes";

type Props = {
  visible: boolean;
  selectedIndex: number;
  onPreview: (i: number) => void; // 🔥 NEW
  onClose: () => void;
  onApply: (i: number) => void;
};

export default function ThemeModal({
  visible,
  selectedIndex,
  onPreview,
  onClose,
  onApply,
}: Props) {


  return (
    <Modal transparent visible={visible} animationType="slide">
      {/* BACKDROP */}
      <Pressable
        style={{ flex: 1, backgroundColor: "#00000080" }}
        onPress={onClose}
      >
        {/* SHEET */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "55%",
            backgroundColor: "#111",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          {/* TITLE */}
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              marginBottom: 14,
              fontWeight: "500",
            }}
          >
            Chat Themes
          </Text>

          {/* 🎨 THEME CARDS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {CHAT_THEMES.map((theme, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onPreview(i)}
                style={{
                  width: 90,
                  height: 130,
                  marginRight: 12,
                  borderRadius: 16,
                  borderWidth: selectedIndex === i ? 2 : 0,
                  borderColor: "#fff",
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                {/* MINI PREVIEW */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.background,
                    padding: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.bubbleMe,
                      height: 18,
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: theme.bubbleOther,
                      height: 14,
                      width: "70%",
                      borderRadius: 6,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ACTIONS */}
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* CANCEL */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                marginRight: 10,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "#222",
              }}
            >
              <Text
                style={{
                  color: "#aaa",
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            {/* APPLY */}
            <TouchableOpacity
              onPress={() => onApply(selectedIndex)}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                backgroundColor:
                  CHAT_THEMES[selectedIndex].bubbleMe,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}