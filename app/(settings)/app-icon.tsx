import React, {
  memo,
  useCallback,
  useRef,
  useState
} from "react";

import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import AppIconToast from "@/components/common/AppIconToast";
import { useAppToast } from "@/components/common/AppToast";

import { storage } from "@/lib/mmkv";

import {
  closeApp,
  disablePreviousIcon,
  setAppIcon,
} from "expo-dynamic-icons";

const BG = "#020403";
const CARD = "#0A0D0B";
const CARD_SELECTED = "#111714";
const BORDER = "#1A221D";
const GREEN = "#01CA08";
const TEXT = "#FFFFFF";
const SUBTEXT = "#8E9892";
const PREMIUM = "#FFD54A";

type IconItem = {
  id: string;
  title: string;
  desc: string;
  image: any;
  premium?: boolean;
};

const ICONS: IconItem[] = [
  {
    id: "green",
    title: "Green",
    desc: "Classic MilesSpot",
    image: require("@/assets/images/icons/app/default-green.png"),
  },
  {
    id: "purple",
    title: "Purple",
    desc: "Elegant Purple",
    image: require("@/assets/images/icons/app/purple.png"),
  },
  {
    id: "blue",
    title: "Blue",
    desc: "Ocean Blue",
    image: require("@/assets/images/icons/app/blue.png"),
  },
  {
    id: "teal",
    title: "Teal",
    desc: "Fresh Teal",
    image: require("@/assets/images/icons/app/teal.png"),
  },
  {
    id: "orange",
    title: "Orange",
    desc: "Sunset Orange",
    image: require("@/assets/images/icons/app/orange.png"),
  },
  {
    id: "memory_map",
    title: "Memory Map",
    desc: "Special Edition",
    premium: true,
    image: require("@/assets/images/icons/app/memory_map.png"),
  },
  {
    id: "memory_timeline",
    title: "Timeline",
    desc: "Special Edition",
    premium: true,
    image: require("@/assets/images/icons/app/memory_timeline.png"),
  },
];


    const themeColors: Record<string, string> = {
  Green: "#22C55E",
  Purple: "#a158e6",
  Blue: "#248EE4",
  Teal: "#14B8A6",
  Orange: "#F97316",
  "Memory Map": "#e1c805",
  Timeline: "#d240f2",
};

  

const CLASSIC_ICONS = ICONS.filter(
  (item) => !item.premium
);

const PREMIUM_ICONS = ICONS.filter(
  (item) => item.premium
);

