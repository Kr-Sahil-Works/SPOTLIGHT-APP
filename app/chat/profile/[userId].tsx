import ChatProfileScreen from "@/app/chat/profile/ChatProfileScreen";
import ThemeModal from "@/features/chat/components/ThemeModal";
import useTheme from "@/features/chat/hooks/useTheme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function ChatProfilePage() {
  const { userId } =
    useLocalSearchParams();

  const { applyTheme } =
    useTheme();

  const [themeOpen, setThemeOpen] =
    useState(false);

  const [themeIndex, setThemeIndex] =
    useState(0);

  const handleApplyTheme =
    async (
      index: number
    ) => {
      setThemeIndex(index);

      await applyTheme(
        userId as any,
        index
      );

      setThemeOpen(false);
    };

  return (
    <>
      <ChatProfileScreen
        userId={userId as any}
        onOpenTheme={() =>
          setThemeOpen(true)
        }
      />

      <ThemeModal
        profileMode
        visible={themeOpen}
        selectedIndex={themeIndex}
        onPreview={() => {}}
        onClose={() =>
          setThemeOpen(false)
        }
        onApply={
          handleApplyTheme
        }
      />
    </>
  );
}