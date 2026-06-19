import { Id } from "@/convex/_generated/dataModel";

export type Reaction = {
  userId: string;

  value: string;

  userName?: string;

  fullName?: string;

  userImage?: string;
};

export type Message = {
  _id: Id<"messages">;          // ✅ FIXED
  text: string;

  senderId: Id<"users">;        // ✅ FIXED

  createdAt?: number;

  replyTo?: Id<"messages">;     // ✅ FIXED
  replyToText?: string;
  
  status?: "sent" | "delivered" | "seen";

  seen?: boolean;

seenAt?: number;

pinned?: boolean;

pinnedAt?: number;

  reactions?: Reaction[];

  edited?: boolean;
  type?: "text" | "system";

systemType?:
  | "theme_change"
  | "date";

systemCount?: number;

meta?: any;
  optimistic?: boolean;

  deleting?: boolean;

  // layout (measured)
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // finger tracking
  fingerX?: number;
  fingerY?: number;

  senderImage?: string;
};