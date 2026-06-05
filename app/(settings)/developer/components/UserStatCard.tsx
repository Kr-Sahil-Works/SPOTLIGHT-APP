import { Ionicons } from "@expo/vector-icons";
import {
    Text,
    View,
} from "react-native";

export default function UserStatCard({
  title,
  value,
  icon,
}: any) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor:
          "rgba(255,255,255,0.04)",
        borderRadius: 22,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor:
          "rgba(255,255,255,0.05)",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#00ff88"
      />

      <Text
        style={{
          color: "#777",
          marginTop: 12,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "800",
          marginTop: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );
}