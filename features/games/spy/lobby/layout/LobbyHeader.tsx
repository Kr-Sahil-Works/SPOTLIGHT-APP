import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LeaveRoomDialog from "../dialogs/LeaveRoomDialog";
import FloatingWordCard from "./FloatingWordCard";
import LobbyMenu from "./LobbyMenu";
import LobbyOverlay from "./LobbyOverlay";
import VotingTimer from "./VotingTimer";

type Props = {
  onSettings?: () => void;
  onRules?: () => void;
  onVolume?: () => void;
  onExit?: () => void;

  votingStarted?: boolean;
votingRemaining?: number | null;

  word?: string;
roomCode?: string;

isHost?: boolean;

  gameStarted?: boolean;
};
export default function LobbyHeader({
  onSettings,
  onRules,
  onVolume,
  onExit,
  word,
roomCode,
isHost = false,
gameStarted = false,
votingStarted = false,
votingRemaining = null,
}: Props) {
  const insets =
    useSafeAreaInsets();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    leaveDialogVisible,
    setLeaveDialogVisible,
  ] = useState(false);

  /* =========================
     ☰ MENU
  ========================= */

  const handleMenu = () => {
    setMenuOpen(
      (previous) => !previous
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSettings = () => {
    closeMenu();
    onSettings?.();
  };

  const handleRules = () => {
    closeMenu();
    onRules?.();
  };

  const handleVolume = () => {
    closeMenu();
    onVolume?.();
  };

  /* =========================
     🚪 EXIT
  ========================= */

  const handleExit = () => {
    closeMenu();
    setLeaveDialogVisible(true);
  };

  const handleStay = () => {
    setLeaveDialogVisible(false);
  };

  const handleLeave = () => {
    setLeaveDialogVisible(false);
    onExit?.();
  };

  return (
    <>
      {/* =========================
          HEADER
      ========================= */}

      <View
        style={[
          styles.container,
          {
            paddingTop:
              insets.top + 6,
          },
        ]}
      >

        <VotingTimer
  visible={votingStarted}
  remaining={votingRemaining}
/>
        {/* =========================
            📹 CCTV / MENU
        ========================= */}

        <Pressable
          onPress={handleMenu}
          hitSlop={8}
          style={({
            pressed,
          }) => [
            styles.button,

            menuOpen &&
              styles.buttonActive,

            pressed &&
              styles.pressed,
          ]}
        >
          <Image
            source={require(
              "@/assets/images/games/spy/icons/cctv_lobby.webp"
            )}
            style={styles.cctvIcon}
            contentFit="contain"
            pointerEvents="none"
          />
        </Pressable>

        {/* =========================
            📝 FLOATING WORD / WAITING
        ========================= */}

        {!gameStarted ? (
<FloatingWordCard
  title={
    roomCode
      ? `Room Code : ${roomCode}`
      : "WAITING ROOM"
  }
  subtitle={
    isHost
      ? "Start when all players ready"
      : "Host will start the game"
  }
/>
        ) : (
          !!word && (
            <FloatingWordCard
              word={word}
            />
          )
        )}
      </View>

      {/* =========================
          ☰ MENU OVERLAY
      ========================= */}

      <LobbyOverlay
        visible={menuOpen}
        onClose={closeMenu}
      >
        <View
          style={
            styles.menuPosition
          }
        >
          <LobbyMenu
            onSettings={
              handleSettings
            }
            onRules={
              handleRules
            }
            onVolume={
              handleVolume
            }
            onExit={
              handleExit
            }
          />
        </View>
      </LobbyOverlay>

      {/* =========================
          🚪 LEAVE ROOM
      ========================= */}

      <LeaveRoomDialog
        visible={
          leaveDialogVisible
        }
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </>
  );
}

const styles =
  StyleSheet.create({
    container: {
      height: 112,

      marginTop: 4,

      paddingHorizontal: 12,

      position: "relative",

      zIndex: 100,
    },

    /* =========================
       CCTV BUTTON
    ========================= */

    button: {
      width: 34,

      height: 34,

      borderRadius: 10,

      
  marginTop: 16, 
  marginLeft:2,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#0a090914",

      borderWidth: 1,

      borderColor:
        "rgba(242,169,0,0.28)",
    },

    buttonActive: {
      backgroundColor:
        "rgba(242, 0, 0, 0.32)",

      borderColor:
        "rgba(242,169,0,0.28)",
    },

    cctvIcon: {
      width: 44,

      height: 44,
    },

    /* =========================
       MENU POSITION
    ========================= */

    menuPosition: {
      position: "absolute",

      top: 10,

      left: 10,
    },

    /* =========================
       PRESS
    ========================= */

    pressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.92,
        },
      ],
    },
  });