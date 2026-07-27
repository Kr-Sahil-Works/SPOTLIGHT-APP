import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { MilesCardType } from "../../types";

type Props = {
  item: MilesCardType;
};

export default function MilesCard({ item }: Props) {
  return (
    <Pressable
      style={{
        marginBottom: 14,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: 140,
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.18)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={item.icon as any}
            size={26}
            color="white"
          />
        </View>

        <View>
          <Text
            style={{
              color: "#fff",
              fontSize: 21,
              fontWeight: "700",
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              color: "rgba(255,255,255,0.82)",
              marginTop: 4,
              fontSize: 14,
            }}
          >
            {item.subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}