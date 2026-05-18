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
    const sub =
      Keyboard.addListener(
        "keyboardDidShow",
        () => {
          requestAnimationFrame(
            () => {
              listRef.current?.scrollToEnd(
                {
                  animated: false,
                }
              );
            }
          );
        }
      );

    return () => {
      sub.remove();
    };
  }, [listRef]);
}