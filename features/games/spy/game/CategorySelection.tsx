import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import LobbyOverlay from "../lobby/layout/LobbyOverlay";

type CategoryVote = {
  userId: Id<"users">;
  categoryId: string;
  avatar?: string;
};

type CategorySelectionProps = {
  visible: boolean;

  roomId: Id<"gameRooms">;

  categories: string[];

  selectedCategory?: string;

  endsAt?: number;

  isHost: boolean;

  hasVoted: boolean;

  onVote: (
    category: string
  ) => void;

  onFinalize?: () => void;
};


export default function CategorySelection({
  visible,
  roomId,
  categories,
  selectedCategory,
  endsAt,
  isHost,
  hasVoted,
  onVote,
  onFinalize,
}: CategorySelectionProps) {

    const finalizeCategorySelection =
  useMutation(
    api.games.spy.classic.categorySelection
      .finalizeCategorySelection
  );

  /* =========================
     👥 CATEGORY VOTES
  ========================= */

const categoryVotes =
  useQuery(
    api.games.spy.classic.categorySelection
      .getCategoryVotes,
    {
      roomId,
    }
  );

  const [remaining, setRemaining] =
  useState<number | null>(null);

/* =========================
   ⏱️ TIMER
========================= */

useEffect(() => {
  if (!endsAt) {
    setRemaining(null);
    return;
  }

  const update = () => {
    const seconds = Math.max(
      0,
      Math.ceil(
        (endsAt - Date.now()) / 1000
      )
    );

    setRemaining(seconds);
  };

  update();

  const interval =
    setInterval(update, 250);

  return () => {
    clearInterval(interval);
  };
}, [endsAt]);



  useEffect(() => {
 if (
  !visible ||
  !endsAt ||
  remaining === null ||
  remaining > 0 ||
  selectedCategory
) {
  return;
}

  let cancelled = false;

  const finalize = async () => {
    try {
      await finalizeCategorySelection({
        roomId,
      });
    } catch (error) {
      if (!cancelled) {
        console.error(
          "AUTO FINALIZE CATEGORY ERROR:",
          error
        );
      }
    }
  };

  finalize();

  return () => {
    cancelled = true;
  };
}, [
  visible,
  endsAt,
  remaining,
  selectedCategory,
  finalizeCategorySelection,
  roomId,
]);

  /* =========================
     🎲 CATEGORIES
  ========================= */

  const visibleCategories =
    useMemo(
      () =>
        categories.slice(
          0,
          8
        ),
      [categories]
    );

  /* =========================
     👥 VOTERS BY CATEGORY
  ========================= */

  const votersByCategory =
    useMemo(() => {
      const map =
        new Map<
          string,
          CategoryVote[]
        >();

      for (
        const vote of
          categoryVotes ?? []
      ) {
        const existing =
          map.get(
            vote.categoryId
          ) ?? [];

        existing.push(
          vote
        );

        map.set(
          vote.categoryId,
          existing
        );
      }

      return map;
    }, [categoryVotes]);

  /* =========================
     🎨 TITLE
  ========================= */

const title =
  remaining === null ||
  remaining > 0
    ? "CHOOSE A CATEGORY"
    : "CATEGORY SELECTED";

  if (!visible) {
    return null;
  }

  return (
    <LobbyOverlay
      visible={visible}
    >
      <View
        style={
          styles.overlayContent
        }
        pointerEvents="box-none"
      >
        {/* =========================
            BOARD
        ========================= */}

        <View
          style={
            styles.boardWrapper
          }
        >
          <Image
            source={require(
              "@/assets/images/games/spy/boards/categoryboard.png"
            )}
            contentFit="contain"
            style={styles.board}
          />

      {/* =========================
    BOARD CONTENT
========================= */}

<View style={styles.boardContent}>

  {/* TITLE + TIMER */}
  <View style={styles.titleRow}>

    <Text style={styles.title}>
      {title}
    </Text>

{remaining !== null && remaining > 0 && (
      <View style={styles.timer}>
        <Text style={styles.timerText}>
          {remaining}s
        </Text>
      </View>
    )}

  </View>

  {/* GOLD UNDERLINE */}
  <View style={styles.goldLine} />
            {/* =========================
                8 CATEGORIES
                2 COLUMNS × 4 ROWS
            ========================= */}

            <View
              style={
                styles.categories
              }
            >
              {visibleCategories.map(
                (
                  category
                ) => {
                  const active =
                    selectedCategory ===
                    category;

                  const voters =
                    votersByCategory.get(
                      category
                    ) ?? [];

            const disabled =
  hasVoted ||
  remaining === null ||
  remaining <= 0;

                  return (
                    <Pressable
                      key={
                        category
                      }
                      disabled={
                        disabled
                      }
                      onPress={() =>
                        onVote(
                          category
                        )
                      }
                      style={[
                        styles.categoryButton,

                        active &&
                          styles.categoryButtonActive,

                        disabled &&
                          styles.categoryDisabled,
                      ]}
                    >
                      {/* =========================
                          CATEGORY TEXT
                      ========================= */}

                      <Text
                        numberOfLines={
                          1
                        }
                        adjustsFontSizeToFit
                        minimumFontScale={
                          0.7
                        }
                        style={[
                          styles.categoryText,

                          active &&
                            styles.categoryTextActive,
                        ]}
                      >
                        {
                          category
                        }
                      </Text>

                      {/* =========================
                          VOTER AVATARS
                      ========================= */}

                      {voters.length >
                        0 && (
                        <View
                          style={
                            styles.voterStack
                          }
                        >
                          {voters
                            .slice(
                              0,
                              4
                            )
                            .map(
                              (
                                voter,
                                index
                              ) => (
                                <View
                                  key={
                                    voter.userId.toString()
                                  }
                                  style={[
                                    styles.voterAvatarWrapper,
                                    {
                                      marginLeft:
                                        index ===
                                        0
                                          ? 0
                                          : -6,

                                      zIndex:
                                        voters.length -
                                        index,
                                    },
                                  ]}
                                >
                                  {voter.avatar ? (
                                    <Image
                                      source={{
                                        uri: voter.avatar,
                                      }}
                                      contentFit="cover"
                                      style={
                                        styles.voterAvatar
                                      }
                                    />
                                  ) : (
                                    <View
                                      style={
                                        styles.avatarFallback
                                      }
                                    />
                                  )}
                                </View>
                              )
                            )}

                          {voters.length >
                            4 && (
                            <View
                              style={[
                                styles.moreVotes,
                                {
                                  marginLeft:
                                    -6,
                                },
                              ]}
                            >
                              <Text
                                style={
                                  styles.moreVotesText
                                }
                              >
                                +
                                {voters.length -
                                  4}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                }
              )}
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
       OVERLAY CONTENT
    ========================= */

    overlayContent: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal: 8,
    },

    /* =========================
       BOARD
    ========================= */

    boardWrapper: {
      width: "120%",

      maxWidth: 624,

      aspectRatio: 1.55,

      justifyContent: "center",

      alignItems: "center",

      // Move the whole illustrator slightly down
      transform: [
        {
          translateY: 12,
        },
      ],
    },

    board: {
      position: "absolute",

      width: "100%",

      height: "100%",
    },

    /* =========================
       BOARD CONTENT
    ========================= */

    boardContent: {
      /*
       * Narrower so the categories
       * sit comfortably inside
       * the illustrator.
       */
      width: "60%",

      height: "66%",

      alignItems: "center",

      justifyContent: "center",

      /*
       * Push title/categories away
       * from the character at the top.
       */
      paddingTop: 40,
    },


    /* =========================
   TITLE ROW
========================= */

titleRow: {
  width: "100%",

  flexDirection: "row",

  alignItems: "center",

  justifyContent: "center",

  position: "relative",
},

/* =========================
   TITLE
========================= */

title: {
  color: "#6e6e6e",

  fontSize: 14,

  fontWeight: "900",

  letterSpacing: 0.8,

  textAlign: "center",

  marginTop: 16,
},

/* =========================
   TIMER
========================= */

timer: {
  position: "absolute",

  right: 0,

  top: 16,

  paddingHorizontal: 7,

  paddingVertical: 2,

  borderRadius: 10,

  backgroundColor:
    "rgba(255,184,0,0.12)",

  borderWidth: 1,

  borderColor:
    "rgba(255,184,0,0.45)",
},

timerText: {
  color: "#FFB800",

  fontSize: 9,

  fontWeight: "800",
},

/* =========================
   GOLD LINE
========================= */

goldLine: {
  width: 46,

  height: 2,

  borderRadius: 2,

  backgroundColor: "#FFB800",

  marginVertical: 3,
},

    /* =========================
       CATEGORIES
    ========================= */

categories: {
  width: "100%",

  flexDirection: "row",

  flexWrap: "wrap",

  justifyContent: "space-between",

  columnGap: 2,

  rowGap: 4.8,

  overflow: "visible",
  marginTop:4,
},

categoryButton: {
  width: "47%",

  height: 31,

  borderRadius: 5,

  paddingHorizontal: 6,

  flexDirection: "row",

  alignItems: "center",

  justifyContent: "center",

  backgroundColor:
    "rgba(12,12,12,0.48)",

  borderWidth: 1,

  borderColor:
    "rgba(210,166,42,0.30)",

  /*
   * Subtle inner-looking edge.
   */
  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 1,
  },

  shadowOpacity: 0.65,

  shadowRadius: 2,

  elevation: 1,

  overflow: "visible",

  zIndex: 1,
},

  categoryButtonActive: {
  backgroundColor:
    "rgba(210,166,42,0.10)",

  borderColor:
    "rgba(210,166,42,0.75)",

  shadowColor:
    "#D2A62A",

  shadowOpacity: 0.18,

  shadowRadius: 3,

  elevation: 2,
},

    categoryDisabled: {
      opacity: 0.48,
    },

    /* =========================
       CATEGORY TEXT
    ========================= */

 categoryText: {
  flex: 1,

  color: "#D8D8D8",

  fontSize: 8,

  fontWeight: "500",

  textTransform: "uppercase",

  letterSpacing: 0.1,

  textAlign: "center",

  marginRight: 0,
},

  categoryTextActive: {
  color: "#D2A62A",

  fontWeight: "600",
},

    /* =========================
       VOTER PFP
    ========================= */

voterStack: {
  flexShrink: 0,

  flexDirection: "row",

  alignItems: "center",

  justifyContent: "flex-end",

  maxWidth: 50,

  overflow: "visible",
},

voterAvatarWrapper: {
  width: 20,

  height: 20,

  borderRadius: 10,

  padding: 1,

  backgroundColor: "#0A0A0A",

  borderWidth: 1,

  borderColor:
    "rgba(210,166,42,0.72)",

  /*
   * Allows the avatar to slightly
   * sit outside the category button.
   */
  transform: [
    {
      translateX: 2,
    },
  ],

  zIndex: 10,
},

voterAvatar: {
  width: "100%",

  height: "100%",

  borderRadius: 9,
},

avatarFallback: {
  width: "100%",

  height: "100%",

  borderRadius: 9,

  backgroundColor: "#242424",
},

moreVotes: {
  width: 20,

  height: 20,

  borderRadius: 10,

  justifyContent: "center",

  alignItems: "center",

  backgroundColor: "#171717",

  borderWidth: 1,

  borderColor:
    "rgba(210,166,42,0.55)",
},

moreVotesText: {
  color: "#D2A62A",

  fontSize: 7,

  fontWeight: "900",
},
    /* =========================
       START ROUND
    ========================= */

    finalizeButton: {
      marginTop: 6,

      paddingHorizontal: 17,

      paddingVertical: 5,

      borderRadius: 14,

      backgroundColor:
        "#D2A62A",
    },

    finalizeText: {
      color: "#090909",

      fontSize: 9,

      fontWeight: "900",

      letterSpacing: 0.6,
    },
  });