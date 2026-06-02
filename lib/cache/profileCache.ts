import { storage } from "@/lib/mmkv";

export const saveProfileCache = (
  userId: string,
  profile: unknown
) => {
  storage.set(
    `profile_${userId}`,
    JSON.stringify(profile)
  );
};

export const getProfileCache = (
  userId: string
) => {
  const cached = storage.getString(
    `profile_${userId}`
  );

  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
};