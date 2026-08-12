import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";

import { LobbyChatMessage } from "../../types/chat";

import LobbyChatBubble from "./LobbyChatBubble";
import SystemMessage from "./SystemMessage";

type Props = {
  messages: LobbyChatMessage[];
};

export default function LobbyChatList({
  messages,
}: Props) {
  return (
    <FlashList
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        if (item.type === "system") {
          return (
            <SystemMessage
              message={item.message}
            />
          );
        }

        return (
          <LobbyChatBubble
            sender={item.sender ?? ""}
            message={item.message}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 3,

    paddingHorizontal: 2,
  },
});
