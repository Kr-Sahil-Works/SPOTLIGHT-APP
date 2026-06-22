import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Leaderboard from "./Leaderboard";

export default function GameOverModal({
  visible,
  score,
  bestScore,
  topScores,
  onPlayAgain,
  onBack,
}: any) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,

          backgroundColor:
            "rgba(0,0,0,0.94)",

          justifyContent:
            "center",

          padding: 20,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            alignItems:
              "center",

            marginBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: 54,
            }}
          >
            🌳
          </Text>

          <Text
            style={{
              color: "#fff",

              fontSize: 32,

              fontWeight: "800",

              marginTop: 8,
            }}
          >
            Forest Run Ended
          </Text>

          <Text
            style={{
              color:
                "#8a8a8a",

              marginTop: 6,
            }}
          >
            The leaves have stopped falling
          </Text>
        </View>

        {/* SCORE CARDS */}

        <View
          style={{
            flexDirection:
              "row",

            gap: 12,

            marginBottom: 20,
          }}
        >
          <View
            style={{
              flex: 1,

              backgroundColor:
                "#102414",

              borderRadius: 20,

              padding: 16,

              borderWidth: 1,

              borderColor:
                "rgba(124,255,79,0.15)",
            }}
          >
            <Text
              style={{
                color:
                  "#9ca3af",

                fontSize: 12,
              }}
            >
              CURRENT SCORE
            </Text>

            <Text
              style={{
                color:
                  "#7CFF4F",

                fontSize: 28,

                fontWeight:
                  "800",

                marginTop: 6,
              }}
            >
              🍀 {score}
            </Text>
          </View>

          <View
            style={{
              flex: 1,

              backgroundColor:
                "#1b1708",

              borderRadius: 20,

              padding: 16,

              borderWidth: 1,

              borderColor:
                "rgba(255,215,0,0.15)",
            }}
          >
            <Text
              style={{
                color:
                  "#9ca3af",

                fontSize: 12,
              }}
            >
              BEST SCORE
            </Text>

            <Text
              style={{
                color:
                  "#FFD700",

                fontSize: 28,

                fontWeight:
                  "800",

                marginTop: 6,
              }}
            >
              🏆 {bestScore}
            </Text>
          </View>
        </View>

        {/* LEADERBOARD */}

        {topScores?.length ? (
          <Leaderboard
            scores={
              topScores
            }
          />
        ) : (
          <View
            style={{
              backgroundColor:
                "rgba(255,255,255,0.04)",

              borderRadius: 20,

              padding: 20,

              marginTop: 10,
            }}
          >
            <Text
              style={{
                color:
                  "#777",

                textAlign:
                  "center",
              }}
            >
              🌱 Loading Forest Legends...
            </Text>
          </View>
        )}

        {/* PLAY AGAIN */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={
            onPlayAgain
          }
          style={{
            marginTop: 20,

            height: 58,

            borderRadius: 18,

            backgroundColor:
              "#7CFF4F",

            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >
          <Text
            style={{
              color:
                "#071107",

              fontWeight:
                "800",

              fontSize: 16,
            }}
          >
           Play Again
          </Text>
        </TouchableOpacity>

        {/* BACK */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={
            onBack
          }
          style={{
            marginTop: 12,

            height: 56,

            borderRadius: 18,

            backgroundColor:
              "rgba(255,255,255,0.07)",

            borderWidth: 1,

            borderColor:
              "rgba(255,255,255,0.06)",

            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontWeight:
                "700",

              fontSize: 15,
            }}
          >
            ⚙️ Back To Settings
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}