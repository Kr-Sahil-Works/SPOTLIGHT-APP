import React, {
  useMemo
} from "react";


import { Reaction } from "@/types/chat";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  reactions?: Reaction[];

  onPress?: () => void;
};



function Reactions({
  reactions,
  onPress,
}: Props)  {

  const reactionItems = useMemo(
  () =>
    reactions?.map(
      (reaction, index) => (
        <Text
          key={`${reaction.userId}-${reaction.value}`}
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
    ),
  [reactions]
);


  if (
    !reactions ||
    reactions.length === 0
  ) {
    return null;
  }

return (
<TouchableOpacity
  key={JSON.stringify(
    reactions ?? []
  )}
  activeOpacity={0.8}
  onPress={onPress}
>
<View
      style={{
        position: "absolute",

        bottom: -16,

        backgroundColor:
          "#000000cc",

        borderRadius: 16,

        paddingHorizontal: 8,

        paddingVertical: 4,

        flexDirection: "row",

        alignItems: "center",

        alignSelf: "flex-start",
      }}
    >
   {reactionItems}
      </View>
</TouchableOpacity>
  );
}

export default Reactions;