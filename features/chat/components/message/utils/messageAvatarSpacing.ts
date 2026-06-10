export function getAvatarSpacing(
  isMe: boolean,
  grouped?: boolean
) {
  if (
    !isMe &&
    grouped
  ) {
    return 34;
  }

  return 0;
}