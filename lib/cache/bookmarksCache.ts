import { storage } from "@/lib/mmkv";

const KEY =
  "bookmarks_cache";

export const saveBookmarksCache =
  (posts: unknown[]) => {
    storage.set(
      KEY,
      JSON.stringify(
        posts.slice(0, 20)
      )
    );
  };

export const getBookmarksCache =
  () => {
    const cached =
      storage.getString(
        KEY
      );

    if (!cached)
      return [];

    try {
      return JSON.parse(
        cached
      );
    } catch {
      return [];
    }
  };