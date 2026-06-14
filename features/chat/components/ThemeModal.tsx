import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  FlashList
} from "@shopify/flash-list";

import { CHAT_THEMES } from "@/constants/chatThemes";
import React, { useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;

  selectedIndex: number;

  onPreview: (i: number) => void;

  onClose: () => void;

  onApply: (i: number) => void;

  profileMode?: boolean;
};


const ThemeCard = React.memo(
  ({
    theme,
    selected,
    expanded,
    onPress,
  }: any) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          width: expanded
            ? "96%"
            : "100%",
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
        <View
          style={{
            height: 180,
            position: "relative",
          }}
        >
          {theme.wallpaper && (
            <Image
             source={
  theme.preview ??
  theme.wallpaper
}
              cachePolicy="memory-disk"
              contentFit="cover"
              transition={0}
              recyclingKey={
                theme.name
              }
              style={{
                position:
                  "absolute",
                width: "100%",
                height: "100%",
              }}
            />
          )}

          <View
            style={{
              flex: 1,
              padding: 12,
              justifyContent:
                "space-between",
            }}
          >
            <View>
              <View
                style={{
                  alignSelf:
                    "flex-start",
                  backgroundColor:
                    theme.bubbleOther,
                  width: 70,
                  height: 24,
                  borderRadius: 14,
                  marginBottom: 6,
                }}
              />

              <View
                style={{
                  alignSelf:
                    "flex-start",
                  backgroundColor:
                    theme.bubbleOther,
                  width: 48,
                  height: 24,
                  borderRadius: 14,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  alignSelf:
                    "flex-end",
                  backgroundColor:
                    theme.bubbleMe,
                  width: 82,
                  height: 24,
                  borderRadius: 14,
                  marginBottom: 6,
                }}
              />

              <View
                style={{
                  alignSelf:
                    "flex-end",
                  backgroundColor:
                    theme.bubbleMe,
                  width: 58,
                  height: 24,
                  borderRadius: 14,
                }}
              />
            </View>
          </View>

          <View
            style={{
              position:
                "absolute",
              left: 10,
              right: 10,
              bottom: 10,
              backgroundColor:
                "rgba(0,0,0,0.45)",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 12,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#fff",
                fontWeight:
                  "700",
                fontSize: 13,
              }}
            >
              {theme.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);


export default function ThemeModal({
  visible,
  selectedIndex,
  onPreview,
  onClose,
  onApply,
  profileMode = false,
}: Props) { {
if (!visible) {
  return null;
}
  const insets = useSafeAreaInsets();

  const themeIndexMap =
  useMemo(
    () =>
      Object.fromEntries(
        CHAT_THEMES.map(
          (theme, index) => [
            theme.name,
            index,
          ]
        )
      ),
    []
  );

const sections = useMemo(
  () => [
    {
      title: "Featured",
      data: CHAT_THEMES.filter(
        (t) => t.category === "Featured"
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
      title: "Nature",
      data: CHAT_THEMES.filter(
        (t) => t.category === "Nature"
      ),
    },
    {
      title: "Special",
      data: CHAT_THEMES.filter(
        (t) => t.category === "Nature"
      ),
    },
    {
      title: "Solid",
      data: CHAT_THEMES.filter(
        (t) => t.category === "Solid"
      ),
    },
    {
      title: "Gradient",
      data: CHAT_THEMES.filter(
        (t) => t.category === "Gradient"
      ),
    },
  ],
  []
);


const [expanded, setExpanded] =
  useState(false);

  const [
  collapsedCategories,
  setCollapsedCategories,
] = useState<
  Record<string, boolean>
>({
  Dark: true,
  Dreamscape: true,
  Hearts: true,
  Landscapes: true,
  Nature: true,
  Special: true,
  Solid: true,
  Gradient: true,
});


const flatThemes = useMemo(
  () =>
    sections.flatMap(
      (section) => {
        const items: any[] = [
          {
            type: "header" as const,
            title: section.title,
          },
        ];

        if (
          !collapsedCategories[
            section.title
          ]
        ) {
          items.push(
            ...section.data.map(
              (theme) => ({
                type:
                  "theme" as const,
                sectionTitle:
                  section.title,
                theme,
                originalIndex:
                  themeIndexMap[
                    theme.name
                  ],
              })
            )
          );
        }

        return items;
      }
    ),
  [
    sections,
    collapsedCategories,
    themeIndexMap,
  ]
);

const toggleCategory = useCallback(
  (category: string) => {
    setCollapsedCategories(
      (prev) => ({
        ...prev,
        [category]:
          !prev[category],
      })
    );
  },
  []
);

const toggleAllCategories =
  useCallback(() => {
    setCollapsedCategories(
      (prev) => {
        const allClosed =
          sections.every(
            (section) =>
              prev[
                section.title
              ]
          );

        const next:
          Record<
            string,
            boolean
          > = {};

        for (const section of sections) {
          next[
            section.title
          ] = !allClosed;
        }

        return next;
      }
    );
  }, [sections]);

  const allCollapsed =
  sections.every(
    (section) =>
      collapsedCategories[
        section.title
      ]
  );

  const renderThemeItem =
  useCallback(
    ({ item }: any) => {

      if (
        item.type ===
        "header"
      ) {
        return (
          <TouchableOpacity
            onPress={() =>
              toggleCategory(
                item.title
              )
            }
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              marginTop: 14,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight:
                  "700",
              }}
            >
              {item.title}
            </Text>

            <Ionicons
              name={
                collapsedCategories[
                  item.title
                ]
                  ? "chevron-down"
                  : "chevron-up"
              }
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        );
      }

   const theme =
  (item as any).theme;

   const originalIndex =
  (item as any)
    .originalIndex;

      const selected =
        selectedIndex ===
        originalIndex;

return (
  <ThemeCard
    theme={theme}
    expanded={expanded}
    selected={selected}
   onPress={() => {
  if (profileMode) {
    onApply(
      originalIndex
    );

    return;
  }

  onPreview(
    originalIndex
  );
}}
  />
);
    },
    [
      collapsedCategories,
      selectedIndex,
      expanded,
    ]
  );

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
        height: profileMode
  ? "100%"
  : expanded
  ? "90%"
  : "65%",
        overflow: "hidden",
        paddingBottom: insets.bottom,
      borderTopLeftRadius:
  profileMode ? 0 : 34,

borderTopRightRadius:
  profileMode ? 0 : 34,
      }}
    >
      {/* GLASS BG */}
    <BlurView
        intensity={10}
        tint="systemChromeMaterialDark"
        style={{
          flex: 1,
          paddingTop:
  profileMode
    ? 60
    : 6,
          paddingHorizontal: 16,
        backgroundColor:
  profileMode
    ? "#000"
    : allCollapsed
    ? "#000000cc"
    : expanded
    ? "#00000040"
    : "transparent",
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          borderWidth: 1,
          borderColor: "#ffffff18",
        }}
      >
        {/* HANDLE */}
        {!profileMode && (
        <View
          style={{
            width: 48,
            height: 5,
            borderRadius: 999,
            backgroundColor: "#ffffff40",
            alignSelf: "center",
            marginTop: 4,
            marginBottom: 2,
          }}
        />
        )}

        {/* TITLE */}
    <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  }}
