import { useCallback, useRef } from "react";

export function useInteractionBlock() {
  const blockedRef = useRef(false);

  const block = useCallback(() => {
    blockedRef.current = true;
  }, []);

  const unblock = useCallback(() => {
    blockedRef.current = false;
  }, []);

  const isBlocked = useCallback(() => {
    return blockedRef.current;
  }, []);

  return {
    block,
    unblock,
    isBlocked,
  };
}