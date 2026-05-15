import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CHAT_THEMES } from "@/constants/chatThemes";

type Props = {
  visible: boolean;

  selectedIndex: number;

  onPreview: (i: number) => void;

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


const reorderedThemes = [
  ...CHAT_THEMES.slice(0, 2),

  ...CHAT_THEMES.filter(
    (t) => t.wallpaper
  ),

  ...CHAT_THEMES.slice(2, 12),
];

  return (
<Modal
  transparent
  visible={visible}
  animationType="slide"
>
  <Pressable
    style={{
      flex: 1,
      backgroundColor: "#00000055",
    }}
    onPress={onClose}
  >
    <Pressable
      onPress={(e) =>
        e.stopPropagation()
      }
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "60%",
        overflow: "hidden",
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
      }}
    >
      {/* GLASS BG */}
    <BlurView
        intensity={70}
        tint="dark"
        style={{
          flex: 1,
          paddingTop: 18,
          paddingHorizontal: 16,
          backgroundColor: "#11111188",
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          borderWidth: 1,
          borderColor: "#ffffff18",
        }}
      >
        {/* HANDLE */}
        <View
          style={{
            width: 48,
            height: 5,
            borderRadius: 999,
            backgroundColor: "#ffffff40",
            alignSelf: "center",
            marginBottom: 18,
          }}
        />

        {/* TITLE */}
        <Text
          style={{
            color: "#44d800e5",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 20,
            letterSpacing: 0.3,
          }}
        >
          Chat Themes
        </Text>

    <FlatList
  data={reorderedThemes}
  keyExtractor={(_, i) => i.toString()}
  numColumns={2}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 120,
  }}
  columnWrapperStyle={{
    justifyContent: "space-between",
  }}
  initialNumToRender={8}
  maxToRenderPerBatch={8}
  windowSize={5}
  removeClippedSubviews
  renderItem={({ item: theme, index: i }) => {
   const originalIndex =
  CHAT_THEMES.findIndex(
    (t) => t.name === theme.name
  );

const selected =
  selectedIndex === originalIndex;

    return (
      <TouchableOpacity
        onPress={() => {
  const originalIndex =
    CHAT_THEMES.findIndex(
      (t) => t.name === theme.name
    );

  onPreview(originalIndex);
}}
        activeOpacity={0.9}
        style={{
          width: "48%",
          height: 220,
          marginBottom: 16,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: selected ? 2 : 1,
          borderColor: selected
            ? "#22c55e"
            : "#ffffff10",
          backgroundColor: "#111",
        }}
      >
        {theme.wallpaper ? (
          <ImageBackground
            source={theme.wallpaper}
            resizeMode="cover"
            fadeDuration={0}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#00000025",
                padding: 14,
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    theme.bubbleMe,
                  height: 18,
                  borderRadius: 10,
                  marginBottom: 8,
                  width: "82%",
                  alignSelf: "flex-end",
                }}
              />

              <View
                style={{
                  backgroundColor:
                    theme.bubbleOther,
                  height: 18,
                  width: "68%",
                  borderRadius: 10,
                }}
              />
            </View>
          </ImageBackground>
        ) : theme.gradient ? (
          <LinearGradient
            colors={theme.gradient}
            style={{
              flex: 1,
              padding: 14,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor:
                  theme.bubbleMe,
                height: 18,
                borderRadius: 10,
                marginBottom: 8,
                width: "82%",
                alignSelf: "flex-end",
              }}
            />

            <View
              style={{
                backgroundColor:
                  theme.bubbleOther,
                height: 18,
                width: "68%",
                borderRadius: 10,
              }}
            />
          </LinearGradient>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor:
                theme.background,
              padding: 14,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor:
                  theme.bubbleMe,
                height: 18,
                borderRadius: 10,
                marginBottom: 8,
                width: "82%",
                alignSelf: "flex-end",
              }}
            />

            <View
              style={{
                backgroundColor:
                  theme.bubbleOther,
                height: 18,
                width: "68%",
                borderRadius: 10,
              }}
            />
          </View>
        )}

        {selected && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 28,
              height: 28,
              borderRadius: 999,
              backgroundColor: "#22c55e",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="checkmark"
              size={18}
              color="#000"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }}
/>

        {/* BUTTONS */}
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            paddingBottom: 10,
          }}
        >
          {/* CANCEL */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.9}
            style={{
              flex: 1,
              height: 58,
              borderRadius: 20,
              backgroundColor:
                "#ffffff12",
              borderWidth: 1,
              borderColor: "#ffffff10",
              flexDirection: "row",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <Ionicons
              name="close"
              size={20}
              color="#fff"
            />

            <Text
              style={{
                color: "#fff",
                marginLeft: 8,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          {/* APPLY */}
          <TouchableOpacity
            onPress={() =>
              onApply(selectedIndex)
            }
            activeOpacity={0.9}
            style={{
              flex: 1,
              height: 58,
              borderRadius: 20,
              backgroundColor:
                CHAT_THEMES[
                  selectedIndex
                ].bubbleMe,
              flexDirection: "row",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <Ionicons
              name="sparkles"
              size={20}
              color="#000"
            />

            <Text
              style={{
                color: "#000",
                marginLeft: 8,
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Pressable>
  </Pressable>
</Modal>
  );
}