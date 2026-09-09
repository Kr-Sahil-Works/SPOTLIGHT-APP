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

const leaderboard = [
  {
    rank: 1,
    name: "Suraj",
    score: "150,404",
    games: 24,
    icon: "👤",
  },
  {
    rank: 2,
    name: "pp",
    score: "121,506",
    games: 21,
    icon: "🦊",
  },
  {
    rank: 3,
    name: "suda",
    score: "108,260",
    games: 19,
    icon: "🦝",
  },
  {
    rank: 4,
    name: "nobi",
    score: "96,784",
    games: 18,
    icon: "🐢",
  },
  {
    rank: 5,
    name: "musicpinao",
    score: "83,366",
    games: 16,
    icon: "🐼",
  },
  {
    rank: 6,
    name: "LowIQ",
    score: "77,504",
    games: 15,
    icon: "🦝",
  },
  {
    rank: 7,
    name: "9TXOU0",
    score: "67,222",
    games: 14,
    icon: "🐼",
  },
  {
    rank: 8,
    name: "adam",
    score: "99,99,99,99,9999",
    games: 12,
    icon: "🐢",
  },
  {
    rank: 9,
    name: "diba",
    score: "44,820",
    games: 11,
    icon: "🦝",
  },
  {
    rank: 10,
    name: "summer",
    score: "37,902",
    games: 9,
    icon: "🐨",
  },
];

const tiers = [
  {
    name: "Bronze",
    icon: "◆",
    color: "#7E8794",
  },
  {
    name: "Silver",
    icon: "◆",
    color: "#C7CDD4",
  },
  {
    name: "Gold",
    icon: "◆",
    color: "#F2A900",
  },
  {
    name: "Platinum",
    icon: "◆",
    color: "#25BFEF",
  },
  {
    name: "Diamond",
    icon: "◆",
    color: "#A86CFF",
  },
  {
    name: "Master",
    icon: "◆",
    color: "#FF4A2D",
  },
];

export default function RankingScreen() {
return (
  <SafeAreaView style={styles.container}>
    <DotMatrixBackground />

    <View style={styles.pageContent}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </Pressable>

        <View style={styles.headerTitle}>
          <Text style={styles.title}>Ranking</Text>
          <Text style={styles.subtitle}>
            Your position in the game
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CURRENT TIER */}
        <View style={styles.tierCard}>
          <Text style={styles.tierLabel}>
            CURRENT RANK
          </Text>

          <View style={styles.tierRow}>
            {tiers.map((tier, index) => (
              <View
                key={tier.name}
                style={[
                  styles.tierItem,
                  index === 2 && styles.activeTier,
                ]}
              >
                <View
                  style={[
                    styles.tierIcon,
                    {
                      borderColor: tier.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tierDiamond,
                      {
                        color: tier.color,
                      },
                    ]}
                  >
                    {tier.icon}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.tierName,
                    index === 2 && styles.activeTierText,
                  ]}
                >
                  {tier.name}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              Gold III
            </Text>

            <Text style={styles.progressText}>
              2,450 / 3,000 XP
            </Text>
          </View>
        </View>

        {/* LEADERBOARD */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Leaderboard
            </Text>

            <Text style={styles.sectionSubtitle}>
              This season
            </Text>
          </View>

          <View style={styles.seasonBadge}>
            <Text style={styles.seasonText}>
              SEASON 01
            </Text>
          </View>
        </View>

        {leaderboard.map((player) => (
          <View
            key={player.rank}
            style={[
              styles.playerRow,
              player.rank === 1 && styles.firstRow,
            ]}
          >
            <View style={styles.rankBox}>
              <Text
                style={[
                  styles.rank,
                  player.rank <= 3 &&
                    styles.topRank,
                ]}
              >
                {player.rank}
              </Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {player.icon}
              </Text>
            </View>

            <View style={styles.playerInfo}>
              <Text
                numberOfLines={1}
                style={styles.playerName}
              >
                {player.name}
              </Text>

              <Text style={styles.games}>
                {player.games} games
              </Text>
            </View>

            <View style={styles.scoreBox}>
              <Text style={styles.score}>
                {player.score}
              </Text>

              <Text style={styles.scoreLabel}>
                XP
              </Text>
            </View>
          </View>
        ))}

        {/* YOUR POSITION */}
        <View style={styles.yourPosition}>
          <View>
            <Text style={styles.yourLabel}>
              YOUR POSITION
            </Text>

            <Text style={styles.yourRank}>
              #42
            </Text>
          </View>

          <View style={styles.yourStats}>
            <Text style={styles.yourScore}>
              18,420 XP
            </Text>

            <Text style={styles.yourSmall}>
              12 games
            </Text>
          </View>
        </View>
            </ScrollView>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05050514",
  },

  pageContent: {
  flex: 1,
},

  header: {
    height: 64,
    paddingHorizontal: 16,
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

  headerTitle: {
    alignItems: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  tierCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#0D0D0F",
    borderWidth: 1,
    borderColor: "#242424",
  },

  tierLabel: {
    color: "#686868",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    textAlign: "center",
    marginBottom: 16,
  },

  tierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tierItem: {
    alignItems: "center",
    opacity: 0.45,
  },

  activeTier: {
    opacity: 1,
  },

  tierIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151515",
  },

  tierDiamond: {
    fontSize: 17,
  },

  tierName: {
    color: "#777",
    fontSize: 8,
    fontWeight: "700",
    marginTop: 5,
  },

  activeTierText: {
    color: "#F2A900",
  },

  progressTrack: {
    height: 6,
    borderRadius: 10,
    backgroundColor: "#202020",
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    width: "72%",
    height: "100%",
    backgroundColor: "#F2A900",
    borderRadius: 10,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    color: "#777",
    fontSize: 10,
    fontWeight: "600",
  },

  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#555",
    fontSize: 11,
    marginTop: 2,
  },

  seasonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#292929",
  },

  seasonText: {
    color: "#F2A900",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  playerRow: {
    minHeight: 62,
    marginBottom: 7,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: "#0D0D0F",
    borderWidth: 1,
    borderColor: "#191919",
    flexDirection: "row",
    alignItems: "center",
  },

  firstRow: {
    borderColor: "rgba(242,169,0,0.35)",
  },

  rankBox: {
    width: 28,
    alignItems: "center",
  },

  rank: {
    color: "#777",
    fontSize: 12,
    fontWeight: "800",
  },

  topRank: {
    color: "#F2A900",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    fontSize: 20,
  },

  playerInfo: {
    flex: 1,
  },

  playerName: {
    color: "#EEE",
    fontSize: 12,
    fontWeight: "700",
  },

  games: {
    color: "#555",
    fontSize: 9,
    marginTop: 3,
  },

  scoreBox: {
    alignItems: "flex-end",
  },

  score: {
    color: "#F2A900",
    fontSize: 12,
    fontWeight: "800",
  },

  scoreLabel: {
    color: "#555",
    fontSize: 8,
    marginTop: 2,
  },

  yourPosition: {
    marginTop: 18,
    padding: 17,
    borderRadius: 20,
    backgroundColor: "#15110A",
    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.25)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  yourLabel: {
    color: "#8A6A21",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  yourRank: {
    color: "#F2A900",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2,
  },

  yourStats: {
    alignItems: "flex-end",
  },

  yourScore: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },

  yourSmall: {
    color: "#666",
    fontSize: 10,
    marginTop: 3,
  },
});