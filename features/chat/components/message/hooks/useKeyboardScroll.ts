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
          setTimeout(() => {
            listRef.current?.scrollToEnd(
              {
                animated: true,
              }
            );
          }, 150);
        }
      );

    return () => {
      sub.remove();
    };
  }, [listRef]);
}