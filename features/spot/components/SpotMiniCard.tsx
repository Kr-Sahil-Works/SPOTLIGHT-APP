import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  image: ImageSourcePropType;
};

export default function SpotMiniCard({
  title,
  image,
}: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={image}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 108,
    height: 130,

    borderRadius: 26,

    backgroundColor: "#171717",

    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 14,
  },

  image: {
    width: 88,
    height: 88,
  },

  title: {
    color: "#dcdada",

    fontSize: 16,

    fontWeight: "700",
  },
});