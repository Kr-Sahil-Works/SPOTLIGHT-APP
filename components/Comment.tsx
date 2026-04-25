import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Text, View } from "react-native";


interface Comment {
  content: string;
  _creationTime: number;
  user: {
    fullname: string;
    image?: string | null;
  };
}

export default function Comment({ comment }: { comment: Comment }) {
  const hasImage = !!comment.user?.image;

  return (
    <View style={styles.commentContainer}>
      
      {/* 🔥 AVATAR */}
      {hasImage ? (
  <Image
  source={{ uri: comment.user.image! }}
  style={styles.commentAvatar}
/>
      ) : (
        <View
          style={[
            styles.commentAvatar,
            {
              backgroundColor: "#111",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons name="person" size={16} color="#fff" />
        </View>
      )}

      {/* 🔥 CONTENT */}
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>
          {comment.user?.fullname || "User"}
        </Text>

        <Text style={styles.commentText}>
          {comment.content}
        </Text>

        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}