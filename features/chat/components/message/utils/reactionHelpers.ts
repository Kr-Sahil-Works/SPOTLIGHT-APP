type Reaction = {
  value: string;
};

export function getReactionKey(
  reactions?: Reaction[]
) {
  if (
    !reactions ||
    reactions.length === 0
  ) {
    return "";
  }

  return reactions
    .map((r) => r.value)
    .join("");
}