>
  <Text
    style={{
  color: allCollapsed
  ? "#a3fa00e7"
  : "#ffffff",
      fontSize: 24,
      fontWeight: "700",
      letterSpacing: 0.3,
    }}
  >
    Chat Themes
  </Text>

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }}
>

  <TouchableOpacity
onPress={toggleAllCategories}

onLongPress={onClose}

delayLongPress={250}
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
  allCollapsed
    ? "add"
    : "remove"
}
      size={20}
      color="#fff"
    />
  </TouchableOpacity>
{profileMode && (
<>
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
      marginRight: 10,
    }}
  >
    <Ionicons
      name={
        expanded
          ? "grid"
          : "grid-outline"
      }
      size={18}
      color="#fff"
    />
  </TouchableOpacity>
</>
)}

 {!profileMode && (
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
          ? "grid"
          : "grid-outline"
      }
      size={18}
      color="#fff"
    />
  </TouchableOpacity>
 )}

 <TouchableOpacity
  onPress={onClose}
  activeOpacity={0.8}
  style={{
    width: 42,
    height: 42,
    borderRadius: 14,
marginLeft: !profileMode ? 0 : -10,
    backgroundColor: "#ffffff10",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff10",
  }}
>
  <Ionicons
    name="close"
    size={22}
    color="#fff"
  />
</TouchableOpacity>
</View>
</View>

<FlashList
removeClippedSubviews={
  true
}
drawDistance={400}
  data={flatThemes}
  overrideItemLayout={(layout, item) => {
  if (item.type === "header") {
    layout.span = 2;
  }
}}
  keyExtractor={(
    item,
    index
  ) =>
    item.type ===
    "header"
      ? item.title
      : item.theme.name
  }
  numColumns={
    expanded
      ? 2
      : 1
  }
  showsVerticalScrollIndicator={
    false
  }
contentContainerStyle={{
  paddingBottom: 120,
  paddingHorizontal: 6,
}}


renderItem={
  renderThemeItem
}

/>

        {/* BUTTONS */}
        {!profileMode && (
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
        )}
      </BlurView>
    </Pressable>
  </Pressable>
</Modal>
  );
}}