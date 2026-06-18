import { storage } from "@/lib/mmkv";

const SEARCH_KEY =
  "recent_searches";

export const saveSearchCache = (
  searches: string[]
) => {
  storage.set(
    SEARCH_KEY,
    JSON.stringify(
      searches.slice(0, 10)
    )
  );
};

export const getSearchCache =
  () => {
    const cached =
      storage.getString(
        SEARCH_KEY
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