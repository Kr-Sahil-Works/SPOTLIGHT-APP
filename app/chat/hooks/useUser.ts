import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function useUser(userId: Id<"users">) {
  const user = useQuery(api.users.index.getUser, { userId });

  return {
    user: user ?? null,
    isLoading: user === undefined,
  };
}