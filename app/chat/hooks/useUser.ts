import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useQuery } from "convex/react";

import {
  getProfileCache,
  saveProfileCache,
} from "@/lib/cache/profileCache";

export default function useUser(
  userId: Id<"users">
) {
  const liveUser =
    useQuery(
      api.users.index.getUser,
      { userId }
    );

  const cachedUser =
    getProfileCache(
      String(userId)
    );

  if (liveUser) {
    saveProfileCache(
      String(userId),
      liveUser
    );
  }

  return {
    user:
      liveUser ??
      cachedUser ??
      null,

    isLoading:
      liveUser ===
        undefined &&
      !cachedUser,
  };
}