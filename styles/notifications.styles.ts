import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: COLORS.surface,
  },

  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },

  iconBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#000",
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },

  notificationInfo: {
    flex: 1,
  },

  username: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },

  action: {
    color: COLORS.grey,
    fontSize: 13,
    marginTop: 2,
  },

  timeAgo: {
    color: "#777",
    fontSize: 11,
    marginTop: 4,
  },

  postImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "600",
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.grey,
    textAlign: "center",
  },
});