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
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Story story={item} />}
      />
    </View>
  );
}