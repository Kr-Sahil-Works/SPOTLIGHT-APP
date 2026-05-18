export const isNearBottom = (
  offsetY: number,
  contentHeight: number,
  layoutHeight: number,
  threshold = 120
) => {
  return (
    contentHeight - layoutHeight - offsetY <= threshold
  );
};

export const shouldAutoScroll = ({
  atBottom,
  isOwnMessage,
}: {
  atBottom: boolean;
  isOwnMessage: boolean;
}) => {
  if (isOwnMessage) return true;

  return atBottom;
};