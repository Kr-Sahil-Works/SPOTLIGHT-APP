import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CreateHeaderProps = {
  isSharing: boolean;
  isOnline: boolean;
  hasImage: boolean;
  onClose: () => void;
  onShare: () => void;
};

export default function CreateHeader({
  isSharing,
  isOnline,
  hasImage,
  onClose,
  onShare,
}: CreateHeaderProps) {
  return (
    <View
      style={{
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        onPress={onClose}
        disabled={isSharing}
      >
        <Ionicons
          name="close-outline"
          size={28}
          color={
            isSharing
              ? COLORS.grey
              : COLORS.white
          }
        />
      </TouchableOpacity>

      <Text
        style={{
          color: COLORS.white,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        New Post
      </Text>

      <TouchableOpacity
        disabled={
          isSharing ||
          !hasImage ||
          !isOnline
        }
        onPress={onShare}
        style={{
          minWidth: 64,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(34,197,94,0.12)",
          opacity:
            isSharing ||
            !hasImage ||
            !isOnline
              ? 0.5
              : 1,
        }}
      >
        {isSharing ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
          />
        ) : (
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: "800",
              fontSize: 14,
            }}
          >
            {isOnline ? "Share" : "Offline"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}