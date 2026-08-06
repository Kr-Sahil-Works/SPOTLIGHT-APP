import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { useEffect } from "react";
import {
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    View
} from "react-native";

type Props = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const tabs = [
  "Characters",
  "How to Play",
  "Modes",
];

export default function TopTabs({
  selectedIndex,
  onSelect,
}: Props) {
  const tabWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(
      selectedIndex * tabWidth.value,
      {
        duration: 240,
      }
    );
  }, [selectedIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const onLayout = (
    e: LayoutChangeEvent
  ) => {
    tabWidth.value =
      e.nativeEvent.layout.width / tabs.length;
  };

  return (
    <View
      onLayout={onLayout}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            width: "33.33%",
          },
          indicatorStyle,
        ]}
      />

      {tabs.map((tab, index) => (
        <Tab
          key={tab}
          index={index}
          selected={selectedIndex}
          onPress={onSelect}
          title={tab}
        />
      ))}
    </View>
  );
}

function Tab({
  title,
  index,
  selected,
  onPress,
}: any) {
  const progress = useSharedValue(
    selected === index ? 1 : 0
  );

  useEffect(() => {
    progress.value = withTiming(
      selected === index ? 1 : 0,
      {
        duration: 220,
      }
    );
  }, [selected]);

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ["#707070", "#FFFFFF"]
    ),

    transform: [
      {
        scale:
          0.97 +
          progress.value * 0.03,
      },
    ],
  }));

  return (
    <Pressable
      style={styles.tab}
      onPress={() => onPress(index)}
    >
      <Animated.Text
        style={[
          styles.text,
          textStyle,
        ]}
      >
        {title}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,

    flexDirection: "row",

    marginHorizontal: 20,

    marginBottom: 12,

    borderBottomWidth: 1,

    borderBottomColor: "#1E1E1E",

    position: "relative",
  },

  tab: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },

  text: {
    fontSize: 15,

    fontWeight: "800",
  },

  indicator: {
    position: "absolute",

    bottom: -1,

    left: 0,

    height: 3,

    borderRadius: 20,

    backgroundColor: "#F2A900",
  },
});