import {
    useCallback,
    useState,
} from "react";

export default function useMessageHighlight() {
  const [
    highlightedId,
    setHighlightedId,
  ] = useState<
    string | null
  >(null);

  const highlightMessage =
    useCallback(
      (id: string) => {
        setHighlightedId(id);

        setTimeout(() => {
          setHighlightedId(
            null
          );
        }, 1600);
      },
      []
    );

  return {
    highlightedId,

    highlightMessage,
  };
}