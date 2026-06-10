import { storage } from "@/lib/mmkv";

const PROFILE_IMAGE_KEY =
  "profile_image";

export const saveProfileImage =
  (url: string) => {
    storage.set(
      PROFILE_IMAGE_KEY,
      url
    );
  };

export const getProfileImage =
  () =>
    storage.getString(
      PROFILE_IMAGE_KEY
    );