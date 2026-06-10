let refreshFn:
  (() => void) | null =
  null;

export const setFeedRefresh =
  (
    fn: () => void
  ) => {
    refreshFn = fn;
  };

export const triggerFeedRefresh =
  () => {
    refreshFn?.();
  };