import { Message } from "@/types/chat";

export function isGroupedMessage(
  current?: Message,
  previous?: Message
) {
  if (!current || !previous) {
    return false;
  }

  if (
    current.type === "system" ||
    previous.type === "system"
  ) {
    return false;
  }

  if (
    current.replyTo ||
    previous.replyTo
  ) {
    return false;
  }

  if (
    current.senderId !==
    previous.senderId
  ) {
    return false;
  }

  const currentTime =
    new Date(
      current.createdAt || 0
    ).getTime();

  const previousTime =
    new Date(
      previous.createdAt || 0
    ).getTime();

  const diff =
    currentTime -
    previousTime;

  return diff < 5 * 60 * 1000;
}