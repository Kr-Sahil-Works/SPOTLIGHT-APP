import { useMemo } from "react";

export function useMessageMemo<T>(
  factory: () => T,
  deps: React.DependencyList
) {
  return useMemo(factory, deps);
}