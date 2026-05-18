type Reaction = {
  value: string;
};

export function groupReactions(
  reactions?: Reaction[]
) {
  if (!reactions) {
    return [];
  }

  const grouped =
    reactions.reduce(
      (acc: any, reaction) => {
        if (
          !acc[reaction.value]
        ) {
          acc[reaction.value] = 0;
        }

        acc[reaction.value]++;

        return acc;
      },
      {}
    );

  return Object.entries(
    grouped
  );
}