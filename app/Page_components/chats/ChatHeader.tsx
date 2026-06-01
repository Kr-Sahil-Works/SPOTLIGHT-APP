import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ChatHeader() {
  const router = useRouter();

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 18 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        
        <Text style={{
          color: "#22c55e",
          fontSize: 20,
          fontWeight: "800"
        }}>
          Messages
        </Text>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <TouchableOpacity
     onPress={() => router.push("/notespage")}
            style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 10 }}
          >
            <Image source={require("@/assets/images/icons/notes.webp")} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

          <TouchableOpacity
      onPress={() => router.push("/calculator")}
            style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 10 }}
          >
            <Image source={require("@/assets/images/icons/calc.webp")} style={{ width: 20, height: 20}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}