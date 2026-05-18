export const shouldActivateSwipeReply = (
  translationX: number,
  velocityX: number
) => {
  return (
    translationX > 55 || velocityX > 700
  );
};

export const shouldFailHorizontalGesture = (
  translationY: number
) => {
  return Math.abs(translationY) > 10;
};

export const clampSwipeValue = (
  value: number,
  min: number,
  max: number
) => {
  "worklet";

  return Math.min(Math.max(value, min), max);
};