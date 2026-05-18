import { Message } from "@/types/chat";

export const areMessageContentsEqual = (
  prev: Message,
  next: Message
) => {
  return (
    prev._id === next._id &&
    prev.text === next.text &&
    prev.updatedAt === next.updatedAt &&
    prev.deleted === next.deleted &&
    prev.pending === next.pending &&
    prev.failed === next.failed &&
    prev.replyTo?._id === next.replyTo?._id &&
    prev.reactions?.length === next.reactions?.length &&
    prev.status === next.status
  );
};

export const areMessageVisualPropsEqual = (
  prev: any,
  next: any
) => {
  return (
    prev.isOwn === next.isOwn &&
    prev.showAvatar === next.showAvatar &&
    prev.showName === next.showName &&
    prev.isGrouped === next.isGrouped &&
    prev.highlighted === next.highlighted &&
    prev.theme === next.theme
  );
};