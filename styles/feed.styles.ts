// import { COLORS } from "@/constants/theme";
// import { Dimensions, Platform, StyleSheet } from "react-native";

// const { width } = Dimensions.get("window");

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.surface,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontFamily: "JetBrainsMono-Medium",
//     color: COLORS.primary,
//   },
//   storiesContainer: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.surface,
//   },
//   storyWrapper: {
//     alignItems: "center",
//     marginHorizontal: 8,
//     width: 72,
//   },
//   storyRing: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     padding: 2,
//     backgroundColor: COLORS.background,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     marginBottom: 4,
//   },
//   noStory: {
//     borderColor: COLORS.grey,
//   },
//   storyAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: COLORS.background,
//   },
//   storyUsername: {
//     fontSize: 11,
//     color: COLORS.white,
//     textAlign: "center",
//   },
//   post: {
//     marginBottom: 16,
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 12,
//   },
//   postHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   postAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   postUsername: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//   },
//   postImage: {
//     width: width,
//     height: width,
//   },
//   postActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   postActionsLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//   },
//   postInfo: {
//     paddingHorizontal: 12,
//   },
//   likesText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//     marginBottom: 6,
//   },
//   captionContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 6,
//   },
//   captionUsername: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//     marginRight: 6,
//   },
//   captionText: {
//     fontSize: 14,
//     color: COLORS.white,
//     flex: 1,
//   },
//   commentsText: {
//     fontSize: 14,
//     color: COLORS.grey,
//     marginBottom: 4,
//   },
//   timeAgo: {
//     fontSize: 12,
//     color: COLORS.grey,
//     marginBottom: 8,
//   },
//   modalContainer: {
//     backgroundColor: COLORS.background,
//     marginBottom: Platform.OS === "ios" ? 44 : 0,
//     flex: 1,
//     marginTop: Platform.OS === "ios" ? 44 : 0,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     height: 56,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   modalTitle: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   commentsList: {
//     flex: 1,
//   },
//   commentContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   commentAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUsername: {
//     color: COLORS.white,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   commentText: {
//     color: COLORS.white,
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   commentTime: {
//     color: COLORS.grey,
//     fontSize: 12,
//     marginTop: 4,
//   },
//   commentInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: COLORS.surface,
//     backgroundColor: COLORS.background,
//   },
//   input: {
//     flex: 1,
//     color: COLORS.white,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     marginRight: 12,
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     fontSize: 14,
//   },
//   postButton: {
//     color: COLORS.primary,
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   postButtonDisabled: {
//     opacity: 0.5,
//   },
//   centered: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });



import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* 🧊 HEADER (floating feel) */
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 18,
  paddingVertical: 14,
  borderBottomWidth: 0.5,
  borderBottomColor: "rgba(255,255,255,0.06)",
  backgroundColor: "rgba(0,0,0,0.85)",
},

headerTitle: {
  fontSize: 20,
  fontFamily: "JetBrainsMono-Medium",
  color: COLORS.primary,
  letterSpacing: 1,
},

  /* 🔥 STORIES (neon ring feel) */
  storiesContainer: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 72,
  },

  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 6,

    /* subtle glow illusion */
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },

  noStory: {
    borderColor: "#333",
    shadowOpacity: 0,
  },

  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  storyUsername: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "center",
  },

  /* 🔥 POST (floating card style) */
  post: {
    marginBottom: 22,
    marginHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#0a0a0a",
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",

    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },

  /* 🔥 HEADER */
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },

  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  postUsername: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  /* 🔥 IMAGE (clean edge-to-edge) */
  postImage: {
    width: "100%",
    height: width,
  },

  /* 🔥 ACTION BAR */
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  /* 🔥 TEXT AREA */
  postInfo: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },

  likesText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },

  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  captionUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginRight: 6,
  },

  captionText: {
    fontSize: 14,
    color: "#ccc",
    flex: 1,
  },

  commentsText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },

  timeAgo: {
    fontSize: 11,
    color: "#666",
  },

  /* 🔥 MODAL */
  modalContainer: {
    backgroundColor: "#000",
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  commentsList: {
    flex: 1,
  },

  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },

  commentContent: {
    flex: 1,
  },

  commentUsername: {
    color: "#fff",
    fontWeight: "500",
    marginBottom: 4,
  },

  commentText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },

  commentTime: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  /* 🔥 INPUT */
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#000",
  },

  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 12,
    backgroundColor: "#111",
    borderRadius: 20,
    fontSize: 14,
  },

  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  postButtonDisabled: {
    opacity: 0.5,
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});