import { Id } from "@/convex/_generated/dataModel";

export type Reaction = {
  value: string;
};

export type TapState = {
  count: number;
  timer: ReturnType<typeof setTimeout> | null;
};

export type Message = {
  _id: Id<"messages">;          // ✅ FIXED
  text: string;

  senderId: Id<"users">;        // ✅ FIXED

  createdAt?: number;

  replyTo?: Id<"messages">;     // ✅ FIXED
  replyToText?: string;

  reactions?: Reaction[];

  edited?: boolean;
  optimistic?: boolean;

  // layout (measured)
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // finger tracking
  fingerX?: number;
  fingerY?: number;

};