export const getHighlightOpacity = (
  highlighted: boolean
) => {
  if (highlighted) {
    return 1;
  }

  return 0;
};

export const getHighlightScale = (
  highlighted: boolean
) => {
  if (highlighted) {
    return 1.015;
  }

  return 1;
};