import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useLobby(
  roomId?: string
) {
  const validRoomId = roomId
    ? (roomId as Id<"gameRooms">)
    : undefined;

  const room = useQuery(
    api.games.spy.rooms.getRoom,
    validRoomId
      ? {
          roomId: validRoomId,
        }
      : "skip"
  );

  return {
    room,
    isLoading:
      room === undefined,
  };
}