const IconCard = memo(
  ({
    item,
    isCurrent,
    isSelected,
    loading,
    onSelect,
    onApply,
  }: {
    item: IconItem;
    isCurrent: boolean;
    isSelected: boolean;
    loading: boolean;
    onSelect: () => void;
    onApply: () => void;
  }) => {
    const accent =
      themeColors[item.title] ?? GREEN;

    const scale = useRef(
      new Animated.Value(1)
    ).current;

    const glow = useRef(
      new Animated.Value(
        isSelected ? 1 : 0
      )
    ).current;

    const applyScale = useRef(
      new Animated.Value(
        isSelected && !isCurrent ? 1 : 0
      )
    ).current;

    React.useEffect(() => {
      Animated.timing(glow, {
        toValue: isSelected ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }).start();

      Animated.spring(applyScale, {
        toValue:
          isSelected && !isCurrent
            ? 1
            : 0,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }).start();
    }, [
      isSelected,
      isCurrent,
    ]);

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [
              { scale },
              {
                translateY:
                  isSelected
                    ? -3
                    : 0,
              },
            ],
          },
        ]}
      >
        <Pressable
          disabled={loading}
          onPress={onSelect}
          onPressIn={pressIn}
          onPressOut={pressOut}
        >
          <Animated.View
            style={[
              styles.card,
              isSelected &&
                styles.selectedCard,
              {
                borderColor:
                  glow.interpolate({
                    inputRange: [
                      0,
                      1,
                    ],
                    outputRange: [
                      BORDER,
                      accent,
                    ],
                  }),

                shadowOpacity:
                  glow.interpolate({
                    inputRange: [
                      0,
                      1,
                    ],
                    outputRange: [
                      0,
                      0.30,
                    ],
                  }),
              },
            ]}
          >
            {item.premium && (
              <View
                style={
                  styles.premiumBadge
                }
              >
                <Ionicons
                  name="diamond"
                  size={12}
                  color="#1B1B1B"
                />

                <Text
                  style={
                    styles.premiumText
                  }
                >
                  Premium
                </Text>
              </View>
            )}

            <Animated.View
              style={{
                transform: [
                  {
                    scale:
                      glow.interpolate({
                        inputRange: [
                          0,
                          1,
                        ],
                        outputRange: [
                          1,
                          1.04,
                        ],
                      }),
                  },
                ],
              }}
            >
              <Image
                source={item.image}
                transition={250}
                contentFit="contain"
                style={
                  styles.iconImage
                }
              />
            </Animated.View>

            <Text
              style={styles.title}
            >
              {item.title}
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {item.desc}
            </Text>

            {isCurrent && (
              <View
                style={[
                  styles.currentBadge,
                  {
                    backgroundColor:
                      accent,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={12}
                  color="#000"
                />

                <Text
                  style={
                    styles.currentText
                  }
                >
                  Current
                </Text>
              </View>
            )}

            {!isCurrent &&
              isSelected && (
                <Animated.View
                  style={{
                    width: "100%",
                    transform: [
                      {
                        scale:
                          applyScale,
                      },
                    ],
                    opacity:
                      applyScale,
                  }}
                >
                  <Pressable
                    disabled={
                      loading
                    }
                    onPress={
                      onApply
                    }
                    style={[
                      styles.applyButton,
                      {
                        backgroundColor:
                          accent,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                     style={{
  marginTop: 3,
}}
                      color="#000"
                    />

                    <Text
                      style={
                        styles.applyText
                      }
                    >
                      Apply
                    </Text>
                  </Pressable>
                </Animated.View>
              )}

            <Animated.View
              style={[
                styles.bottomAccent,
                {
                  opacity: glow,
                  backgroundColor:
                    accent,
                },
              ]}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }
);

IconCard.displayName = "IconCard";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0B0F0C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  headerTitle: {
    color: GREEN,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

hero: {
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  elevation: 8,
},

heroIcon: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#0D1610",
  borderWidth: 1,
  borderColor: "#12381A",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
  shadowColor: GREEN,
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  elevation: 8,
},

  heroTitle: {
    color: TEXT,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },

  heroSubtitle: {
    color: SUBTEXT,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 42,
  },

  section: {
    marginTop: 25,
    marginBottom: 36,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: SUBTEXT,
    fontSize: 13,
    marginTop: 5,
  },

  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  premiumIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PREMIUM,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

cardRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16,
},

cardWrapper: {
  width: "48%",
  alignSelf: "flex-start",
},

  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: "center",
    overflow: "hidden",
    minHeight: 265,
  },

selectedCard: {
  backgroundColor: CARD_SELECTED,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 8,
  },
  elevation: 8,
},
    premiumBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PREMIUM,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 10,
  },

  premiumText: {
    color: "#181818",
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },

  iconImage: {
    width: 96,
    height: 96,
    marginTop: 10,
    marginBottom: 18,
  },

  title: {
    color: TEXT,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: SUBTEXT,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },

currentBadge: {
  marginTop: 16,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: GREEN,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
},

  currentText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 4,
  },
applyButton: {
  marginTop: 14,
  alignSelf: "center",
  width: "82%",
  height: 38,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

applyText: {
  color: "#000",
  fontSize: 14,
  fontWeight: "800",
  marginLeft: 5,
},

bottomAccent: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 5,
  backgroundColor: GREEN,
},

  footerSpace: {
    height: 40,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
});

