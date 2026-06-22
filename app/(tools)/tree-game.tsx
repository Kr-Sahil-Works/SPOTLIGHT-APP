import { api } from "@/convex/_generated/api";
import useNetwork from "@/hooks/useNetwork";

import { useMutation, useQuery } from "convex/react";

import {
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "expo-router";


import { Ionicons } from "@expo/vector-icons";

import FallingLeaf from "@/components/game/FallingLeaf";
import GameOverModal from "@/components/game/GameOverModal";

const BG =
  require("@/assets/games/tree/bg.webp");

  const BASKET =
  require(
    "@/assets/games/tree/basket.webp"
  );

const SCREEN =
  Dimensions.get("window");

const GAME_TIME = 60;

const START_LIVES = 3;

console.log(
  "START_LIVES",
  START_LIVES
);

export default function TreeGame() {
  const router =
    useRouter();

  const isOnline =
    useNetwork();

  const submitScore =
    useMutation(
      api.treeGame
        .submitScore
    );

  const topScores =
    useQuery(
      api.treeGame
        .getTopScores
    );

  const bestScore =
    useQuery(
      api.treeGame
        .getMyBestScore
    );

    useEffect(() => {

  if (
    bestScore
  ) {

    setLocalBestScore(
      bestScore
    );

  }

}, [bestScore]);

  const [score,
    setScore] =
    useState(0);

    const [
  localBestScore,
  setLocalBestScore,
] = useState(0);

  const [lives,
    setLives] =
    useState(
      START_LIVES
    );

    useEffect(() => {
  console.log(
    "Lives:",
    lives
  );
}, [lives]);

  const [timeLeft,
    setTimeLeft] =
    useState(
      GAME_TIME
    );

  const [gameOver,
    setGameOver] =
    useState(false);

  const [paused,
    setPaused] =
    useState(false);

  const [basketX,
    setBasketX] =
    useState(
      SCREEN.width / 2 - 90
    );

    const basketWidth =
  150;

const panResponder =
  useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder:
        () => true,

      onPanResponderMove:
        (_, gesture) => {

          let nextX =
            gesture.moveX -
            basketWidth / 2;

          nextX =
            Math.max(
              0,
              Math.min(
                SCREEN.width -
                  basketWidth,
                nextX
              )
            );

      requestAnimationFrame(
  () => {
    setBasketX(
      nextX
    );
  }
);
        },
    })
  ).current;

const [leafs,
  setLeafs] =
  useState<
    {
      id: number;
      x: number;
      isGolden: boolean;
    }[]
  >([]);

  const spawnRef =
    useRef<any>(null);

  const timerRef =
    useRef<any>(null);

  /* ======================
      START GAME
  ====================== */

const startGame =
  () => {

    clearInterval(
      spawnRef.current
    );

    clearInterval(
      timerRef.current
    );

    setLeafs([]);

    setPaused(false);

    setGameOver(false);

    setScore(0);

    setLives(
      START_LIVES
    );

    setBasketX(
      SCREEN.width / 2 - 90
    );

    setTimeLeft(
      GAME_TIME
    );

    spawnRef.current =
      setInterval(
        () => {

          setLeafs(prev => {

            if (
              prev.length >= 1
            ) {
              return prev;
            }

            return [
              ...prev,
              {
                id:
                  Date.now() +
                  Math.random(),

                x:
                  40 +
                  Math.random() *
                  (
                    SCREEN.width -
                    230
                  ),

                isGolden:
                  Math.random() <
                  0.07,
              },
            ];
          });

        },
        1600
      );

    timerRef.current =
      setInterval(
        () => {

          setTimeLeft(
            prev => {

              if (
                prev <= 1
              ) {

                finishGame();

                return 0;
              }

              return (
                prev - 1
              );
            }
          );

        },
        1000
      );
  };

  /* ======================
      FINISH
  ====================== */

const stopGame = () => {
  clearInterval(
    spawnRef.current
  );

  clearInterval(
    timerRef.current
  );

  spawnRef.current =
    null;

  timerRef.current =
    null;

  setLeafs([]);

  setPaused(false);

  setGameOver(false);
};


const finishGame =
  async () => {

    stopGame();

    setGameOver(
      true
    );

    
      console.log(
  "GAME OVER"
);
      setGameOver(
        true
      );


      if (
  score >
  localBestScore
) {

  setLocalBestScore(
    score
  );

}


      if (
        isOnline &&
        score > 0
      ) {
        try {
          await submitScore({
            score,
          });
        } catch {}
      }
    };

  /* ======================
      MOUNT
  ====================== */
useEffect(() => {

  startGame();

  return () => {

    clearInterval(
      spawnRef.current
    );

    clearInterval(
      timerRef.current
    );

  };

}, []);

  /* ======================
      MISS LEAF
  ====================== */

const handleMiss = (
  id: number
) => {

  console.log(
  "MISS",
  id,
  "LIVES BEFORE",
  lives
);

  setLeafs(prev => {

    const exists =
      prev.some(
        leaf =>
          leaf.id === id
      );

    if (!exists) {
      return prev;
    }

setLives(current => {

  const next =
    current - 1;

  if (
    next <= 0
  ) {

    setTimeout(
      () => {
        finishGame();
      },
      0
    );

    return 0;
  }

  return next;
});

    return prev.filter(
      leaf =>
        leaf.id !== id
    );
  });
};

  /* ======================
      CATCH LEAF
  ====================== */
