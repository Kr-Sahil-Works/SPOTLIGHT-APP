import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* 🔥 HEADER */
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 18,
  paddingVertical: 14,

  borderBottomWidth: 0.5,
  borderBottomColor: "rgba(255,255,255,0.05)",

  backgroundColor: "rgba(0,0,0,0.6)", // ✨ subtle glass
},

  username: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  headerRight: {
    flexDirection: "row",
    gap: 16,
  },

  headerIcon: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  /* 🔥 PROFILE INFO */
  profileInfo: {
    padding: 18,
  },

  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarContainer: {
    marginRight: 28,
  },

avatar: {
  width: 90,
  height: 90,
  borderRadius: 45,

  borderWidth: 2,
  borderColor: "rgba(255,255,255,0.08)",

  shadowColor: COLORS.primary,
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 8,
},

  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#888",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },

  bio: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },

  /* 🔥 ACTION BUTTONS */
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

editButton: {
  flex: 1,
  backgroundColor: "#0f0f0f",
  padding: 12,
  borderRadius: 14,
  alignItems: "center",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.05)",
},

shareButton: {
  backgroundColor: "#0f0f0f",
  padding: 12,
  borderRadius: 14,
  aspectRatio: 1,
  alignItems: "center",
  justifyContent: "center",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.05)",
},

  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

gridItem: {
  flex: 1 / 3,
  aspectRatio: 1,
  padding: 3, // slightly more spacing
},

gridImage: {
  flex: 1,
  borderRadius: 12, // ✨ smoother corners
},

  /* 🔥 MODAL */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
modalContent: {
  backgroundColor: "#0a0a0a",
  borderTopLeftRadius: 26,
  borderTopRightRadius: 26,
  padding: 20,

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.04)",
},

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  inputContainer: {
    marginBottom: 18,
  },

  inputLabel: {
    color: "#888",
    marginBottom: 6,
    fontSize: 13,
  },

input: {
  backgroundColor: "#121212",
  borderRadius: 12,
  padding: 12,
  color: "#fff",
  fontSize: 15,

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.04)",
},

  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },

saveButton: {
  backgroundColor: COLORS.primary,
  padding: 14,
  borderRadius: 14,
  alignItems: "center",

  shadowColor: COLORS.primary,
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 6,
},

  saveButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  /* 🔥 POST MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },

  postDetailContainer: {
    backgroundColor: "#000",
    maxHeight: height * 0.9,
  },

  postDetailHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
  },

  postDetailImage: {
    width: width,
    height: width,
  },

  /* 🔥 EMPTY STATE */
  noPostsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },

  noPostsText: {
    color: "#888",
    fontSize: 16,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});