import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList, InteractionManager, KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Comment from "./Comment";

export default function CommentsModal({
  onClose,
  onCommentAdded,
  postId,
  visible,
}: {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
}) {
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const highlightAnim = useRef(new Animated.Value(0)).current;

  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  /* 🔥 MERGE + SORT */
  const merged = [
    ...(localComments.filter(
      (lc) =>
  !comments?.some(
    (c) =>
      c.content === lc.content &&
      Math.abs(c._creationTime - lc._creationTime) < 2000
  )
    ) || []),
    ...(comments || []),
  ].sort((a, b) => b._creationTime - a._creationTime);

  /* 🔥 ADD COMMENT */
const handleAddComment = async () => {
  if (!newComment.trim() || sending) return;

  // 🔥 KEEP FOCUS LOCKED BEFORE ANY STATE CHANGE
  inputRef.current?.focus();

  const content = newComment.trim();
  const id = "local-" + Date.now();

  const temp = {
    _id: id,
    content,
    _creationTime: Date.now(),
    user: { fullname: "You", image: null },
  };

  setLocalComments((prev) => [temp, ...prev]);
  setNewComment("");
  setSending(true);

  requestAnimationFrame(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  });

  setHighlightId(id);

  highlightAnim.setValue(0);

  Animated.timing(highlightAnim, {
    toValue: 1,
    duration: 250,
    useNativeDriver: false,
  }).start();

  setTimeout(() => {
    Animated.timing(highlightAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => setHighlightId(null));
  }, 400);

  try {
    await addComment({ content, postId });

    setLocalComments((prev) => prev.filter((c) => c._id !== id));
    onCommentAdded();
  } finally {
    setSending(false);

    // 🔥 CRITICAL FIX (RUN AFTER UI SETTLES)
    InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    });
  }
};
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={20}
        style={{ flex: 1 }}
      >
        {/* BACKDROP */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} />
        </TouchableWithoutFeedback>

        {/* SHEET */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "75%",
            backgroundColor: "#0a0a0a",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        >
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Comments
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={{ position: "absolute", right: 14 }}
            >
              <Ionicons name="remove" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* LIST */}
          <FlatList
            ref={listRef}
            data={merged}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            ListFooterComponent={<View style={{ height: 60 }} />}
            renderItem={({ item }) => {
              const isHighlight = item._id === highlightId;

              const bgColor = highlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  "rgba(255,255,255,0.25)",
                  "transparent",
                ],
              });

              return (
                <Animated.View
                  style={{
                    backgroundColor: isHighlight ? bgColor : "transparent",
                    borderRadius: 10,
                    marginHorizontal: 6,
                  }}
                >
                  <Comment comment={item} />
                </Animated.View>
              );
            }}
          />

          {/* INPUT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "#000",
              borderTopWidth: 0.5,
              borderTopColor: "rgba(255,255,255,0.08)",
            }}
          >
            <TextInput
            onFocus={() => {
  // keeps input stable
}}
              ref={inputRef}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.grey}
              blurOnSubmit={false}
              style={{
                flex: 1,
                height: 36,
                backgroundColor: "#111",
                borderRadius: 18,
                paddingHorizontal: 12,
                color: "#fff",
                marginRight: 10,
                fontSize: 13,
              }}
            />

  <Pressable
  onPress={handleAddComment}
  disabled={!newComment.trim() || sending}
  style={{
    height: 36,
    minWidth: 70,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: newComment.trim()
      ? COLORS.primary
      : "#222",
    paddingHorizontal: 14,
  }}
>
  {sending ? (
    <ActivityIndicator size="small" color="#000" />
  ) : (
    <Text
      style={{
        color: newComment.trim() ? "#000" : "#777",
        fontWeight: "600",
        fontSize: 13,
      }}
    >
      Post
    </Text>
  )}
</Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}