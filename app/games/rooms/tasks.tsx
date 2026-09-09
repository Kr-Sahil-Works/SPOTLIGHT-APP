import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DotMatrixBackground from "./DotMatrixBackground";

const tasks = [
  {
    progress: 1,
    total: 1,
    title: "Play your first game",
    reward: "25 XP",
    completed: true,
  },
  {
    progress: 7,
    total: 10,
    title: "Complete 10 matches",
    reward: "100 XP",
    completed: false,
  },
  {
    progress: 4,
    total: 5,
    title: "Win 5 games",
    reward: "150 XP",
    completed: false,
  },
  {
    progress: 2,
    total: 3,
    title: "Play with friends",
    reward: "75 XP",
    completed: false,
  },
  {
    progress: 0,
    total: 10,
    title: "Vote correctly 10 times",
    reward: "125 XP",
    completed: false,
  },
  {
    progress: 0,
    total: 5,
    title: "Survive as the Spy",
    reward: "200 XP",
    completed: false,
  },
];

export default function TasksScreen() {
return (
  <SafeAreaView style={styles.container}>
    <DotMatrixBackground />

    <View style={styles.pageContent}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#111"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              Daily Tasks
            </Text>

            <Text style={styles.subtitle}>
              Complete tasks and earn rewards
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* XP REWARD */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardIcon}>
            <Text style={styles.diamond}>◆</Text>
          </View>

          <View style={styles.rewardInfo}>
            <Text style={styles.rewardLabel}>
              TODAY'S REWARD
            </Text>

            <Text style={styles.rewardValue}>
              250 XP
            </Text>
          </View>

          <View style={styles.rewardProgress}>
            <Text style={styles.rewardSmall}>
              3 / 6
            </Text>

            <View style={styles.rewardTrack}>
              <View
                style={styles.rewardFill}
              />
            </View>
          </View>
        </View>

        {/* CHESTS */}
        <View style={styles.chestSection}>
          {[20, 40, 60, 80, 100].map(
            (value, index) => (
              <View
                key={value}
                style={styles.chestItem}
              >
                <View
                  style={[
                    styles.chest,
                    index < 2 &&
                      styles.claimedChest,
                  ]}
                >
                  <Ionicons
                    name={
                      index < 2
                        ? "lock-open"
                        : "lock-closed"
                    }
                    size={20}
                    color={
                      index < 2
                        ? "#F2A900"
                        : "#777"
                    }
                  />
                </View>

                <Text style={styles.chestText}>
                  {value}
                </Text>
              </View>
            )
          )}
        </View>

        {/* RESET */}
        <View style={styles.resetCard}>
          <Text style={styles.resetLabel}>
            TASKS RESET IN
          </Text>

          <Text style={styles.resetTime}>
            12:42:56
          </Text>

          <Pressable style={styles.claimAll}>
            <Text style={styles.claimAllText}>
              CLAIM ALL
            </Text>
          </Pressable>
        </View>

        {/* TASK LIST */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Tasks
          </Text>

          <Text style={styles.sectionCount}>
            3 / 6
          </Text>
        </View>

        {tasks.map((task, index) => {
          const percentage =
            Math.min(
              task.progress / task.total,
              1
            ) * 100;

          return (
            <View
              key={index}
              style={styles.taskCard}
            >
              <View style={styles.taskTop}>
                <View style={styles.taskReward}>
                  <Text style={styles.rewardEmoji}>
                    ◆
                  </Text>

                  <Text style={styles.taskRewardText}>
                    {task.reward}
                  </Text>
                </View>

                <Text style={styles.taskProgress}>
                  {task.progress}/{task.total}
                </Text>
              </View>

              <View style={styles.taskTrack}>
                <View
                  style={[
                    styles.taskFill,
                    {
                      width: `${percentage}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.taskBottom}>
                <View style={styles.taskTextBox}>
                  <Text style={styles.taskTitle}>
                    {task.title}
                  </Text>

                  <Text style={styles.taskDescription}>
                    Keep playing to complete this task
                  </Text>
                </View>

                <Pressable
                  disabled={!task.completed}
                  style={[
                    styles.taskButton,
                    task.completed
                      ? styles.claimButton
                      : styles.goButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.taskButtonText,
                      task.completed &&
                        styles.claimButtonText,
                    ]}
                  >
                    {task.completed
                      ? "CLAIM"
                      : "GO"}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons
            name="sparkles"
            size={15}
            color="#F2A900"
          />

          <Text style={styles.footerText}>
            More challenges coming soon
          </Text>
        </View>
      </ScrollView>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05050521",
  },
pageContent: {
  flex: 1,
},
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F2A900",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerSpacer: {
    width: 42,
  },

  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: "#666",
    fontSize: 10,
    marginTop: 3,
  },

  rewardCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: "#0D0D0F",
    borderWidth: 1,
    borderColor: "#252525",
    flexDirection: "row",
    alignItems: "center",
  },

  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#18140A",
    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  diamond: {
    color: "#F2A900",
    fontSize: 22,
  },

  rewardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  rewardLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  rewardValue: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 2,
  },

  rewardProgress: {
    width: 70,
    alignItems: "flex-end",
  },

  rewardSmall: {
    color: "#F2A900",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 5,
  },

  rewardTrack: {
    width: 70,
    height: 5,
    backgroundColor: "#222",
    borderRadius: 10,
    overflow: "hidden",
  },

  rewardFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#F2A900",
  },

  chestSection: {
    marginTop: 18,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#0B0B0C",
    borderWidth: 1,
    borderColor: "#1C1C1C",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  chestItem: {
    alignItems: "center",
  },

  chest: {
    width: 42,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },

  claimedChest: {
    backgroundColor: "#18140A",
    borderColor: "rgba(242,169,0,0.35)",
  },

  chestText: {
    color: "#666",
    fontSize: 8,
    fontWeight: "700",
    marginTop: 4,
  },

  resetCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 17,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#202020",
    flexDirection: "row",
    alignItems: "center",
  },

  resetLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
  },

  resetTime: {
    color: "#F2A900",
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 7,
  },

  claimAll: {
    marginLeft: "auto",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#F2A900",
  },

  claimAllText: {
    color: "#111",
    fontSize: 9,
    fontWeight: "900",
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
  },

  sectionCount: {
    color: "#F2A900",
    fontSize: 11,
    fontWeight: "800",
  },

  taskCard: {
    marginBottom: 9,
    padding: 13,
    borderRadius: 18,
    backgroundColor: "#0D0D0F",
    borderWidth: 1,
    borderColor: "#1D1D1F",
  },

  taskTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskReward: {
    flexDirection: "row",
    alignItems: "center",
  },

  rewardEmoji: {
    color: "#F2A900",
    fontSize: 13,
    marginRight: 5,
  },

  taskRewardText: {
    color: "#F2A900",
    fontSize: 10,
    fontWeight: "800",
  },

  taskProgress: {
    color: "#777",
    fontSize: 10,
    fontWeight: "800",
  },

  taskTrack: {
    height: 5,
    borderRadius: 10,
    backgroundColor: "#222",
    overflow: "hidden",
    marginTop: 9,
  },

  taskFill: {
    height: "100%",
    backgroundColor: "#F2A900",
    borderRadius: 10,
  },

  taskBottom: {
    marginTop: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  taskTextBox: {
    flex: 1,
    paddingRight: 10,
  },

  taskTitle: {
    color: "#EEE",
    fontSize: 12,
    fontWeight: "800",
  },

  taskDescription: {
    color: "#555",
    fontSize: 9,
    marginTop: 3,
  },

  taskButton: {
    minWidth: 62,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  goButton: {
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#303030",
  },

  claimButton: {
    backgroundColor: "#F2A900",
  },

  taskButtonText: {
    color: "#888",
    fontSize: 9,
    fontWeight: "900",
  },

  claimButtonText: {
    color: "#111",
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  footerText: {
    color: "#444",
    fontSize: 10,
  },
});