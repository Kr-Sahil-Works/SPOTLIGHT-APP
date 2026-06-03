import { storage } from "@/lib/mmkv";

export const saveCollectionPostsCache =
(
  collectionId: string,
  postIds: string[]
) => {
  storage.set(
    `collection_${collectionId}`,
    JSON.stringify(postIds)
  );
};

export const getCollectionPostsCache =
(
  collectionId: string
): string[] => {
  const cached =
    storage.getString(
      `collection_${collectionId}`
    );

  if (!cached) return [];

  try {
    return JSON.parse(cached);
  } catch {
    return [];
  }
};