import ChatProfileScreen from "@/features/chat/profile/ChatProfileScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatProfilePage() {
  const { userId } = useLocalSearchParams();

  return (
    <ChatProfileScreen
      userId={userId as any}
    />
  );
}