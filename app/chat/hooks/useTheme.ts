import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

export default function useTheme() {
  const setTheme = useMutation(api.messages.index.setChatTheme);

  const applyTheme = async (userId: Id<"users">, themeIndex: number) => {
    try {
      await setTheme({ userId, themeIndex });
    } catch (e) {
      console.log("Theme error:", e);
    }
  };

  return { applyTheme };
}