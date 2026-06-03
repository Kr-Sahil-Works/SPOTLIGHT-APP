import { storage } from "@/lib/mmkv";

const FEED_KEY = "feed_posts";


export const saveFeedCache = (posts: unknown[]) => {
  storage.set(
    FEED_KEY,
    JSON.stringify(posts.slice(0, 12))
  );
};

export const getFeedCache = () => {
  const cached = storage.getString(FEED_KEY);

  if (!cached) return [];

  try {
    return JSON.parse(cached);
  } catch {
    return [];
  }
};

export const clearFeedCache = () => {
storage.remove(FEED_KEY);
};