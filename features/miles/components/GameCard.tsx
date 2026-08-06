import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";

type Props = {
  image: ImageSourcePropType;
  onPress?: () => void;
};

export default function GameCard({
  image,
  onPress,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "rgba(255,255,255,0.08)" }}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
        ]}
      >
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    paddingHorizontal: 18,
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 150,
  },
});