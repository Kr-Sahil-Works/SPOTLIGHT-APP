import Story from "@/components/Story";
import StoryViewer from "@/components/StoryViewer";
import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";

export default function StoriesSection({
  refreshKey,
  setSwipeEnabled,
}: {
  refreshKey: number;
  setSwipeEnabled?: (v: boolean) => void;
}) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  /* 🔥 store last shuffle time */
  const lastShuffleTime = useRef(0);

  /* 🔥 store last shuffled result */
  const [storiesData, setStoriesData] = useState<any[]>([]);

  /* ✅ proper shuffle */
  const shuffleArray = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /* 🔥 SMART SHUFFLE LOGIC */
  useEffect(() => {
    const now = Date.now();

    const SHOULD_SHUFFLE =
      now - lastShuffleTime.current > 1000 || storiesData.length === 0;

    if (!SHOULD_SHUFFLE) return;

    lastShuffleTime.current = now;

    if (!STORIES || STORIES.length === 0) return;

    const first = STORIES[0];        // 👤 your story
    const rest = STORIES.slice(1);  // 👥 others

    const shuffled = [first, ...shuffleArray(rest)];

    setStoriesData(shuffled);
  }, [refreshKey]);

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        data={storiesData}
        horizontal
        showsHorizontalScrollIndicator={false}

        /* 🔥 force rerender */
        extraData={storiesData}
        keyExtractor={(item, index) => item.id + "_" + index}

        /* 🔥 swipe control only for stories */
        onScrollBeginDrag={() => setSwipeEnabled?.(false)}
        onMomentumScrollEnd={() => {
          setTimeout(() => setSwipeEnabled?.(true), 80);
        }}

        renderItem={({ item, index }) => (
          <Story
            story={item}
            onPress={() => {
              setStartIndex(index);
              setViewerVisible(true);
            }}
          />
        )}
      />

      {/* 👀 viewer */}
      <StoryViewer
        visible={viewerVisible}
        stories={storiesData}
        startIndex={startIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}