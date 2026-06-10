export function getMessageAlignment(
  isMe: boolean
) {
  return isMe
    ? "flex-end"
    : "flex-start";
}