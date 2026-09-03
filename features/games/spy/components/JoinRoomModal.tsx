import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import LobbyOverlay from "@/features/games/spy/lobby/layout/LobbyOverlay";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

import pincodeboard from "@/assets/images/games/spy/boards/round_intro.png";

import PinDots from "@/shared/components/ui/PinDots";
import PinKeypad from "@/shared/components/ui/PinKeypad";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function JoinRoomModal({
  visible,
  onClose,
}: Props) {
  const router = useRouter();

  const { width, height } =
    useWindowDimensions();

  const [pin, setPin] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const errorTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const joinRoom =
    useMutation(
      api.games.spy.rooms.joinRoom
    );

  /* =========================
     ERROR
  ========================= */

  const showError = (
    message: string
  ) => {
    setErrorMessage(message);

    if (errorTimeoutRef.current) {
      clearTimeout(
        errorTimeoutRef.current
      );
    }

    errorTimeoutRef.current =
      setTimeout(() => {
        setErrorMessage(null);
        errorTimeoutRef.current = null;
      }, 6000);
  };

  /* =========================
     JOIN ROOM
  ========================= */

  const joinRoomByCode = async (
    roomCode: string
  ) => {
    try {
      setErrorMessage(null);

      const result =
        await joinRoom({
          roomCode,
        });

      /* =========================
         EXPECTED FAILURE
      ========================= */

      if (!result.success) {
        switch (result.reason) {
          case "INVALID_ROOM_CODE":
            showError(
              "Enter a valid 4-digit room code."
            );
            break;

          case "ROOM_NOT_FOUND":
            showError(
              "Room not found. Check the 4-digit code."
            );
            break;

          case "ROOM_FULL":
            showError(
              "This room is full."
            );
            break;

          case "ROOM_NOT_JOINABLE":
            showError(
              "This game has already started."
            );
            break;

          default:
            showError(
              "Unable to join room. Please try again."
            );
        }

        setPin("");
        setSuccess(false);

        return;
      }

      /* =========================
         SUCCESS
      ========================= */

      setPin("");
      setSuccess(false);

      onClose();

      router.push({
        pathname:
          "/games/spy/lobby",

        params: {
          roomId:
            result.roomId,
        },
      });
    } catch (error) {
      console.error(
        "JOIN ROOM ERROR:",
        error
      );

      /*
       * Server-side lock currently
       * arrives as an exception.
       *
       * Detect it here without
       * crashing the modal.
       */

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      if (
        message.includes(
          "Too many failed attempts"
        ) ||
        message.includes(
          "locked for 15 minutes"
        )
      ) {
        showError(
          "Too many attempts. Try again in 15 minutes."
        );
      } else {
        showError(
          "Something went wrong. Please try again."
        );
      }

      setPin("");
      setSuccess(false);
    }
  };

  /* =========================
     NUMBER INPUT
  ========================= */

  const handleNumber = (
    digit: string
  ) => {
    setErrorMessage(null);

    if (errorTimeoutRef.current) {
      clearTimeout(
        errorTimeoutRef.current
      );

      errorTimeoutRef.current = null;
    }

    if (pin.length >= 4) {
      return;
    }

    const nextPin =
      pin + digit;

    setPin(nextPin);

    if (
      nextPin.length === 4
    ) {
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 140);

      void joinRoomByCode(
        nextPin
      );
    }
  };

  /* =========================
     BACKSPACE
  ========================= */

  const handleBackspace = () => {
    setErrorMessage(null);

    setPin((prev) =>
      prev.slice(0, -1)
    );
  };

  /* =========================
     BOARD ANIMATION
  ========================= */

  const boardOpacity =
    useSharedValue(0);

  const boardScale =
    useSharedValue(0.94);

  const keypadOpacity =
    useSharedValue(0);

  const keypadTranslateY =
    useSharedValue(20);

  useEffect(() => {
    if (visible) {
      boardOpacity.value =
        withTiming(1, {
          duration: 220,
        });

      boardScale.value =
        withTiming(1, {
          duration: 280,
          easing:
            Easing.out(
              Easing.cubic
            ),
        });

      keypadOpacity.value =
        withTiming(1, {
          duration: 220,
        });

      keypadTranslateY.value =
        withTiming(0, {
          duration: 260,
          easing:
            Easing.out(
              Easing.cubic
            ),
        });
    } else {
      boardOpacity.value = 0;
      boardScale.value = 0.94;

      keypadOpacity.value = 0;
      keypadTranslateY.value = 20;
    }
  }, [visible]);

  const boardAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity:
        boardOpacity.value,

      transform: [
        {
          scale:
            boardScale.value,
        },
      ],
    }));

  const keypadAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity:
        keypadOpacity.value,

      transform: [
        {
          translateY:
            keypadTranslateY.value,
        },
      ],
    }));

  /* =========================
     CLOSE
  ========================= */

  const closeModal = () => {
    if (
      errorTimeoutRef.current
    ) {
      clearTimeout(
        errorTimeoutRef.current
      );

      errorTimeoutRef.current =
        null;
    }

    setErrorMessage(null);

    boardOpacity.value =
      withTiming(0, {
        duration: 120,
      });

    boardScale.value =
      withTiming(0.96, {
        duration: 120,
      });

    keypadOpacity.value =
      withTiming(0, {
        duration: 100,
      });

    keypadTranslateY.value =
      withTiming(15, {
        duration: 100,
      });

    setTimeout(() => {
      setPin("");
      setSuccess(false);
      onClose();
    }, 130);
  };

  /* =========================
     BOARD SIZE
  ========================= */

  const boardWidth = Math.min(
    width * 0.94,
    430
  );

  const boardHeight =
    boardWidth / 1.5;

  /*
   * On short phones move the
   * board slightly upward.
   */

  const boardTop =
    height < 760
      ? 95
      : 110;

  return (
    <LobbyOverlay
      visible={visible}
      onClose={closeModal}
    >
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "left",
          "right",
          "bottom",
        ]}
      >
        {/* =========================
            BOARD
        ========================= */}

        <Animated.View
          style={[
            styles.boardContainer,
            {
              width:
                boardWidth,

              height:
                boardHeight,

              top:
                boardTop,
            },
            boardAnimatedStyle,
          ]}
        >
          <Image
            source={pincodeboard}
            style={styles.board}
            contentFit="contain"
          />

          {/* =====================
              BOARD CONTENT
          ===================== */}

          <View
            pointerEvents="none"
            style={styles.boardContent}
          >
            <Text
              style={styles.boardLabel}
            >
              ROOM PIN
            </Text>

            <View
              style={styles.pinArea}
            >
              <PinDots
                length={pin.length}
                success={success}
              />
            </View>

            {errorMessage && (
              <View
                style={
                  styles.errorContainer
                }
              >
                <Text
                  style={
                    styles.errorText
                  }
                >
                  {errorMessage}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* =========================
            KEYPAD
        ========================= */}

        <Animated.View
          style={[
            styles.keypadContainer,
            keypadAnimatedStyle,
          ]}
        >
          <PinKeypad
            onNumberPress={
              handleNumber
            }
            onBackspace={
              handleBackspace
            }
            onClose={
              closeModal
            }
          />
        </Animated.View>
      </SafeAreaView>
    </LobbyOverlay>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      width: "100%",

      alignItems:
        "center",

      justifyContent:
        "flex-end",
    },

    /* =========================
       BOARD
    ========================= */

    boardContainer: {
      position:
        "absolute",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 10,
    },

    board: {
      width: "100%",

      height: "100%",
    },

    /* =========================
       BOARD CONTENT
    ========================= */

    boardContent: {
      position:
        "absolute",

      left: "12%",

      right: "12%",

      top: "44%",

      bottom: "12%",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    boardLabel: {
      color:
        "rgba(242, 242, 242, 0.55)",

      fontSize: 10,

      fontWeight: "800",

      letterSpacing: 2.4,

      marginBottom: 2,
    },

    pinArea: {
      minHeight: 42,

      alignItems:
        "center",

      justifyContent:
        "center",

      width: "100%",
    },

    /* =========================
       ERROR
    ========================= */

    errorContainer: {
      position:
        "absolute",

      bottom: -2,

      left: 10,

      right: 10,

      alignItems:
        "center",
    },

    errorText: {
      color:
        "#D2A62A",

      fontSize: 10,

      fontWeight: "700",

      textAlign:
        "center",

      letterSpacing:
        0.2,
    },

    /* =========================
       KEYPAD
    ========================= */

    keypadContainer: {
      width: "100%",

      zIndex: 20,

      marginTop:
        "auto",
    },
  });