const handleCatch = (
  id: number
) => {
console.log(
  "CATCH",
  id
);
setLeafs(
  (
    prev: {
      id: number;
      x: number;
      isGolden: boolean;
    }[]
  ) => {

      const leaf =
        prev.find(
          (
  item: {
    id: number;
    x: number;
    isGolden: boolean;
  }
) =>
            item.id === id
        );

      if (!leaf) {
        return prev;
      }

      setScore(
        (s) =>
          s +
          (leaf.isGolden
            ? 10
            : 2)
      );

      return prev.filter(
    (
  item: {
    id: number;
    x: number;
    isGolden: boolean;
  }
) =>
          item.id !== id
      );
    }
  );
};

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          "#000",
      }}
    >

      <ImageBackground
        source={BG}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >

        {/* HEADER */}

        <View
          style={{
            flexDirection:
              "row",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            paddingHorizontal:
              16,

            paddingTop: 12,
          }}
        >

       <TouchableOpacity
  activeOpacity={0.8}
onPress={() => {

  stopGame();

  router.dismissAll?.();

  router.replace(
    "/(settings)/settings"
  );
}}
  style={{
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor:
      "rgba(0,0,0,0.55)",

    borderWidth: 1,

    borderColor:
      "rgba(124,255,79,0.15)",

    justifyContent:
      "center",

    alignItems:
      "center",
  }}
>
  <Ionicons
    name="arrow-back"
    size={22}
    color="#7CFF4F"
  />
</TouchableOpacity>

          <Text
            style={{
              color:
                "#fff",

              fontSize: 24,

              fontWeight:
                "800",
            }}
          >
             Spotlight Tree  🍃
          </Text>


        </View>

        {/* STATS */}

        <View
          style={{
            flexDirection:
              "row",

            justifyContent:
              "space-between",

            paddingHorizontal:
              22,

            marginTop: 20,
          }}
        >

          <View>

            <Text
              style={{
                color:
                  "#fff",
              }}
            >
              Score
            </Text>

            <Text
              style={{
                color:
                  "#7CFF4F",

                fontSize:
                  36,

                fontWeight:
                  "800",
              }}
            >
             {score} 🍀
            </Text>

          </View>

          <View>

            <Text
              style={{
                color:
                  "#fff",
              }}
            >
              Time
            </Text>

            <Text
              style={{
                color:
                  "#7CFF4F",

                fontSize:
                  36,

                fontWeight:
                  "800",
              }}
            >
              {timeLeft}
            </Text>

          </View>

          <View>

            <Text
              style={{
                color:
                  "#fff",
              }}
            >
              Lives
            </Text>

       <View
  style={{
    flexDirection:
      "row",
  }}
>
  {Array.from(
    { length: lives }
  ).map(
    (_, i) => (
      <Text
        key={i}
        style={{
          fontSize: 24,
          marginRight: 2,
        }}
      >
        💚
      </Text>
    )
  )}
</View>

          </View>

        </View>


<View
  style={{
    alignSelf:
      "center",

    marginTop: 12,

  backgroundColor:
  "#102414",

borderWidth: 1,

borderColor:
  "#1f5f2a",

paddingHorizontal:
  18,

paddingVertical:
  12,

borderRadius:
  18,
  }}
>
  <Text
    style={{
      color:
        "#7CFF4F",

      fontWeight:
        "700",
    }}
  >
    Best Score:
    {" "}
    {localBestScore}
  </Text>
</View>


        {/* LEAFS */}

  {leafs.map(
  leaf => (
<FallingLeaf
  key={leaf.id}
  id={leaf.id}
  startX={leaf.x}
  basketX={basketX}
  paused={paused}
  isGolden={
    leaf.isGolden
  }
  onCatch={
    handleCatch
  }
  onMiss={
    handleMiss
  }
/>
          )
        )}

  <View
  pointerEvents="none"
  style={{
    position: "absolute",

    bottom: 72,

    left: 25,

    right: 25,

    height: 14,

    borderRadius: 999,

backgroundColor:
  "rgba(124,255,79,0.28)",

    borderWidth: 1,

    borderColor:
      "rgba(124,255,79,0.35)",

    shadowColor:
      "#7CFF4F",

    shadowOpacity: 1,

shadowRadius: 30,

    elevation: 20,
  }}
/>
        {/* BASKET */}

      <View
  {...panResponder.panHandlers}
  style={{
    position:
      "absolute",

    bottom: 40,

    left:
      basketX,

   width: 150,
height: 90,
    justifyContent:
      "center",

    alignItems:
      "center",
  }}
>
  <Image
    source={BASKET}
    resizeMode="contain"
    style={{
width: 150,
height: 90,
    }}
  />
</View>

        {/* GAME OVER */}

        <GameOverModal
          visible={
            gameOver
          }
          score={
            score
          }
      bestScore={
  localBestScore
}
          topScores={
            topScores ??
            []
          }
      onPlayAgain={() => {

  setGameOver(
    false
  );

  startGame();
}}
   onBack={() => {

  stopGame();

  router.dismissAll?.();

  router.replace(
    "/(settings)/settings"
  );
}}
        />

      </ImageBackground>

    </SafeAreaView>
  );
}