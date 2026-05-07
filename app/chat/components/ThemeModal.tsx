import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
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
  const row1 =
    CHAT_THEMES.slice(0, 12);

  const row2 =
    CHAT_THEMES.slice(12, 24);

  const row3 =
    CHAT_THEMES.slice(24, 36);

  const renderCard = (
    theme: any,
    i: number
  ) => {
    const selected =
      selectedIndex === i;

    const Content = (
      <View
        style={{
          flex: 1,

          padding: 5,

          justifyContent:
            "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor:
              theme.bubbleMe,

            height: 18,

            borderRadius: 6,

            marginBottom: 4,
          }}
        />

        <View
          style={{
            backgroundColor:
              theme.bubbleOther,

            height: 14,

            width: "70%",

            borderRadius: 6,
          }}
        />
      </View>
    );

    return (
      <TouchableOpacity
        key={i}
        onPress={() =>
          onPreview(i)
        }
        style={{
          width: 96,

          height: 142,

          marginRight: 10,

          marginBottom: 12,

          borderRadius: 16,

          borderWidth: selected
            ? 2
            : 0,

          borderColor: "#fff",

          overflow: "hidden",

          backgroundColor:
            "#000",
        }}
      >
        {theme.wallpaper ? (
          <ImageBackground
            source={
              theme.wallpaper
            }
            resizeMode="cover"
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,

                backgroundColor:
                  "#00000055",
              }}
            >
              {Content}
            </View>
          </ImageBackground>
        ) : theme.gradient ? (
          <LinearGradient
            colors={
              theme.gradient
            }
            style={{
              flex: 1,
            }}
          >
            {Content}
          </LinearGradient>
        ) : (
          <View
            style={{
              flex: 1,

              backgroundColor:
                theme.background,
            }}
          >
            {Content}
          </View>
        )}
      </TouchableOpacity>
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
            color: "#fff",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 20,
            letterSpacing: 0.3,
          }}
        >
          Chat Themes
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent:
                "space-between",
            }}
          >
            {CHAT_THEMES.map(
              (theme, i) => {
                const selected =
                  selectedIndex === i;

                const Content = (
                  <View
                    style={{
                      flex: 1,
                      padding: 14,
                      justifyContent:
                        "flex-end",
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
                );

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() =>
                      onPreview(i)
                    }
                    activeOpacity={0.9}
                    style={{
                    width: "44%",
                    height: 200,
                      marginBottom: 16,
                      borderRadius: 28,
                      overflow: "hidden",
                      borderWidth: selected
                        ? 2.5
                        : 1,
                      borderColor: selected
                        ? "#ffffff"
                        : "#ffffff18",
                      backgroundColor:
                        "#1a1a1a",
                    }}
                  >
                    {theme.wallpaper ? (
                      <ImageBackground
                        source={
                          theme.wallpaper
                        }
                        resizeMode="cover"
                        style={{
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor:
                              "#00000035",
                          }}
                        >
                          {Content}
                        </View>
                      </ImageBackground>
                    ) : theme.gradient ? (
                      <LinearGradient
                        colors={
                          theme.gradient
                        }
                        style={{
                          flex: 1,
                        }}
                      >
                        {Content}
                      </LinearGradient>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor:
                            theme.background,
                        }}
                      >
                        {Content}
                      </View>
                    )}

                    {/* SELECTED CHECK */}
                    {selected && (
                      <View
                        style={{
                          position:
                            "absolute",
                          top: 10,
                          right: 10,
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          backgroundColor:
                            "#ffffffdd",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
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
              }
            )}
          </View>
        </ScrollView>

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