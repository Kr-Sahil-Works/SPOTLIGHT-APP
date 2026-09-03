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
      {/* =========================
          SUBTLE DARK GLASS
      ========================= */}

      <View
        pointerEvents="none"
        style={styles.glass}
      />

      {/* =========================
          VERY SUBTLE TOP SHEEN
      ========================= */}

      <View
        pointerEvents="none"
        style={styles.sheen}
      />

      {/* =========================
          CHAT CONTENT
      ========================= */}

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

    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,

    paddingBottom: 5,

    /*
     * Softer shape so it feels like
     * an integrated section of the UI.
     */
    borderRadius: 12,

    overflow: "hidden",

    /*
     * Mostly transparent.
     * The background artwork remains visible.
     */
    backgroundColor:
      "rgba(3,3,4,0.58)",

    /*
     * Extremely subtle edge.
     */
    borderWidth: 1,

    borderColor:
      "rgba(242,169,0,0.12)",

    /*
     * No floating-card shadow.
     */
    shadowOpacity: 0,

    elevation: 0,
  },

  /*
   * Transparent dark glass layer.
   */
  glass: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      "rgba(0,0,0,0.14)",

    zIndex: 1,
  },

  /*
   * Almost invisible glossy highlight.
   */
  sheen: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: "14%",

    backgroundColor:
      "rgba(255,255,255,0.018)",

    borderBottomWidth: 1,

    borderBottomColor:
      "rgba(242,169,0,0.035)",

    zIndex: 2,
  },

  /*
   * Messages remain sharp.
   */
  listArea: {
    flex: 1,
    minHeight: 0,

    paddingTop: 3,
    paddingHorizontal: 5,

    zIndex: 3,
  },

  gameStarted: {
    marginTop: 0,
    marginBottom: 0,

    backgroundColor:
      "rgba(3,3,4,0.52)",

    borderColor:
      "rgba(242,169,0,0.09)",
  },
});