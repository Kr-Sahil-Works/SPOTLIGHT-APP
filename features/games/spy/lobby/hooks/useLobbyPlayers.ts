import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useLobbyPlayers(
  roomId?: string
) {
  const validRoomId = roomId
    ? (roomId as Id<"gameRooms">)
    : undefined;

  const players = useQuery(
    api.games.spy.rooms.getRoomPlayers,
    validRoomId
      ? {
          roomId: validRoomId,
        }
      : "skip"
  );

  return {
    players: players ?? [],
    isLoading:
      players === undefined,
  };
}

