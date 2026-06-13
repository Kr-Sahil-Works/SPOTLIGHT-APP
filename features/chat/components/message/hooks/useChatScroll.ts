import {
  useCallback,
  useRef,
  useState,
} from "react";

export default function useChatScroll(
  listRef: any
) {


  const isAtBottom =
    useRef(true);

  const scrollOffsetRef =
    useRef(0);

  const [
    showScrollBtn,
    setShowScrollBtn,
  ] = useState(false);

  const [
    newMsgCount,
    setNewMsgCount,
  ] = useState(0);

  const onScroll = useCallback(
    (e: any) => {
      scrollOffsetRef.current =
        e.nativeEvent.contentOffset.y;

      const {
        contentOffset,
        contentSize,
        layoutMeasurement,
      } = e.nativeEvent;

      const distanceFromBottom =
        contentSize.height -
        (contentOffset.y +
          layoutMeasurement.height);

const atBottom =
  distanceFromBottom <= 10;

      isAtBottom.current =
        atBottom;

      if (atBottom) {
        setShowScrollBtn(false);

        setNewMsgCount(0);
      }
    },
    []
  );

const scrollToBottom =
  useCallback(() => {
    listRef.current?.scrollToEnd({
      animated: true,
    });

    setShowScrollBtn(false);
    setNewMsgCount(0);
  }, [listRef]);

const onNewMessage =
  useCallback(() => {
    if (
      isAtBottom.current
    ) {
      requestAnimationFrame(
        () => {
          listRef.current?.scrollToEnd(
            {
              animated:
                true,
            }
          );
        }
      );

      return;
    }

    setNewMsgCount(
      (prev) =>
        prev + 1
    );

    setShowScrollBtn(
      true
    );
  }, [listRef]);

  return {

    onScroll,

    scrollToBottom,

    onNewMessage,

    isAtBottom,

    scrollOffsetRef,

    showScrollBtn,

    newMsgCount,
  };
}