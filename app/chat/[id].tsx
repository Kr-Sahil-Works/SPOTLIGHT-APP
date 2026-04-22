import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [editingMsg, setEditingMsg] = useState<any>(null);

  const flatListRef = useRef<FlatList>(null);

  const data = useQuery(api.messages.getMessages, {
    userId: id as any,
    limit: 30,
  });

  const messages = data?.messages || [];
  const currentUserId = data?.currentUserId;

  const sendMessage = useMutation(api.messages.sendMessage);
  const editMessage = useMutation(api.messages.editMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  /* 🔥 SEND / EDIT */
  const handleSend = async () => {
    if (!text.trim()) return;

    if (editingMsg) {
      await editMessage({
        messageId: editingMsg._id,
        newText: text,
      });
      setEditingMsg(null);
    } else {
      await sendMessage({
        receiverId: id as any,
        text,
        replyTo: replyTo?._id,
      });
    }

    setText("");
    setReplyTo(null);
  };

  /* 🔥 LONG PRESS MENU */
  const handleLongPress = (item: any) => {
    const isMe = item.senderId === currentUserId;

    if (!isMe) return;

    Alert.alert("Message", "Choose action", [
      {
        text: "Edit",
        onPress: () => {
          setEditingMsg(item);
          setText(item.text);
        },
      },
      {
        text: "Delete",
        onPress: () => deleteMessage({ messageId: item._id }),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      {/* HEADER */}
      <View style={{ flexDirection: "row", padding: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={{ color: "#fff", marginLeft: 12 }}>Chat</Text>
      </View>

      {/* MESSAGES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUserId;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onLongPress={() => handleLongPress(item)}
              onPress={() => setReplyTo(item)}
            >
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? COLORS.primary : "#111",
                  padding: 10,
                  borderRadius: 16,
                  marginBottom: 8,
                  maxWidth: "75%",
                }}
              >
                {/* REPLY */}
                {item.replyTo && (
                  <Text style={{ color: "#888", fontSize: 11 }}>
                    Replying to message
                  </Text>
                )}

                <Text style={{ color: isMe ? "#000" : "#fff" }}>
                  {item.text}
                </Text>

                {item.edited && (
                  <Text style={{ fontSize: 10, color: "#666" }}>
                    Edited
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      {/* REPLY BAR */}
      {replyTo && (
        <View style={{ padding: 8, backgroundColor: "#111" }}>
          <Text style={{ color: "#aaa" }}>
            Replying: {replyTo.text}
          </Text>
        </View>
      )}

      {/* EDIT BAR */}
      {editingMsg && (
        <View style={{ padding: 8, backgroundColor: "#222" }}>
          <Text style={{ color: "#aaa" }}>
            Editing message
          </Text>
        </View>
      )}

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flexDirection: "row", padding: 10 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#666"
            style={{
              flex: 1,
              backgroundColor: "#111",
              color: "#fff",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          />

          <TouchableOpacity onPress={handleSend}>
            <Ionicons
              name="send"
              size={18}
              color={COLORS.primary}
              style={{ marginLeft: 10, marginTop: 10 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}