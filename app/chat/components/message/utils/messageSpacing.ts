export function getMessageSpacing(
  grouped?: boolean
) {
  return {
    marginBottom: grouped
      ? 4
      : 10,

    borderRadius:
      grouped
        ? 16
        : 22,
  };
}