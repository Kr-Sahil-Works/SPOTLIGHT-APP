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

    const hasMountedRef =
  useRef(false);

  useEffect(() => {
    if (
      !enabled ||
      !messages.length
    ) {
      return;
    }

    if (!hasMountedRef.current) {
  hasMountedRef.current =
    true;

  lastIdRef.current =
    messages[
      messages.length - 1
    ]?._id;

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