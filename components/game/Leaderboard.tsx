import {
  Text,
  View,
} from "react-native";

export default function Leaderboard({
  scores,
}: {
  scores: any[];
}) {
  const getMedal = (
    index: number
  ) => {
    if (index === 0)
      return "🥇";

    if (index === 1)
      return "🥈";

    if (index === 2)
      return "🥉";

    return "🍃";
  };

  return (
    <View
      style={{
        marginTop: 24,

        backgroundColor:
          "rgba(6, 20, 9, 0.92)",

        borderRadius: 24,

        padding: 16,

        borderWidth: 1,

        borderColor:
          "rgba(124,255,79,0.15)",
      }}
    >
      <Text
        style={{
          color: "#fff",

          fontSize: 20,

          fontWeight: "800",

          marginBottom: 14,

          textAlign: "center",
        }}
      >
        🏆 Forest Legends
      </Text>

      {scores?.length ? (
        scores.map(
          (
            item,
            index
          ) => (
            <View
              key={item._id}
              style={{
                flexDirection:
                  "row",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                paddingVertical:
                  10,

                borderBottomWidth:
                  index ===
                  scores.length -
                    1
                    ? 0
                    : 1,

                borderBottomColor:
                  "rgba(216, 54, 54, 0.05)",
              }}
            >
              <View
                style={{
                  flexDirection:
                    "row",

                  alignItems:
                    "center",

                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,

                    marginRight: 10,
                  }}
                >
                  {getMedal(
                    index
                  )}
                </Text>

                <Text
                  numberOfLines={
                    1
                  }
                  style={{
                    color:
                      "#fff",

                    fontWeight:
                      "600",

                    flex: 1,
                  }}
                >
                  {
                    item.fullname
                  }
                </Text>
              </View>

              <View
                style={{
                  backgroundColor:
                    "rgba(124,255,79,0.12)",

                  paddingHorizontal:
                    10,

                  paddingVertical:
                    6,

                  borderRadius:
                    999,
                }}
              >
                <Text
                  style={{
                    color:
                      "#7CFF4F",

                    fontWeight:
                      "800",
                  }}
                >
                  🍀 {
                    item.score
                  }
                </Text>
              </View>
            </View>
          )
        )
      ) : (
        <Text
          style={{
            color:
              "#777",

            textAlign:
              "center",
          }}
        >
          No scores yet
        </Text>
      )}
    </View>
  );
}