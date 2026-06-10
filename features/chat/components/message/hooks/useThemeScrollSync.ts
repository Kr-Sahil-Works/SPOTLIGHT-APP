import {
    useEffect,
    useRef,
} from "react";

export default function useThemeScrollSync(
  listRef: any,
  offsetRef: any,
  dependency: any
) {
  const changingRef =
    useRef(false);

  useEffect(() => {
    changingRef.current =
      true;

    requestAnimationFrame(
      () => {
        listRef.current?.scrollToOffset(
          {
            offset:
              offsetRef.current,

            animated: false,
          }
        );

        setTimeout(() => {
          changingRef.current =
            false;
        }, 120);
      }
    );
  }, [
    dependency,
    listRef,
    offsetRef,
  ]);

  return changingRef;
}