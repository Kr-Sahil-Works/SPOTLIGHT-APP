import {
  CHAT_LIST_THEMES,
} from "@/constants/chatThemes/chatListThemes";

import { storage } from "@/lib/mmkv";

import {
  useEffect,
  useState,
} from "react";

export default function useChatListTheme() {
  const [themeId, setThemeId] =
    useState(
      storage.getString(
        "selected-chat-list-theme"
      ) ||
        "spotlight-green"
    );

  useEffect(() => {
    const listener =
      storage.addOnValueChangedListener(
        (key) => {
          if (
            key ===
            "selected-chat-list-theme"
          ) {
            setThemeId(
              storage.getString(
                "selected-chat-list-theme"
              ) ||
                "spotlight-green"
            );
          }
        }
      );

    return () =>
      listener.remove();
  }, []);

  return (
    CHAT_LIST_THEMES.find(
      (t) => t.id === themeId
    ) || CHAT_LIST_THEMES[0]
  );
}