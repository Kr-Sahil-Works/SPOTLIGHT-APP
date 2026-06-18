import useChatListTheme from "@/hooks/useChatListTheme";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useMMKVString,
} from "react-native-mmkv";

import {
  storage,
} from "@/lib/mmkv";


type Props = {
  onOpenChatListTheme: () => void;
  isOnline?: boolean;
};

export default function ChatHeader({
  onOpenChatListTheme,
  isOnline = true,
}: Props) {
  const router = useRouter();
  const theme =
  useChatListTheme();

const [selectedTheme] =
  useMMKVString(
    "selected-chat-list-theme",
    storage
  );

const useGreenNotes =
  selectedTheme ===
    "spotlight-green" ||
  selectedTheme ===
    "aurora" 


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
  disabled={!isOnline}
  onPress={onOpenChatListTheme}
  style={{
    backgroundColor:
      theme.cardBg,

    borderWidth: 1,

    borderColor:
      theme.cardBorder,

    padding: 6,

    borderRadius: 10,

    opacity:
      !isOnline
        ? 0.45
        : 1,
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
  source={
    useGreenNotes
      ? require("@/assets/images/icons/notes.webp")
      : require("@/assets/images/icons/notetheme.webp")
  }
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
            source={
              useGreenNotes 
              ?  require("@/assets/images/icons/calc.webp")
                : require("@/assets/images/icons/calctheme.webp")
              }
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