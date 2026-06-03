import { storage } from "@/lib/mmkv";

const NOTES_KEY =
  "notes_cache";

export const saveNotesCache = (
  notes: unknown[]
) => {
  storage.set(
    NOTES_KEY,
    JSON.stringify(
      notes.slice(0, 10)
    )
  );
};

export const getNotesCache =
  () => {
    const cached =
      storage.getString(
        NOTES_KEY
      );

    if (!cached) return [];

    try {
      return JSON.parse(
        cached
      );
    } catch {
      return [];
    }
  };