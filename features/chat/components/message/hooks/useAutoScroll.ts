import {
    useEffect,
    useRef,
} from "react";

export default function useAutoScroll(
  messages: any[],
  listRef: any,
  enabled = true
) {
  const lastIdRef =
    useRef<string | null>(
      null
    );

  useEffect(() => {
    if (
      !enabled ||
      !messages.length
    ) {
      return;
    }

    const latest =
      messages[
        messages.length - 1
      ];

    if (
      latest?._id ===
      lastIdRef.current
    ) {
      return;
    }

    lastIdRef.current =
      latest?._id;

    requestAnimationFrame(
      () => {
        listRef.current?.scrollToEnd(
          {
            animated: true,
          }
        );
      }
    );
  }, [
    enabled,
    messages,
    listRef,
  ]);
}