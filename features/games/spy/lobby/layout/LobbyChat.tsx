import { StyleSheet, View } from "react-native";

import { LobbyChatMessage } from "../../types/chat";

import LobbyChatList from "../chat/LobbyChatList";
import TypingIndicator from "../chat/TypingIndicator";

type Props = {
  messages: LobbyChatMessage[];
  gameStarted?: boolean;
};

export default function LobbyChat({
  messages,
  gameStarted = false,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        gameStarted && styles.gameStarted,
      ]}
    >
      <View style={styles.listArea}>
        <LobbyChatList
          messages={messages}
        />

        <TypingIndicator
          visible={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,

    marginHorizontal: 2,
    marginTop: 4,
    paddingBottom: 8,

    borderRadius: 14,

    overflow: "hidden",

    backgroundColor:
      "rgba(7,7,11,0.68)",

    borderWidth: 0.8,

    borderColor:
      "rgba(255,255,255,0.055)",
  },

  gameStarted: {
    marginTop: 3,
    marginBottom: 3,

    backgroundColor:
      "rgba(7,7,11,0.62)",

    borderColor:
      "rgba(242,169,0,0.08)",
  },

  listArea: {
    flex: 1,
    minHeight: 0,
  },
});
