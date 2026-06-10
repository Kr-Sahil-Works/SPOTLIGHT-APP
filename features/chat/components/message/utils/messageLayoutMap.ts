type Layout = {
  x: number;

  y: number;

  width: number;

  height: number;
};

const layouts: Record<
  string,
  Layout
> = {};

export function setMessageLayout(
  id: string,
  layout: Layout
) {
  layouts[id] = layout;
}

export function getMessageLayout(
  id: string
) {
  return layouts[id];
}