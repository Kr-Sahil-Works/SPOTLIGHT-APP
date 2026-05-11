import ChatProfileScreen from "@/app/chat/components/ChatProfileScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatProfilePage() {
  const { userId } = useLocalSearchParams();

  return (
    <ChatProfileScreen
      userId={userId as any}
    />
  );
}