export default function AppIconScreen() {
  const router = useRouter();

  const { showToast } = useAppToast();

  const [currentIcon, setCurrentIcon] =
    useState(
      storage.getString("launcherIcon") ??
        "green"
    );

    const [selectedIcon, setSelectedIcon] =
  useState(currentIcon);

    const currentAccent =
  themeColors[
    ICONS.find(
      (i) => i.id === currentIcon
    )?.title ?? "Green"
  ];

  const [loading, setLoading] =
    useState(false);

  const [toastVisible, setToastVisible] =
    useState(false);

  const [selectedTitle, setSelectedTitle] =
    useState("");

  const fade = useRef(
    new Animated.Value(0)
  ).current;

const applyIcon = useCallback(
  async () => {
    if (loading) return;

    const item = ICONS.find(
      (i) => i.id === selectedIcon
    );

    if (!item) return;

    if (item.id === currentIcon)
      return;

    try {
      setLoading(true);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light
      );

      setAppIcon(item.id);

      storage.set(
        "launcherIcon",
        item.id
      );

      setCurrentIcon(item.id);

      setSelectedIcon(item.id);

      setSelectedTitle(item.title);

      setToastVisible(true);
    } catch (error) {
      console.log(error);

      showToast({
        message:
          "Failed to change app icon",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  },
  [
    currentIcon,
    selectedIcon,
    loading,
    showToast,
  ]
);
  const handleClose =
    useCallback(async () => {
      try {
        await disablePreviousIcon();
      } catch (e) {
        console.log(e);
      }

      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start(async () => {
        await closeApp();
      });
    }, [fade]);

  return (
   <SafeAreaView
  style={{ flex: 1 }}
  edges={["left", "right", "bottom"]}
>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={GREEN}
          />
        </Pressable>

    <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  }}
>
  <Ionicons
    name="apps"
    size={22}
    color={GREEN}
  />

  <Text style={styles.headerTitle}>
    App Icons
  </Text>
</View>

        <View
          style={{
            width: 42,
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

                {/* Classic */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={styles.sectionTitle}
            >
              Classic
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Clean and colorful
              launcher icons.
            </Text>
          </View>

          <View
            style={styles.cardRow}
          >
       {CLASSIC_ICONS.slice(0, 2).map((item) => (
  <IconCard
    key={item.id}
    item={item}
    loading={loading}
    isCurrent={currentIcon === item.id}
    isSelected={selectedIcon === item.id}
    onSelect={() => setSelectedIcon(item.id)}
    onApply={applyIcon}
  />
))}
          </View>

          <View
            style={styles.cardRow}
          >
         {CLASSIC_ICONS.slice(2, 4).map((item) => (
  <IconCard
    key={item.id}
    item={item}
    loading={loading}
    isCurrent={currentIcon === item.id}
    isSelected={selectedIcon === item.id}
    onSelect={() => setSelectedIcon(item.id)}
    onApply={applyIcon}
  />
))}
          </View>

         <View
  style={styles.cardRow}
>
  <IconCard
    item={CLASSIC_ICONS[4]}
    loading={loading}
    isCurrent={
      currentIcon ===
      CLASSIC_ICONS[4].id
    }
    isSelected={
      selectedIcon ===
      CLASSIC_ICONS[4].id
    }
    onSelect={() =>
      setSelectedIcon(
        CLASSIC_ICONS[4].id
      )
    }
    onApply={applyIcon}
  />

  <View
    style={{
      width: "48%",
    }}
  />
</View>
        </View>

        {/* Premium */}

        <View style={styles.section}>
          <View
            style={
              styles.premiumHeader
            }
          >
            <View
              style={
                styles.premiumIcon
              }
            >
              <Ionicons
                name="diamond"
                size={18}
                color="#111"
              />
            </View>

            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Premium
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                Exclusive launcher
                icons.
              </Text>
            </View>
          </View>

          <View
            style={styles.cardRow}
          >
           {PREMIUM_ICONS.map((item) => (
  <IconCard
    key={item.id}
    item={item}
    loading={loading}
    isCurrent={
      currentIcon === item.id
    }
    isSelected={
      selectedIcon === item.id
    }
    onSelect={() =>
      setSelectedIcon(item.id)
    }
    onApply={applyIcon}
  />
))}
          </View>

          <View
            style={
              styles.footerSpace
            }
          />
        </View>
      </ScrollView>

            <Animated.View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            opacity: fade,
          },
        ]}
      />

      <AppIconToast
        visible={toastVisible}
        iconName={selectedTitle}
        onClose={handleClose}
      />
    </SafeAreaView>
  );
}

