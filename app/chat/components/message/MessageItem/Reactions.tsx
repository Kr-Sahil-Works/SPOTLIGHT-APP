import React from "react";

import {
    Text,
    View,
} from "react-native";

type Reaction = {
  value: string;
};

type Props = {
  reactions?: Reaction[];
};

function Reactions({
  reactions,
}: Props) {
  if (
    !reactions ||
    reactions.length === 0
  ) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",

        bottom: -18,

        backgroundColor:
          "#000000cc",

        borderRadius: 16,

        paddingHorizontal: 8,

        paddingVertical: 3,

        flexDirection: "row",

        alignItems: "center",

        alignSelf: "flex-start",
      }}
    >
      {reactions.map(
        (reaction, index) => (
          <Text
            key={`${reaction.value}-${index}`}
            style={{
              fontSize: 13,

              marginRight:
                index ===
                reactions.length - 1
                  ? 0
                  : 2,
            }}
          >
            {reaction.value}
          </Text>
        )
      )}
    </View>
  );
}

export default React.memo(Reactions);