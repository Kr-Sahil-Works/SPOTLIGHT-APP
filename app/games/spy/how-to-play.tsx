import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  CHARACTERS,
  GAME_MODES,
  HOW_TO_PLAY,
} from "@/features/spy/constants/rules";

const { width } = Dimensions.get("window");

const TABS = [
  "Characters",
  "How to Play",
  "Modes",
];

const PAGES = [
  "characters",
  "how",
  "modes",
] as const;

type PageType = (typeof PAGES)[number];

export default function HowToPlayScreen() {
  const flatListRef =
    useRef<FlatList<PageType>>(null);

  const [selectedTab, setSelectedTab] =
    useState(0);



  const scrollToPage = (
    index: number
  ) => {
    setSelectedTab(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const onMomentumScrollEnd = (
    event: any
  ) => {
    const page = Math.round(
      event.nativeEvent.contentOffset.x /
        width
    );

    setSelectedTab(page);
  };

const renderCharacters = () => (
  <View style={styles.page}>
    {CHARACTERS.map((item) => (
      <View
        key={item.id}
        style={styles.characterRow}
      >
        <Image
          source={item.image}
          style={styles.characterImage}
          contentFit="contain"
        />

        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.goalLabel}>
            Target
          </Text>

          <Text style={styles.description}>
            {item.description}
          </Text>
        </View>
      </View>
    ))}

    <View style={styles.spyCount}>
      <Text style={styles.spyTitle}>
        Number of Spies
      </Text>

      <Text style={styles.spyText}>
        4–8 Players • 1 Spy
      </Text>
    </View>
  </View>
);

const renderHow = () => (
  <View style={styles.page}>
    {HOW_TO_PLAY.map((item, index) => (
      <View key={item.id}>
        <View
          style={[
            styles.step,
            index === 0 && { marginTop: 20 },
          ]}
        >
          <View style={styles.circle}>
            <Text style={styles.no}>
              {item.id}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </View>
        </View>

        {index !== HOW_TO_PLAY.length - 1 && (
          <View
            style={{
              height: 1,
              backgroundColor: "#1F1F1F",
              marginLeft: 32,
              marginRight: 10,
              marginBottom: 18,
            }}
          />
        )}
      </View>
    ))}
  </View>
);

  const renderModes = () => (
    <View style={styles.page}>
      {GAME_MODES.map((item) => (
        <View
          key={item.id}
          style={styles.modeRow}
        >
          <Image
            source={item.image}
            style={styles.modeImage}
            contentFit="contain"
          />

          <View style={styles.info}>
            <Text style={styles.name}>
              {item.title}
            </Text>

            <Text
              style={styles.description}
            >
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
const renderItem = ({
  item,
}: {
  item: PageType;
}) => {
  return (
    <View
      style={{
        width,
        paddingHorizontal: 20,
      }}
    >
      {item === "characters" &&
        renderCharacters()}

      {item === "how" &&
        renderHow()}

      {item === "modes" &&
        renderModes()}
    </View>
  );
};

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      <View style={styles.content}>

        {/* Header */}

<View style={styles.header}>
  <Pressable
    style={styles.backButton}
    onPress={() => router.back()}
  >
    <Ionicons
      name="chevron-back"
      size={22}
      color="#F2A900"
    />
  </Pressable>

  <Text style={styles.headerTitle}>
    Rules
  </Text>
</View>

        {/* Tabs */}

        <View style={styles.tabs}>

          {["Characters", "How To Play", "Modes"].map(
            (tab, index) => (
              <Pressable
                key={tab}
                style={styles.tab}
                onPress={() =>
                  scrollToPage(index)
                }
              >
                <Text
                  style={[
                    styles.tabText,

                    selectedTab === index &&
                      styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>

                {selectedTab === index  && (
                  <View
                    style={styles.indicator}
                  />
                )}
              </Pressable>
            )
          )}

        </View>

        {/* Pages */}

 <FlatList<PageType>
  ref={flatListRef}
  data={PAGES}
  horizontal
  pagingEnabled
  bounces={false}
  decelerationRate="fast"
  keyExtractor={(item) => item}
  showsHorizontalScrollIndicator={false}
  onMomentumScrollEnd={onMomentumScrollEnd}
  renderItem={renderItem}
/>

        {/* Bottom */}

        <View style={styles.footer}>
          <Pressable
            style={styles.button}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.buttonText}
            >
              GOT IT
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    flex: 1,
  },

header: {
  height: 60,

  paddingHorizontal: 20,

  flexDirection: "row",

  alignItems: "center",
  marginBottom:20,
},

  backButton: {
    width: 30,
    height: 30,

    borderRadius: 10,

    backgroundColor: "#141414",

    borderWidth: 1,
    borderColor: "#252525",

    justifyContent: "center",

    alignItems: "center",
  },

headerTitle: {
  marginLeft: 20,

  color: "#dbd8c4",

  fontSize: 24,

  fontWeight: "900",

  letterSpacing: 0.6,
},

  tabs: {
    flexDirection: "row",

    height: 42,

    borderBottomWidth: 1,

    borderBottomColor: "#1F1F1F",

    marginBottom: 6,
  },

  tab: {
    flex: 1,

    justifyContent: "space-between",

    alignItems: "center",
  },

  tabText: {
    color: "#6F6F6F",

    fontSize: 15,

    fontWeight: "700",
  },

  activeTabText: {
    color: "#FFF",
  },

  indicator: {
    width: "70%",

    height: 3,

    borderRadius: 50,

    backgroundColor: "#F2A900",
  },

page: {
  flex: 1,

  justifyContent: "flex-start",

  paddingTop: 0,
},

characterRow: {
  flexDirection: "row",

  alignItems: "center",

  paddingVertical: 6,

  marginBottom: 8,

  borderBottomWidth: 1,
  borderBottomColor: "#1D1D1D",
},

  characterImage: {
    width: 100,

    height: 100,

    marginRight: 18,
  },

  info: {
    flex: 1,
  },

  name: {
    color: "#FFF",

    fontSize: 18,

    fontWeight: "900",
  },

  goalLabel: {
    marginTop: 2,

    color: "#F2A900",

    fontSize: 12,

    fontWeight: "900",

    letterSpacing: 1,
  },


  description: {
    color: "#c0b7b7",

    marginTop: 8,

    lineHeight: 18,

    fontSize: 14,
  },

  step: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: 20,
  },

  circle: {
    width: 34,

    height: 34,

    borderRadius: 18,

    backgroundColor: "#F2A900",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 18,
  },

  no: {
    color: "#111",

    fontSize: 15,

    fontWeight: "900",
  },

  stepTitle: {
    color: "#FFF",

    fontSize: 18,

    fontWeight: "800",
  },

  modeRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 10,

    borderBottomWidth: 1,

    borderBottomColor: "#1D1D1D",
  },

  modeImage: {
    width: 120,

    height: 120,

    marginRight: 18,
  },

  footer: {
    paddingHorizontal: 20,

    paddingBottom: 22,

    paddingTop: 12,
  },

  button: {
    height: 58,

    borderRadius: 18,

    backgroundColor: "#F2A900",

    justifyContent: "center",

    alignItems: "center",
  },

  buttonText: {
    color: "#111",

    fontSize: 16,

    fontWeight: "900",

    letterSpacing: 1,
  },

  spyCount: {
  marginTop: 12,
},

spyTitle: {
  color: "#FFF",
  fontSize: 15,
  fontWeight: "700",
},

spyText: {
  marginTop: 4,
  color: "#8A8A8A",
  fontSize: 14,
},
});