import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useNetwork from "@/hooks/useNetwork";
import {
  getNotesCache,
  saveNotesCache,
} from "@/lib/cache/notesCache";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

const { height } = Dimensions.get("window");

export default function Notes() {
  const isOnline =
  useNetwork();
  const router = useRouter();

  const liveNotes =
  useQuery(
    api.notes.index.getNotes
  );

const [
  cachedNotes,
  setCachedNotes,
] = useState<any[]>(
  getNotesCache()
);

const notes =
  liveNotes ??
  cachedNotes;

  useEffect(() => {
  if (
    liveNotes &&
    liveNotes.length > 0
  ) {
    setCachedNotes(
      liveNotes
    );

    saveNotesCache(
      liveNotes
    );
  }
}, [liveNotes]);

  const saveNote = useMutation(api.notes.index.saveNote);
  const deleteNote = useMutation(api.notes.index.deleteNote);
  const updateNote = useMutation(api.notes.index.updateNote);
const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
const [saving, setSaving] = useState(false);
  

const tickScale = useRef(new Animated.Value(0)).current;
const [showTick, setShowTick] = useState(false);

const [deleteId, setDeleteId] = useState<Id<"notes"> | null>(null);

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

const confirmDelete = (
  id: Id<"notes">
) => {
  if (!isOnline)
    return;

  setDeleteId(id);
};

const showSuccessTick = () => {
  setShowTick(true);
  tickScale.setValue(0);

  Animated.spring(tickScale, {
    toValue: 1,
    friction: 5,
    useNativeDriver: true,
  }).start();

  setTimeout(() => {
    setShowTick(false);
  }, 1200);
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
{showTick && (
  <View
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Animated.View
      style={{
        transform: [{ scale: tickScale }],
        backgroundColor: "#22c55e",
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="checkmark" size={36} color="#000" />
    </Animated.View>
  </View>
)}
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
      <BlurView intensity={25} tint="dark" style={{
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
            underlineColorAndroid="transparent"
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
      
     disabled={!isOnline}
style={[
  actionBtn("#facc15"),
  {
    opacity:
      isOnline
        ? 1
        : 0.35,
  },
]}
    >
      <Ionicons
        name={isPinned ? "bookmark" : "bookmark-outline"}
        size={20}
        color="#facc15"
      />
    </TouchableOpacity>

 <TouchableOpacity
      disabled={!isOnline}
      onPress={() => openSheet(item)}
      style={[
        actionBtn("#60a5fa"),
        {
          opacity:
            isOnline
              ? 1
              : 0.35,
        },
      ]}
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
        onPress={() => {
if (!isOnline) {
showToast(
  "Internet connection required"
);

  return;
}

  openSheet();
}}
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
        underlineColorAndroid="transparent"
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
  disabled={
  saving ||
  !isOnline
}
  style={{
    marginTop: 12,
    backgroundColor: saving ? "#166534" : "#22c55e", // darker when disabled
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    opacity: saving ? 0.7 : 1,
  }}
     onPress={async () => {
  if (saving) return; // 🔥 block double tap
  if (!isOnline) {
  alert(
    "Internet connection required to save notes."
  );

  return;
}
  if (!text.trim()) return;

  setSaving(true);

  try {
    if (editing) {
      await updateNote({
        noteId: editing._id,
        content: text,
      });
    } else {
      await saveNote({
        content: text,
      });
    }

    showSuccessTick();
    closeSheet();
  } catch (e) {
    console.log(e);
  } finally {
    setSaving(false);
  }
}}
      >
 {saving ? (
  <ActivityIndicator color="#000" size="small" />
) : (
  <Text style={{ color: "#000", fontWeight: "600" }}>
    {!isOnline
  ? "Offline"
  : editing
  ? "Update"
  : "Save"}
  </Text>
)}
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


      {deleteId && (
  <View
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000000cf",
    }}
  >
    <BlurView
      intensity={25}
      tint="dark"
      style={{
        width: "80%",
        borderRadius: 20,
        padding: 20,
        backgroundColor: "#00000082",
            overflow: "hidden",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16, marginBottom: 16 }}>
        Delete this note?
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* CANCEL */}
        <TouchableOpacity
          onPress={() => setDeleteId(null)}
          style={{
            flex: 1,
            marginRight: 8,
            padding: 12,
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text style={{ color: "#fff" }}>Cancel</Text>
        </TouchableOpacity>

        {/* DELETE */}
        <TouchableOpacity
          onPress={async () => {
            await deleteNote({ noteId: deleteId });
            setDeleteId(null);
            showSuccessTick();
          }}
          style={{
            flex: 1,
            marginLeft: 8,
            padding: 12,
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: "#ff3b30", // iOS red
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  </View>
)}
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