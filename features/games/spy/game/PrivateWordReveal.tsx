import React, {
  useEffect,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import LobbyOverlay from "../lobby/layout/LobbyOverlay";

type PrivateWordRevealProps = {
  visible: boolean;

  role?:
    | "spy"
    | "villager";

  word?: string;

  category?: string;

  onReady: () => void;
};

export default function PrivateWordReveal({
  visible,
  role,
  word,
  onReady,
}: PrivateWordRevealProps) {

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      onReady();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    visible,
    onReady,
  ]);

  if (!visible) {
    return null;
  }

  const isSpy =
    role === "spy";

  const boardSource = isSpy
    ? require(
        "@/assets/images/games/spy/boards/spyboard.png"
      )
    : require(
        "@/assets/images/games/spy/boards/villagersboard.png"
      );

  return (
    <LobbyOverlay
      visible={visible}
      contentStyle={
        styles.overlayContent
      }
    >
      <View style={styles.container}>

        {/* =========================
            BOARD
        ========================= */}

        <View
          style={
            isSpy
              ? styles.spyBoardWrapper
              : styles.villagerBoardWrapper
          }
        >
          <Image
            source={boardSource}
            contentFit="contain"
            style={styles.board}
          />

          {/* =========================
              BOARD CONTENT
          ========================= */}

          <View
            style={
              isSpy
                ? styles.spyBoardContent
                : styles.villagerBoardContent
            }
          >

            {/* =========================
                ROLE
            ========================= */}

            <Text
              style={
                isSpy
                  ? styles.spyRoleText
                  : styles.villagerRoleText
              }
            >
              {isSpy
                ? "SPY"
                : "VILLAGER"}
            </Text>

            {/* =========================
                WORD PLATE
            ========================= */}

            <View
              style={
                isSpy
                  ? styles.spyWordPlate
                  : styles.villagerWordPlate
              }
            >
              {/* diagonal highlight */}

              <View
                pointerEvents="none"
                style={
                  isSpy
                  ? styles.platespyHighlight
                  : styles.plateHighlight
                }
              />

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={
                  isSpy
                    ? styles.spyWordText
                    : styles.villagerWordText
                }
              >
                {word ?? "—"}
              </Text>
            </View>

          </View>
        </View>
      </View>
    </LobbyOverlay>
  );
}

const styles =
  StyleSheet.create({

    /* =========================
       OVERLAY
    ========================= */

    overlayContent: {
      zIndex: 1000,

      elevation: 1000,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    /* =========================
       CONTAINER
    ========================= */

    container: {
      width: "100%",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 14,

      zIndex: 1000,

      elevation: 1000,
    },

    /* =========================
       VILLAGER BOARD
       Larger illustrator
    ========================= */

    villagerBoardWrapper: {
      width: "96%",

      maxWidth: 430,

      aspectRatio: 1.18,

      position:
        "relative",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 1100,

      elevation: 1100,

      transform: [
        {
          translateY: 8,
        },
      ],
    },

    /* =========================
       SPY BOARD
       Smaller illustrator
    ========================= */

    spyBoardWrapper: {
      width: "84%",

      maxWidth: 370,

      aspectRatio: 1.18,

      position:
        "relative",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 1100,

      elevation: 1100,

    
    },

    /* =========================
       BOARD IMAGE
    ========================= */

    board: {
      position:
        "absolute",

      width: "100%",

      height: "100%",

      zIndex: 1100,

      elevation: 1100,
    },

    /* =========================
       VILLAGER CONTENT
    ========================= */

    villagerBoardContent: {
      position:
        "absolute",

      width: "58%",

      height: "42%",

      top: "42%",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 1200,

      elevation: 1200,
    },

    /* =========================
       SPY CONTENT
    ========================= */

    spyBoardContent: {
      position:
        "absolute",

      width: "56%",

      height: "36%",

      top: "44%",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 1200,

      elevation: 1200,
      
    },

    /* =========================
       SPY ROLE
    ========================= */

    spyRoleText: {
      color:
        "#c81818",

      fontSize: 10,

      fontWeight:
        "800",

      letterSpacing: 0.2,

      textAlign:
        "center",

      marginBottom: 8,
        transform: [
        {
          rotate: "-2deg",
        },
      ],
    },

    /* =========================
       VILLAGER ROLE
    ========================= */

    villagerRoleText: {
      color:
        "#D2A62A",

      fontSize: 10,

      fontWeight:
        "900",

      letterSpacing: 1.8,

      textAlign:
        "center",

      /*
       * More separation between
       * VILLAGER and word plate.
       */

      marginBottom: 11,
    },

    /* =========================
       SPY WORD PLATE
    ========================= */

spyWordPlate: {
  width: "82%",
  minHeight: 28,

  borderRadius: 8,

  alignItems: "center",
  justifyContent: "center",

  position: "relative",
  overflow: "hidden",

  backgroundColor: "#8F1717",

  borderWidth: 2,
  borderColor: "#D83A3A",

  transform: [
    {
      rotate: "-1.4deg",
    },
  ],

  elevation: 8,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.55,
  shadowRadius: 4,
},

    /* =========================
       VILLAGER WORD PLATE
       Narrower / attached look
    ========================= */

    villagerWordPlate: {
      width: "82%",

      minHeight: 48,

      borderRadius: 13,

      alignItems:
        "center",

      justifyContent:
        "center",

      position:
        "relative",

      overflow:
        "hidden",

      backgroundColor:
        "#D9A916",

      borderWidth: 2,

      borderColor:
        "#F7D34F",

      elevation: 8,

      shadowColor:
        "#000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity:
        0.5,

      shadowRadius:
        4,
    },

    /* =========================
       DIAGONAL GOLD HIGHLIGHT
    ========================= */

    plateHighlight: {
      position:
        "absolute",

      width: "35%",

      height: "180%",

      left: "27%",

      top: "-40%",

      backgroundColor:
        "rgba(255,255,255,0.16)",

      transform: [
        {
          rotate: "28deg",
        },
      ],

      zIndex: 1,
    },


    platespyHighlight: {
  position: "absolute",

  width: "32%",
  height: "180%",

  left: "28%",
  top: "-40%",

  backgroundColor:
    "rgba(255,90,90,0.12)",

  transform: [
    {
      rotate: "24deg",
    },
  ],

  zIndex: 1,
},
    /* =========================
       SPY WORD
    ========================= */

spyWordText: {
  color: "#f1ce40",

  fontSize: 24,
  lineHeight: 32,

  fontWeight: "900",

  letterSpacing: 0.1,

  textAlign: "center",

  width: "88%",

  zIndex: 2,

  transform: [
    {
      rotate: "-0.4deg",
    }
  ],

  textShadowColor:
    "rgba(0,0,0,0.55)",

  textShadowOffset: {
    width: 0,
    height: 1,
  },

  textShadowRadius: 2,
},

    /* =========================
       VILLAGER WORD
    ========================= */

    villagerWordText: {
      color:
        "#6B4300",

      fontSize: 22,

      lineHeight: 27,

      fontWeight:
        "900",

      letterSpacing: 0,

      textAlign:
        "center",

      width: "84%",

      zIndex: 2,

      textShadowColor:
        "rgba(255,224,102,0.45)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 1,
    },
  });