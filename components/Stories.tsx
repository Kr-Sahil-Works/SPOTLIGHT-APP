import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import { FlatList, View } from "react-native";

export default function StoriesSection() {
  return (
    <View style={styles.storiesContainer}>
      <FlatList
        data={STORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}

        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews

        renderItem={({ item }) => <Story story={item} />}
      />
    </View>
  );
}