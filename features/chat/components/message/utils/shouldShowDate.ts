export function shouldShowDate(
  current?: any,
  previous?: any
) {
  if (!current) {
    return false;
  }

  if (!previous) {
    return true;
  }

  const currentDate =
    new Date(
      current.createdAt
    ).toDateString();

  const previousDate =
    new Date(
      previous.createdAt
    ).toDateString();

  return (
    currentDate !==
    previousDate
  );
}