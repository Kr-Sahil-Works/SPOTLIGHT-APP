import {
    useCallback,
} from "react";

export default function useScrollToMessage(
  listRef: any,
  messages: any[]
) {
  const scrollToMessage =
    useCallback(
      (id: string) => {
        const index =
          messages.findIndex(
            (m) => m._id === id
          );

        if (index === -1) {
          return;
        }

        listRef.current?.scrollToIndex(
          {
            index,

            animated: true,

            viewPosition: 0.5,
          }
        );
      },
      [listRef, messages]
    );

  return scrollToMessage;
}