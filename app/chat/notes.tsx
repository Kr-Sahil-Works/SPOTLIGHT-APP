import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { Id } from "@/convex/_generated/dataModel";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";

const { height } = Dimensions.get("window");

export default function Notes() {
  const router = useRouter();

  const notes: any = useQuery(api.messages.getNotes) || [];
  const saveNote = useMutation(api.messages.saveNote);
  const deleteNote = useMutation(api.messages.deleteNote);
  const updateNote = useMutation(api.messages.updateNote);
const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  

const [pinned, setPinned] = useState<Id<"notes">[]>([]);

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

  const confirmDelete = (id: Id<"notes">) => {
    Alert.alert(
      "Delete Note",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteNote({ id });
            showToast("Deleted");
          },
        },
      ]
    );
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

  // ✅ OPEN KEYBOARD
  setTimeout(() => {
    inputRef.current?.focus();
  }, 100);
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

    <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  }}
>
  {/* LEFT - Notes */}
  <Text
    style={{
      color: "#22c55e",
      fontSize: 18,
      fontWeight: "600",
    }}
  >
    Notes
  </Text>

  {/* RIGHT - Back Arrow */}
  <TouchableOpacity
    onPress={() => router.replace("/(tabs)/chats")}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    }}
  >
    <Ionicons name="chevron-back" size={22} color="#22c55e" />
    <Text
      style={{
        color: "#22c55e",
        fontSize: 16,
        fontWeight: "500",
      }}
    >
      Back
    </Text>
  </TouchableOpacity>
</View>

      {/* SEARCH (GLASS) */}
      <BlurView intensity={50} tint="dark" style={{
        marginTop: 12,
        borderRadius: 30,
        marginBottom:20,
        overflow: "hidden",
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          height: 44,
          backgroundColor: "rgba(255,255,255,0.06)",
        }}>
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
  activeOpacity={0.9}
  onLongPress={() => confirmDelete(item._id)}
  style={{
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    marginTop: 12,
    marginBottom: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  }}
>
  <Text style={{ color: "#fff", fontSize: 15 }}>
    {item.content}
  </Text>

  {/* ACTIONS */}
  <View
    style={{
      flexDirection: "row",
      position: "absolute",
      bottom: 10,
      right: 10,
      gap: 10,
    }}
  >
    <TouchableOpacity
      onPress={async () => {
        await Clipboard.setStringAsync(item.content);
        showToast("Copied");
      }}
      style={actionBtn("#4ade80")}
    >
      <Ionicons name="copy-outline" size={20} color="#4ade80" />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setPinned((prev) =>
          prev.includes(item._id)
            ? prev.filter((id) => id !== item._id)
            : [...prev, item._id]
        );
        showToast(isPinned ? "Unpinned" : "Pinned");
      }}
      style={actionBtn("#facc15")}
    >
      <Ionicons
        name={isPinned ? "bookmark" : "bookmark-outline"}
        size={20}
        color="#facc15"
      />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => openSheet(item)}
      style={actionBtn("#60a5fa")}
    >
      <Ionicons name="create-outline" size={20} color="#60a5fa" />
    </TouchableOpacity>
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

      {/* SHEET */}
   {open && (
 <KeyboardAvoidingView
  behavior="padding"
  keyboardVerticalOffset={0}
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  }}
>
    <Animated.View
      style={{
        transform: [{ translateY }],

        backgroundColor: "#111",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        paddingHorizontal: 12,
        paddingTop: 14,
        paddingBottom: 20,
      }}
    >
      {/* INPUT */}
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder="Write note..."
        placeholderTextColor="#666"
        multiline
        scrollEnabled
        textAlignVertical="top"

        style={{
          color: "#fff",
          fontSize: 16,
          minHeight: 60,
          maxHeight: 180,
          width: "100%",
          backgroundColor: "#1a1a1a",
          borderRadius: 16,
          padding: 14,
        }}
      />

      {/* SAVE */}
      <TouchableOpacity
        onPress={async () => {
          if (!text.trim()) return;

          if (editing) {
            await updateNote({
              id: editing._id,
              content: text,
            });
          } else {
            await saveNote({
              content: text,
            });
          }

          showToast(editing ? "Updated" : "Saved");
          closeSheet();
        }}
        style={{
          marginTop: 12,
          backgroundColor: "#22c55e",
          padding: 14,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#000", fontWeight: "600" }}>
          {editing ? "Update" : "Save"}
        </Text>
      </TouchableOpacity>

      {/* CANCEL */}
      <TouchableOpacity onPress={closeSheet}>
        <Text style={{ color: "#888", marginTop: 10, textAlign: "center" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </Animated.View>
  </KeyboardAvoidingView>
)}

      {/* TOAST */}
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

/* ACTION BUTTON STYLE */
const actionBtn = (color: string): ViewStyle => ({
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "rgba(255,255,255,0.08)",
  alignItems: "center",
  justifyContent: "center",
});