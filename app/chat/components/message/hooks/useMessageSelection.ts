type Layout = {
  x: number;

  y: number;

  width: number;

  height: number;
};

export function measureMessage(
  ref: any,
  callback: (
    layout: Layout
  ) => void
) {
  if (!ref?.current) {
    return;
  }

  ref.current.measureInWindow(
    (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      callback({
        x,
        y,
        width,
        height,
      });
    }
  );
}