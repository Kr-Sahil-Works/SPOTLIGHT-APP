export type LobbyChatMessage = {
  id: string;

  type: "user" | "system";

  sender?: string;

  message: string;

  createdAt: number;
};
