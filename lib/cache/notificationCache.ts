import { storage } from "@/lib/mmkv";

const KEY =
  "notifications";

export const saveNotificationCache =
  (
    notifications:
      unknown[]
  ) => {
    storage.set(
      KEY,
      JSON.stringify(
        notifications.slice(
          0,
          10
        )
      )
    );
  };

export const getNotificationCache =
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