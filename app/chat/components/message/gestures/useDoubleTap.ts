import {
  useCallback,
  useRef,
} from "react";

type Props = {
  delay?: number;

  onDoubleTap?: () => void;
};

export default function useDoubleTap({
  delay = 220,

  onDoubleTap,
}: Props) {
  const lastTap =
    useRef(0);

  return useCallback(() => {
    const now =
      Date.now();

    if (
      now -
        lastTap.current <
      delay
    ) {
      onDoubleTap?.();
    }

    lastTap.current = now;
  }, [
    delay,
    onDoubleTap,
  ]);
}