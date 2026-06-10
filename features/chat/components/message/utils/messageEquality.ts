import { Message } from "@/types/chat";

export const areMessageContentsEqual = (
  prev: Message,
  next: Message
) => {
return (
  prev.text === next.text &&
  prev.status === next.status &&
  prev.seen === next.seen &&
  prev.edited === next.edited &&
  prev.replyTo === next.replyTo &&
  prev.reactions?.length ===
    next.reactions?.length
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