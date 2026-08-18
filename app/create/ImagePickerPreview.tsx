import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ImagePickerPreviewProps = {
  image: string | null;
  disabled?: boolean;
  onPick: () => void;
};

export default function ImagePickerPreview({
  image,
  disabled = false,
  onPick,
}: ImagePickerPreviewProps) {
  return (
    <View style={styles.container}>
      <Image
        source={
          image
            ? { uri: image }
            : require("@/assets/images/icons/iconbg.webp")
        }
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        allowDownscaling
        transition={120}
      />

      {image && (
        <TouchableOpacity
          style={styles.changeButton}
          onPress={onPick}
          disabled={disabled}
        >
          <Ionicons
            name="image-outline"
            size={20}
            color={COLORS.white}
          />

          <Text style={styles.changeText}>
            Change
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  changeButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  changeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});