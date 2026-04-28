import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Story = {
  id: string;
  username: string;
  avatar: any;
  hasStory: boolean;
};

const FALLBACK =
  "https://ui-avatars.com/api/?background=random&name=User";

export default function Story({
  story,
  onPress,
}: {
  story: Story;
  onPress?: () => void;
}) {
  const [error, setError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.storyWrapper}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.storyRing,
          !story.hasStory && styles.noStory,
        ]}
      >
       <Image
  source={error ? { uri: FALLBACK } : story.avatar}
  style={styles.storyAvatar}
  contentFit="cover"
  cachePolicy="memory-disk"
  blurRadius={error ? 6 : 0}
  onError={() => setError(true)}
/>
      </View>

      <Text style={styles.storyUsername} numberOfLines={1}>
        {story.username}
      </Text>
    </TouchableOpacity>
  );
}