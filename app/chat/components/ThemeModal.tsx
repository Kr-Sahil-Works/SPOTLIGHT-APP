import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Modal,
  Pressable,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { CHAT_THEMES } from "@/constants/chatThemes";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  const insets = useSafeAreaInsets();

const sections = [
  {
    title: "Featured",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Featured"
    ),
  },

  {
    title: "Chat Patterns",
    data: CHAT_THEMES.filter(
      (t) => t.category === "ChatPatterns"
    ),
  },

  {
    title: "Dark",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Dark"
    ),
  },

  {
    title: "Dreamscape",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Dreamscape"
    ),
  },

  {
    title: "Hearts",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Hearts"
    ),
  },

  {
    title: "Landscapes",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Landscapes"
    ),
  },

  {
    title: "Lunar",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Lunar"
    ),
  },

  {
    title: "Nature",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Nature"
    ),
  },

  {
    title: "Pixel Art",
    data: CHAT_THEMES.filter(
      (t) => t.category === "PixelArt"
    ),
  },

  {
    title: "Together",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Together"
    ),
  },

  {
    title: "Solid",
    data: CHAT_THEMES.filter(
      (t) => t.category === "Solid"
    ),
  },
];


const [expanded, setExpanded] =
  useState(false);

  const [
  collapsedCategories,
  setCollapsedCategories,
] = useState<
  Record<string, boolean>
>({});

const toggleCategory = (
  category: string
) => {
  setCollapsedCategories(
    (prev) => ({
      ...prev,
      [category]:
        !prev[category],
    })
  );
};


  return (
<Modal
  transparent
  visible={visible}
  animationType="slide"
>
  <Pressable
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.18)",
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
        height: expanded ? "90%" : "72%",
        overflow: "hidden",
        paddingBottom: insets.bottom,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
      }}
    >
      {/* GLASS BG */}
    <BlurView
        intensity={45}
        tint="systemChromeMaterialDark"
        style={{
          flex: 1,
          paddingTop: 18,
          paddingHorizontal: 16,
          backgroundColor: "transparent",
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
    <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  }}
>
  <Text
    style={{
      color: "#44d800e5",
      fontSize: 24,
      fontWeight: "700",
      letterSpacing: 0.3,
    }}
  >
    Chat Themes
  </Text>

  <TouchableOpacity
    onPress={() =>
      setExpanded(!expanded)
    }
    activeOpacity={0.8}
    style={{
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: "#ffffff10",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#ffffff10",
    }}
  >
    <Ionicons
      name={
        expanded
          ? "contract"
          : "expand"
      }
      size={18}
      color="#fff"
    />
  </TouchableOpacity>
</View>

<SectionList
  sections={sections}
  keyExtractor={(item) =>
    item.name
  }
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 120,
  }}
  stickySectionHeadersEnabled={false}
  renderSectionHeader={({
    section,
  }) => (
    <TouchableOpacity
      onPress={() =>
        toggleCategory(
          section.title
        )
      }
      style={{
        flexDirection: "row",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginTop: 14,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        {section.title}
      </Text>

      <Ionicons
        name={
          collapsedCategories[
            section.title
          ]
            ? "chevron-down"
            : "chevron-up"
        }
        size={18}
        color="#fff"
      />
    </TouchableOpacity>
  )}
  renderItem={({
    item: theme,
    section,
  }) => {
    if (
      collapsedCategories[
        section.title
      ]
    ) {
      return null;
    }

    const originalIndex =
      CHAT_THEMES.findIndex(
        (t) =>
          t.name ===
          theme.name
      );

    const selected =
      selectedIndex ===
      originalIndex;

    return (
      <TouchableOpacity
        onPress={() =>
          onPreview(
            originalIndex
          )
        }
        activeOpacity={0.9}
        style={{
          marginBottom: 16,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth:
            selected
              ? 2
              : 1,
          borderColor:
            selected
              ? "#22c55e"
              : "#ffffff10",
          backgroundColor:
            "#111",
        }}
      >
        {/* KEEP YOUR EXISTING
            THEME CARD CONTENT
            HERE */}

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