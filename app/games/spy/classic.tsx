import React from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useLocalSearchParams,
} from "expo-router";

import {
  Id,
} from "@/convex/_generated/dataModel";

import {
  useMutation,
} from "convex/react";

import {
  api,
} from "@/convex/_generated/api";

import CategorySelection from "@/features/games/spy/game/CategorySelection";

import {
  useClassicGame,
} from "@/features/games/spy/hooks/useClassicGame";

export default function ClassicGameScreen() {
  const params =
    useLocalSearchParams<{
      roomId?: string;
    }>();

  /*
   * =========================
   * ROOM ID
   * =========================
   */

  const validRoomId =
    params.roomId
      ? (params.roomId as Id<"gameRooms">)
      : undefined;

  /*
   * =========================
   * BACKEND MUTATIONS
   * =========================
   */

  const castCategoryVote =
    useMutation(
      api.games.spy.classic.categorySelection
        .castCategoryVote
    );

  const finalizeCategorySelection =
    useMutation(
      api.games.spy.classic.categorySelection
        .finalizeCategorySelection
    );

  /*
   * =========================
   * CLASSIC GAME STATE
   * =========================
   *
   * Keep this hook for the rest of
   * the Classic game flow.
   */

  const {
    state,
  } = useClassicGame({
    roomId:
      params.roomId ?? "",

    currentUserId:
      "",

    isHost:
      false,

    categoryOptions: [],

    selectedCategory:
      undefined,

    categorySelectionEndsAt:
      undefined,

    hasVotedCategory:
      false,

    categoryVotes: {},

    onCategoryVote:
      async () => {},

    onFinalizeCategory:
      async () => {},
  });

  /*
   * =========================
   * CATEGORY SELECTION
   * =========================
   *
   * IMPORTANT:
   * This screen should receive the actual
   * Convex room state here.
   *
   * For now we safely render only when
   * a valid room ID exists.
   */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View
        style={styles.game}
      >
        {validRoomId && (
          <CategorySelection
            visible={true}

            roomId={
              validRoomId
            }

            categories={[
              "Movies",
              "Animals",
              "Sports",
              "Technology",
              "Entertainment",
              "Nature",
              "Food",
              "Everyday",
            ]}

            selectedCategory={
              undefined
            }

            endsAt={
              undefined
            }

            isHost={
              false
            }

            hasVoted={
              false
            }

            onVote={async (
              category
            ) => {
            try {
  await castCategoryVote({
    roomId:
      validRoomId,

    categoryId:
      category,
  });
} catch (
  error
) {
  console.error(
    "CATEGORY VOTE ERROR:",
    error
  );
}
            }}

            onFinalize={async () => {
              try {
                await finalizeCategorySelection({
                  roomId:
                    validRoomId,
                });
              } catch (
                error
              ) {
                console.error(
                  "FINALIZE CATEGORY ERROR:",
                  error
                );
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        "#000000",
    },

    game: {
      flex: 1,

      backgroundColor:
        "#000000",
    },
  });