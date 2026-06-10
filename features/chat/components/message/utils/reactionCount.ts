type Reaction = {
  value: string;
};

export function getReactionCount(
  reactions?: Reaction[]
) {
  return reactions?.length || 0;
}