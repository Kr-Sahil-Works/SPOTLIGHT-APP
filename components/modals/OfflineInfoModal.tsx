import {
    useEffect,
    useRef,
} from "react";
import {
    Animated,
    Pressable,
    Text,
    View
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function OfflineInfoModal({
  visible,
  onClose,
}: Props) {
  const translateY =
    useRef(
      new Animated.Value(250)
    ).current;

    const progress =
  useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    progress.setValue(0);

Animated.timing(
  progress,
  {
    toValue: 100,
    duration: 10000,
    useNativeDriver: false,
  }
).start();

    Animated.spring(
      translateY,
      {
        toValue: 0,
        useNativeDriver: true,
      }
    ).start();

    const timer =
      setTimeout(() => {
        onClose();
      }, 10000);

    return () =>
      clearTimeout(timer);
  }, [visible]);

  if (!visible)
    return null;

  return (
    <Pressable
      onPress={onClose}
      style={{
        position:
          "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      <Animated.View
        style={{
          position:
            "absolute",

          left: 14,
          right: 14,
          bottom: 25,

          transform: [
            {
              translateY,
            },
          ],

       backgroundColor:
  "#121212",

borderRadius: 20,

borderWidth: 1,

borderColor:
  "rgba(255,98,98,0.18)",

padding: 16,
        }}
      >
        <Text
          style={{
            color:
              "#d80000",

            fontSize: 16,

            fontWeight:
              "700",

            marginBottom: 8,
          }}
        >
          Offline Mode 
        </Text>

        <Text
          style={{
            color:
              "#d4d4d4",

            lineHeight: 21,

            fontSize: 13,
          }}
        >
          Spotlight supports
          offline mode for
          viewing cached
          content.

          {"\n\n"}

          For the best
          experience, use a
          stable internet
          connection.

          {"\n\n"}

          If a screen appears
          stuck while offline,
          or after reconnecting,
          simply close and
          reopen the app.
        </Text>

        <View
  style={{
    marginTop: 14,

    height: 3,

    borderRadius: 99,

    overflow: "hidden",

    backgroundColor:
      "rgba(255,255,255,0.06)",
  }}
>
  <Animated.View
    style={{
      height: "100%",

      width:
        progress.interpolate({
          inputRange: [
            0,
            100,
          ],
          outputRange: [
            "0%",
            "100%",
          ],
        }),

      backgroundColor:
        "#e60000",
    }}
  />
</View>
      </Animated.View>
    </Pressable>
  );
}