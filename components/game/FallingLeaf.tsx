import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
} from "react-native";

const LEAF =
  require(
    "@/assets/games/tree/leaf.webp"
  );

const GOLDEN_LEAF =
  require(
    "@/assets/games/tree/goldenleaf.webp"
  );

const SCREEN =
  Dimensions.get("window");

const LEAF_SIZE = 72;

const GOLDEN_LEAF_SIZE = 78;

const BASKET_WIDTH =
  150;

const BASKET_Y =
  SCREEN.height - 180;

type Props = {
  id: number;
  startX: number;
  basketX: number;
  paused: boolean;
  isGolden: boolean;
  onCatch: (
    id: number
  ) => void;
  onMiss: (
    id: number
  ) => void;
};

export default function FallingLeaf({
  id,
  startX,
  basketX,
  paused,
  isGolden,
  onCatch,
  onMiss,
}: Props) {

  const y =
    useRef(
      new Animated.Value(
        -80
      )
    ).current;

  const sway =
    useRef(
      new Animated.Value(
        0
      )
    ).current;

  const rotation =
    useRef(
      new Animated.Value(
        0
      )
    ).current;

    const opacity =
  useRef(
    new Animated.Value(1)
  ).current;

  const removed =
    useRef(false);

    const caught =
  useRef(false);

  const pausedRef =
    useRef(paused);

  const animationRef =
    useRef<any>(null);

  useEffect(() => {
    pausedRef.current =
      paused;
  }, [paused]);

  useEffect(() => {

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          sway,
          {
            toValue: 1,
            duration: 1500,
            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          sway,
          {
            toValue: -1,
            duration: 1500,
            useNativeDriver:
              true,
          }
        ),
      ])
    ).start();

    Animated.loop(
      Animated.timing(
        rotation,
        {
          toValue: 1,
          duration: 4500,
          useNativeDriver:
            true,
        }
      )
    ).start();

    animationRef.current =
      Animated.timing(
        y,
        {
          toValue:
            SCREEN.height +
            120,

          duration:
            4200 +
            Math.random() *
              800,

          useNativeDriver:
            true,
        }
      );

    animationRef.current.start(
      ({
        finished,
      }: any) => {

        if (
          pausedRef.current
        ) {
          return;
        }

        if (
          !finished
        ) {
          return;
        }

if (
  removed.current ||
  caught.current
) {
  return;
}

        removed.current =
          true;

        if (
  !caught.current
) {
  onMiss(id);
}
      }
    );

    const listener =
      y.addListener(
        ({ value }) => {

          if (
            removed.current
          ) {
            return;
          }

   const currentLeafSize =
  isGolden
    ? GOLDEN_LEAF_SIZE
    : LEAF_SIZE;

const leafCenter =
  startX +
  currentLeafSize / 2;

        
const basketLeft =
  basketX - 20;

const basketRight =
  basketX +
  BASKET_WIDTH +
  20;

  
          const basketTop =
            BASKET_Y;


            if (

value >= basketTop - 35 &&
value <= basketTop + 5 && 

leafCenter >=
  basketLeft &&

leafCenter <=
  basketRight

) {

caught.current =
  true;

removed.current =
  true;

y.stopAnimation();

animationRef.current?.stop();

onCatch(id);

Animated.timing(
  opacity,
  {
    toValue: 0,
    duration: 120,
    useNativeDriver: true,
  }
).start();

return;

          }
        }
      );

    return () => {

      removed.current =
        true;

      animationRef.current?.stop();

      y.removeListener(
        listener
      );

    };

  }, []);

  return (
    <Animated.View
      style={{
        position:
          "absolute",

        left: startX,
        opacity,
        transform: [
          {
            translateY:
              y,
          },

          {
            translateX:
              sway.interpolate(
                {
                  inputRange:
                    [-1, 1],

                  outputRange:
                    [-18, 18],
                }
              ),
          },

          {
            rotate:
              rotation.interpolate(
                {
                  inputRange:
                    [0, 1],

                  outputRange:
                    [
                      "0deg",
                      "360deg",
                    ],
                }
              ),
          },
        ],
      }}
    >
      <Image
        source={
          isGolden
            ? GOLDEN_LEAF
            : LEAF
        }
        contentFit="contain"
        style={{
  width:
  isGolden
    ? GOLDEN_LEAF_SIZE
    : LEAF_SIZE,

height:
  isGolden
    ? GOLDEN_LEAF_SIZE
    : LEAF_SIZE,
        }}
      />
    </Animated.View>
  );
}