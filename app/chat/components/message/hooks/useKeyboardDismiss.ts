import { useCallback } from "react";
import { Keyboard } from "react-native";

export function useKeyboardDismiss() {
  return useCallback(() => {
    Keyboard.dismiss();
  }, []);
}