import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function Notes() {
  const router = useRouter();

  const notes: any = useQuery(api.messages.getNotes) || [];
  const saveNote = useMutation(api.messages.saveNote);
  const deleteNote = useMutation(api.messages.deleteNote);

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [pinned, setPinned] = useState<string[]>([]);

  const translateY = useRef(new Animated.Value(height)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const openSheet = (note?: any) => {
    if (note) {
      setEditing(note);
      setText(note.content);
    }
    setOpen(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      setText("");
      setEditing(null);
    });
  };

  const filtered = notes
    .filter((n: any) =>
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const aPinned = pinned.includes(a._id);
      const bPinned = pinned.includes(b._id);
      return aPinned === bPinned ? 0 : aPinned ? -1 : 1;
    });

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>

      {/* CLOSE */}
      <TouchableOpacity onPress={() => router.replace("/(tabs)/chats")}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 🔥 GLASS SEARCH */}
      <BlurView
        intensity={40}
        tint="dark"
        style={{
          marginTop: 12,
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            height: 44,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <Ionicons name="search" size={18} color="#aaa" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={{ color: "#fff", marginLeft: 10, flex: 1 }}
          />
        </View>
      </BlurView>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i._id)}
        renderItem={({ item }) => {
          const isPinned = pinned.includes(item._id);

          return (
            <TouchableOpacity
              onLongPress={async () => {
                await deleteNote({ id: item._id });
                showToast("Deleted");
              }}
              style={{
                backgroundColor: "#111",
                padding: 14,
                borderRadius: 16,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff" }}>{item.content}</Text>

              <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>

                {/* COPY */}
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color="#4ade80"
                  onPress={async () => {
                    await Clipboard.setStringAsync(item.content);
                    showToast("Copied");
                  }}
                />

                {/* PIN */}
                <Ionicons
                  name={isPinned ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color="#facc15"
                  onPress={() => {
                    setPinned((prev) =>
                      prev.includes(item._id)
                        ? prev.filter((id) => id !== item._id)
                        : [...prev, item._id]
                    );
                    showToast(isPinned ? "Unpinned" : "Pinned");
                  }}
                />

                {/* EDIT */}
                <Ionicons
                  name="create-outline"
                  size={18}
                  color="#60a5fa"
                  onPress={() => openSheet(item)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        onPress={() => openSheet()}
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backgroundColor: "#22c55e",
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>

      {/* 🔥 BOTTOM SHEET */}
      {open && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: height * 0.5,
            transform: [{ translateY }],
            backgroundColor: "#111",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write note..."
            placeholderTextColor="#666"
            multiline
            style={{
              color: "#fff",
              backgroundColor: "#1a1a1a",
              padding: 12,
              borderRadius: 14,
            }}
          />

          <TouchableOpacity
            onPress={async () => {
              if (!text.trim()) return;
              await saveNote({ content: text });
              showToast(editing ? "Updated" : "Saved");
              closeSheet();
            }}
            style={{
              marginTop: 14,
              backgroundColor: "#22c55e",
              padding: 12,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#000" }}>
              {editing ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeSheet}>
            <Text style={{ color: "#888", marginTop: 10, textAlign: "center" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 🔥 TOAST */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 80,
          alignSelf: "center",
          opacity: toastAnim,
          transform: [
            {
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
          backgroundColor: "#222",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#fff" }}>{toastMsg}</Text>
      </Animated.View>
    </View>
  );
}