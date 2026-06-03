import { storage } from "@/lib/mmkv";

const KEY =
  "collections_cache";

export const saveCollectionsCache =
  (
    collections:
      unknown[]
  ) => {
    storage.set(
      KEY,
      JSON.stringify(
        collections.slice(
          0,
          8
        )
      )
    );
  };

export const getCollectionsCache =
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