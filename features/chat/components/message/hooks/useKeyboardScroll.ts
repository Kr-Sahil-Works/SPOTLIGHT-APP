import {
  Keyboard,
} from "react-native";

import {
  useEffect,
} from "react";

export default function useKeyboardScroll(
  listRef: any
) {
  useEffect(() => {
    const showSub =
      Keyboard.addListener(
        "keyboardDidShow",
        () => {
          requestAnimationFrame(
            () => {
              listRef.current?.scrollToEnd(
                {
                  animated: true,
                }
              );
            }
          );
        }
      );

    return () => {
      showSub.remove();
    };
  }, [listRef]);
}