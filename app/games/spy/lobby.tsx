import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import LobbyBottomBar from "@/features/games/spy/lobby/layout/LobbyBottomBar";
import LobbyChat from "@/features/games/spy/lobby/layout/LobbyChat";
import LobbyHeader from "@/features/games/spy/lobby/layout/LobbyHeader";
import LobbyInfoPanel from "@/features/games/spy/lobby/layout/LobbyInfoPanel";
import LobbyPlayersSection from "@/features/games/spy/lobby/layout/LobbyPlayersSection";

import LobbyChatInput from "@/features/games/spy/lobby/chat/LobbyChatInput";
import LobbyBackground from "@/features/games/spy/lobby/layout/LobbyBackground";
import { LobbyChatMessage } from "@/features/games/spy/types/chat";
import { LobbyPlayer } from "@/features/games/spy/types/player";

const MOCK_PLAYERS: LobbyPlayer[] = [
  {
    id: "1",
    userId: "1",
    name: "nobita",
    avatar: "https://i.pravatar.cc/300?img=1",
    isHost: true,
    isReady: true,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "2",
    userId: "2",
    name: "Leo",
    avatar: "https://i.pravatar.cc/300?img=6",
    isHost: false,
    isReady: false,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "3",
    userId: "3",
    name: "Riya",
    avatar: "https://i.pravatar.cc/300?img=7",
    isHost: false,
    isReady: true,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "4",
    userId: "4",
    name: "Suraj",
    avatar: "https://i.pravatar.cc/300?img=8",
    isHost: false,
    isReady: false,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "5",
    userId: "5",
    name: "Shizu",
    avatar: "https://i.pravatar.cc/300?img=9",
    isHost: false,
    isReady: true,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "6",
    userId: "6",
    name: "Sam",
    avatar: "https://i.pravatar.cc/300?img=10",
    isHost: false,
    isReady: false,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "7",
    userId: "7",
    name: "Priyanshu",
    avatar: "https://i.pravatar.cc/300?img=11",
    isHost: false,
    isReady: true,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
  {
    id: "8",
    userId: "8",
    name: "piku",
    avatar: "https://i.pravatar.cc/300?img=12",
    isHost: false,
    isReady: false,
    isConnected: true,
    isSpeaking: false,
    isAlive: true,
  },
];

const MOCK_MESSAGES: LobbyChatMessage[] = [
  {
    id: "1",
    type: "system",
    message: "Alex joined the room",
    createdAt: Date.now(),
  },
  {
    id: "2",
    type: "user",
    sender: "Silent Hero",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "3",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
  {
    id: "4",
    type: "user",
    sender: "Emma",
    message: "Alex joined the room",
    createdAt: Date.now(),
  },
  {
    id: "5",
    type: "user",
    sender: "PP the Tp",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "6",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
  {
    id: "7",
    type: "system",
    message: "Priya exited the room",
    createdAt: Date.now(),
  },
  {
    id: "8",
    type: "user",
    sender: "Silent Hero",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "9",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
];

/*
 * QUICK DEMO CONTROL
 *
 * 4 → 4 players
 * 5 → 5 players
 * 6 → 6 players
 * 7 → 7 players
 * 8 → 8 players
 */
const DEMO_PLAYER_COUNT: number = 8;

/*
 * false = lobby
 * true  = game started
 */
const DEMO_GAME_STARTED = true;

const DEMO_VOTING_STARTED = true;

const demoPlayers = MOCK_PLAYERS.slice(
  0,
  Math.min(
    Math.max(DEMO_PLAYER_COUNT, 4),
    8
  )
);

export default function LobbyScreen() {
  const { width, height } = useWindowDimensions();

  const [chatOpen, setChatOpen] = useState(false);

  const scale = Math.min(
    Math.max(width / 390, 0.84),
    1.08
  );

  /*
   * IMPORTANT:
   *
   * Player area is intentionally independent
   * of player count.
   *
   * The 8-player layout defines the reference
   * height. Fewer players only redistribute
   * the available vertical space internally.
   */
  const isShortScreen = height < 760;

  const playerAreaHeight = isShortScreen
    ? 345
    : 365;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right"]}
    >
      <LobbyBackground />

      {/* HEADER */}

      <View
        style={[
          styles.header,
          {
            height: 100 * scale,
          },
        ]}
      >
        <LobbyHeader
          onSettings={() => {}}
          onRules={() => {}}
          onVolume={() => {}}
          onExit={() => {}}
        />
      </View>

      {/* PLAYERS */}

      <View
        style={[
          styles.players,
          {
            height: playerAreaHeight,
            paddingHorizontal: Math.max(
              5,
              width * 0.012
            ),
          },
        ]}
      >
      <LobbyPlayersSection
  players={demoPlayers}
  votingStarted={DEMO_VOTING_STARTED}
/>
      </View>

      {/* WAITING INFO */}

      {!DEMO_GAME_STARTED && (
        <View
          style={[
            styles.info,
            {
              marginHorizontal: Math.max(
                8,
                width * 0.025
              ),
            },
          ]}
        >
          <LobbyInfoPanel
            currentPlayers={demoPlayers.length}
            maxPlayers={8}
            roomStatus="Waiting"
            isHost
            onInvite={() => {}}
            onReady={() => {}}
          />
        </View>
      )}

      {/* CHAT */}

      <View
        style={[
          styles.chat,
          {
            marginHorizontal: Math.max(
              10,
              width * 0.025
            ),
          },
        ]}
      >
        <LobbyChat
          messages={MOCK_MESSAGES}
          gameStarted={DEMO_GAME_STARTED}
        />

        {/* CHAT INPUT */}

        {chatOpen && (
          <KeyboardAvoidingView
            style={styles.chatComposer}
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : "height"
            }
          >
            <LobbyChatInput
              onSend={() => {
                setChatOpen(false);
              }}
            />
          </KeyboardAvoidingView>
        )}
      </View>

      {/* BOTTOM BAR */}

      <View style={styles.bottomBar}>
        <LobbyBottomBar
          onChat={() => {
            setChatOpen((previous) => !previous);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },

  header: {
    width: "100%",
    flexShrink: 0,
    zIndex: 30,
  },

  players: {
    flexShrink: 0,
    zIndex: 5,

    justifyContent: "center",
    alignItems: "stretch",
  },

  info: {
    minHeight: 0,
    flexShrink: 0,
    zIndex: 15,
  },

  chat: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
    zIndex: 4,
  },

  chatComposer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 6,

    zIndex: 90,

    paddingHorizontal: 12,
  },

  bottomBar: {
    width: "100%",
    height: 42,

    flexShrink: 0,

    zIndex: 100,
  },
});
