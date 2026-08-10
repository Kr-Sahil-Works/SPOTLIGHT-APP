import { StyleSheet, View } from "react-native";

type Props = {
  online: boolean;
};

export default function OnlineRing({
  online,
}: Props) {
  if (!online) return null;

  return <View style={styles.ring} />;
}

const styles = StyleSheet.create({
  ring: {
    ...StyleSheet.absoluteFillObject,

    borderRadius: 999,

    borderWidth: 3,

    borderColor: "#2EDB59",
  },
});