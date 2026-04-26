import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  contentContainer: {
    flex: 1,
  },

  /* 🔥 HEADER (glass + minimal) */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.75)",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.6,
  },

  contentDisabled: {
    opacity: 0.5,
  },

  /* 🔥 SHARE BUTTON (pill style) */
  shareButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  shareButtonDisabled: {
    opacity: 0.4,
  },

  shareText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  shareTextDisabled: {
    color: "#666",
  },

  /* 🔥 EMPTY STATE */
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  emptyImageText: {
    color: "#888",
    fontSize: 15,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  /* 🔥 IMAGE SECTION (edge-to-edge clean) */
  imageSection: {
    width: width,
    height: width,
    backgroundColor: "#0a0a0a",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  /* 🔥 FLOATING BUTTON (modern chip) */
  changeImageButton: {
    position: "absolute",
    bottom: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 6,
  },

  changeImageText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  /* 🔥 INPUT SECTION */
  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    flex: 1,
  },

  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  /* 🔥 AVATAR (clean minimal) */
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },

  /* 🔥 CAPTION INPUT (modern spacing) */
  captionInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingTop: 6,
    lineHeight: 22,
    minHeight: 40,
  },
});