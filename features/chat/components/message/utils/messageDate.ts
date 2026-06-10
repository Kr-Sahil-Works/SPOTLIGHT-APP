export function formatMessageDate(
  timestamp: number
) {
  const date =
    new Date(timestamp);

  const now =
    new Date();

  const yesterday =
    new Date();

  yesterday.setDate(
    now.getDate() - 1
  );

  const isToday =
    date.toDateString() ===
    now.toDateString();

  if (isToday) {
    return "Today";
  }

  const isYesterday =
    date.toDateString() ===
    yesterday.toDateString();

  if (isYesterday) {
    return "Yesterday";
  }

  const diff =
    now.getTime() -
    date.getTime();

  const week =
    7 *
    24 *
    60 *
    60 *
    1000;

  if (diff < week) {
    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}