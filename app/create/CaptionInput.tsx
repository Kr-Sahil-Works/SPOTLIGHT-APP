import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import {
    StyleSheet,
    TextInput,
    View,
} from "react-native";

type CaptionInputProps = {
  userImage?: string | null;
  caption: string;
  disabled?: boolean;
  onChange: (text: string) => void;
};

export default function CaptionInput({
  userImage,
  caption,
  disabled = false,
  onChange,
}: CaptionInputProps) {
  return (
    <View style={styles.container}>
      <Image
        source={
          userImage?.trim()
            ? { uri: userImage }
            : require("@/assets/images/icons/iconbg.webp")
        }
        style={styles.avatar}
        contentFit="cover"
        cachePolicy="memory-disk"
        allowDownscaling
      />

      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Write a caption..."
        placeholderTextColor={COLORS.grey}
        multiline
        value={caption}
        onChangeText={onChange}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 16,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
  },

  input: {
    flex: 1,
    minHeight: 44,
    marginLeft: 12,
    paddingTop: 10,
    paddingHorizontal: 4,
    color: COLORS.white,
    fontSize: 15,
    textAlignVertical: "top",
  },
});