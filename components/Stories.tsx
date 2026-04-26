import Story from "@/components/Story";
import StoryViewer from "@/components/StoryViewer";
import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

export default function StoriesSection({ refreshKey }: { refreshKey: number }) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const shuffledStories = useMemo(() => {
    const first = STORIES[0];
    const rest = STORIES.slice(1);
    return [first, ...shuffleArray(rest)];
  }, [refreshKey]);

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        key={refreshKey}
        data={shuffledStories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
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

      <StoryViewer
        visible={viewerVisible}
        stories={shuffledStories}
        startIndex={startIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}