
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

const friends = [
  {
    name: "KRXCTO",
    status: "Online",
    games: 21,
    avatar: "🦊",
    color: "#25C46B",
  },
  {
    name: "ROADK7",
    status: "In a game",
    games: 19,
    avatar: "🦝",
    color: "#F2A900",
  },
  {
    name: "CVA83W",
    status: "Online",
    games: 18,
    avatar: "🐢",
    color: "#25C46B",
  },
  {
    name: "Kuba",
    status: "Away",
    games: 16,
    avatar: "🐼",
    color: "#777",
  },
  {
    name: "EQUBIQ",
    status: "Online",
    games: 15,
    avatar: "🦝",
    color: "#25C46B",
  },
  {
    name: "nova",
    status: "Offline",
    games: 12,
    avatar: "🐢",
    color: "#555",
  },
  {
    name: "Henry Burdette",
    status: "Online",
    games: 11,
    avatar: "🦝",
    color: "#25C46B",
  },
  {
    name: "summer",
    status: "Away",
    games: 9,
    avatar: "🐨",
    color: "#777",
  },
];

export default function FriendsScreen() {
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
                Friends
              </Text>

              <Text style={styles.subtitle}>
                Your game circle
              </Text>
            </View>

            <Pressable style={styles.addButton}>
              <Ionicons
                name="person-add-outline"
                size={19}
                color="#F2A900"
              />
            </Pressable>
          </View>

          {/* FRIEND SUMMARY */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                24
              </Text>

              <Text style={styles.summaryLabel}>
                Friends
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: "#25C46B",
                  },
                ]}
              >
                8
              </Text>

              <Text style={styles.summaryLabel}>
                Online
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: "#F2A900",
                  },
                ]}
              >
                5
              </Text>

              <Text style={styles.summaryLabel}>
                Playing
              </Text>
            </View>
          </View>

          {/* INVITE */}
          <View style={styles.inviteCard}>
            <View style={styles.inviteIcon}>
              <Ionicons
                name="people-outline"
                size={22}
                color="#F2A900"
              />
            </View>

            <View style={styles.inviteInfo}>
              <Text style={styles.inviteTitle}>
                Invite friends
              </Text>

              <Text style={styles.inviteText}>
                Bring your friends into the next
                game.
              </Text>
            </View>

            <Pressable style={styles.inviteButton}>
              <Text style={styles.inviteButtonText}>
                INVITE
              </Text>
            </Pressable>
          </View>

          {/* SECTION */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                My Friends
              </Text>

              <Text style={styles.sectionSubtitle}>
                Recently active
              </Text>
            </View>

            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                8 online
              </Text>
            </View>
          </View>

          {/* FRIEND LIST */}
          {friends.map((friend) => (
            <Pressable
              key={friend.name}
              style={styles.friendRow}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {friend.avatar}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        friend.color,
                    },
                  ]}
                />
              </View>

              <View style={styles.friendInfo}>
                <Text
                  numberOfLines={1}
                  style={styles.friendName}
                >
                  {friend.name}
                </Text>

                <View style={styles.statusRow}>
                  <Text
                    style={[
                      styles.friendStatus,
                      {
                        color:
                          friend.status ===
                          "Online"
                            ? "#25C46B"
                            : "#666",
                      },
                    ]}
                  >
                    {friend.status}
                  </Text>

                  <Text style={styles.dotSeparator}>
                    •
                  </Text>

                  <Text style={styles.gamesText}>
                    {friend.games} games
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.gameButton}
              >
                <Ionicons
                  name="game-controller-outline"
                  size={17}
                  color="#F2A900"
                />
              </Pressable>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#444"
                style={styles.chevron}
              />
            </Pressable>
          ))}

          {/* REQUESTS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Friend Requests
              </Text>

              <Text style={styles.sectionSubtitle}>
                Waiting for you
              </Text>
            </View>

            <View style={styles.requestBadge}>
              <Text style={styles.requestBadgeText}>
                2
              </Text>
            </View>
          </View>

          <View style={styles.requestCard}>
            <View style={styles.requestAvatar}>
              <Text style={styles.avatarText}>
                🐱
              </Text>
            </View>

            <View style={styles.requestInfo}>
              <Text style={styles.friendName}>
                ShadowFox
              </Text>

              <Text style={styles.requestText}>
                wants to be your friend
              </Text>
            </View>

            <Pressable
              style={styles.acceptButton}
            >
              <Ionicons
                name="checkmark"
                size={17}
                color="#111"
              />
            </Pressable>

            <Pressable
              style={styles.rejectButton}
            >
              <Ionicons
                name="close"
                size={17}
                color="#777"
              />
            </Pressable>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Ionicons
              name="sparkles-outline"
              size={15}
              color="#F2A900"
            />

            <Text style={styles.footerText}>
              More social features coming soon
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
    backgroundColor: "#050505",
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

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#0D0D0F",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
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

  summaryCard: {
    padding: 17,
    borderRadius: 22,
    backgroundColor: "rgba(13,13,15,0.94)",
    borderWidth: 1,
    borderColor: "#252525",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryValue: {
    color: "#FFF",
    fontSize: 21,
    fontWeight: "900",
  },

  summaryLabel: {
    color: "#666",
    fontSize: 9,
    marginTop: 3,
    fontWeight: "700",
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#252525",
  },

  inviteCard: {
    marginTop: 12,
    padding: 13,
    borderRadius: 19,
    backgroundColor: "rgba(21,17,10,0.94)",
    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.22)",
    flexDirection: "row",
    alignItems: "center",
  },

  inviteIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#18140A",
    alignItems: "center",
    justifyContent: "center",
  },

  inviteInfo: {
    flex: 1,
    marginLeft: 10,
  },

  inviteTitle: {
    color: "#EEE",
    fontSize: 12,
    fontWeight: "800",
  },

  inviteText: {
    color: "#666",
    fontSize: 9,
    marginTop: 3,
  },

  inviteButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#F2A900",
  },

  inviteButtonText: {
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

  sectionSubtitle: {
    color: "#555",
    fontSize: 10,
    marginTop: 2,
  },

  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: "#0E1711",
    borderWidth: 1,
    borderColor: "#1D3324",
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#25C46B",
    marginRight: 5,
  },

  onlineText: {
    color: "#25C46B",
    fontSize: 9,
    fontWeight: "800",
  },

  friendRow: {
    minHeight: 64,
    marginBottom: 7,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: "rgba(13,13,15,0.94)",
    borderWidth: 1,
    borderColor: "#1D1D1F",
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
    marginRight: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 20,
  },

  statusDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#0D0D0F",
  },

  friendInfo: {
    flex: 1,
  },

  friendName: {
    color: "#EEE",
    fontSize: 12,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  friendStatus: {
    fontSize: 9,
    fontWeight: "700",
  },

  dotSeparator: {
    color: "#444",
    fontSize: 8,
    marginHorizontal: 5,
  },

  gamesText: {
    color: "#555",
    fontSize: 9,
  },

  gameButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#17130A",
    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },

  chevron: {
    marginRight: 3,
  },

  requestBadge: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#F2A900",
    alignItems: "center",
    justifyContent: "center",
  },

  requestBadgeText: {
    color: "#111",
    fontSize: 10,
    fontWeight: "900",
  },

  requestCard: {
    padding: 12,
    borderRadius: 17,
    backgroundColor: "rgba(13,13,15,0.94)",
    borderWidth: 1,
    borderColor: "#1D1D1F",
    flexDirection: "row",
    alignItems: "center",
  },

  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
  },

  requestInfo: {
    flex: 1,
    marginLeft: 10,
  },

  requestText: {
    color: "#555",
    fontSize: 9,
    marginTop: 3,
  },

  acceptButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F2A900",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  rejectButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  footer: {
    marginTop: 22,
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