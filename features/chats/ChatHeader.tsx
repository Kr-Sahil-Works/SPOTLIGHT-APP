import useChatListTheme from "@/hooks/useChatListTheme";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


type Props = {
  onOpenChatListTheme: () => void;
};

export default function ChatHeader({
  onOpenChatListTheme,
}: Props) {
  const router = useRouter();
  const theme =
  useChatListTheme();

return (
  <View
    style={{
      paddingTop: 20,
      paddingHorizontal: 18,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color:
            theme.headerColor ??
            "#22c55e",
          fontSize: 24,
          fontWeight: "800",
        }}
      >
        Messages
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 14,
        }}
      >
        {/* APP THEME */}

        <TouchableOpacity
          onPress={
            onOpenChatListTheme
          }
          style={{
            backgroundColor:
              theme.cardBg,

            borderWidth: 1,

            borderColor:
              theme.cardBorder,

            padding: 6,

            borderRadius: 10,
          }}
        >
          <Image
            source={require("@/assets/images/icons/theme.webp")}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>

        {/* NOTES */}

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/notespage"
            )
          }
          style={{
            backgroundColor:
              theme.cardBg,

            borderWidth: 1,

            borderColor:
              theme.cardBorder,

            padding: 6,

            borderRadius: 10,
          }}
        >
          <Image
            source={require("@/assets/images/icons/notes.webp")}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>

        {/* CALCULATOR */}

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/calculator"
            )
          }
          style={{
            backgroundColor:
              theme.cardBg,

            borderWidth: 1,

            borderColor:
              theme.cardBorder,

            padding: 6,

            borderRadius: 10,
          }}
        >
          <Image
            source={require("@/assets/images/icons/calc.webp")}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
}