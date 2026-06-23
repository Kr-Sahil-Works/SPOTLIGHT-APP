import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useNetwork from "@/hooks/useNetwork";
import {
  getNotesCache,
  saveNotesCache,
} from "@/lib/cache/notesCache";
import { storage } from "@/lib/mmkv";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

const { height } = Dimensions.get("window");

const NOTE_COLORS = [
  "#082F2A", // Forest Temple 🌲

  "#1B1538", // Midnight Galaxy 🌌

  "#122C3F", // Deep Ocean 🌊

  "#341826", // Crimson Velvet 🌹

  "#3A2B12", // Ancient Gold 🏺

  "#173A34", // Emerald Cave 💎

  "#2B1A4A", // Arcane Purple 🔮

  "#4A2314", // Volcanic Ember 🌋

  "#163949", // Frozen Lake ❄️

  "#431A3B", // Neon Orchid 🌺

  "#2A4013", // Jungle Moss 🍃

  "#17345C", // Sapphire Night ⭐

  "#51261A", // Desert Sunset 🏜️

  "#0F4047", // Mystic Lagoon 🐚

  "#36144D", // Cosmic Portal ✨

  "#442C14", // Treasure Chest 🏆

  "#1E4A3C", // Hidden Island 🏝️

  "#541E2F", // Vampire Castle 🦇

  "#234A58", // Arctic Aurora 🌠

  "#2C2C2C", // Shadow Realm ⚫
];

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

const [
  stackedView,
  setStackedView,
] = useState(
  storage.getString(
    "notes-stacked-view"
  ) === "true"
);


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

  useEffect(() => {
  const saved =
    storage.getString(
      "notes-stacked-view"
    );

  if (
    saved !== undefined
  ) {
    setStackedView(
      saved === "true"
    );
  }
}, []);

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
    
    <View style={{ flex: 1, backgroundColor: "#000", paddingHorizontal: 16,
paddingTop: 16, }}>

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,

    paddingBottom: 10,

    borderBottomWidth: 1,

    borderBottomColor:
      "rgba(255,255,255,0.05)",
  }}
>
  {/* LEFT */}
  <View>
    <Text
      style={{
        color: "#069241",

        fontSize: 22,

        fontWeight: "900",
      }}
    >
     Notes
    </Text>

    <Text
      style={{
        color: "#8b8b8b",

        fontSize: 12,

        marginTop: 2,
      }}
    >
      Thoughts • Ideas • Reminders
    </Text>
  </View>

  {/* RIGHT */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }}
>
  <TouchableOpacity
  onPress={() => {
  const next =
    !stackedView;

  setStackedView(
    next
  );

  storage.set(
    "notes-stacked-view",
    String(next)
  );
}}
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,

      backgroundColor:
        "rgba(34,197,94,0.08)",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <Ionicons
      name={
        stackedView
          ? "layers"
          : "layers-outline"
      }
      size={18}
      color="#22c55e"
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      router.replace(
        "/(tabs)/chats"
      )
    }
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,

      backgroundColor:
        "rgba(34,197,94,0.08)",

      justifyContent:
        "center",

      alignItems:
        "center",
    }}
  >
    <Ionicons
      name="chevron-forward"
      size={22}
      color="#22c55e"
    />
  </TouchableOpacity>
</View>
</View>

      {/* SEARCH (GLASS) */}
      <BlurView intensity={25} tint="dark" style={{
  marginTop: 12,

  marginBottom: 20,

  borderRadius: 28,

  overflow: "hidden",

  borderWidth: 1,

  borderColor:
    "rgba(34,197,94,0.12)",
}}>
      <View
  style={{
    flexDirection: "row",
    alignItems: "center",

    height: 44,

    borderRadius: 28,

    backgroundColor:
      "rgba(34,197,94,0.08)",

    paddingHorizontal: 14,
  }}
>
         <Ionicons
  name="search"
  size={20}
  color="#22c55e"
/>
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#888"
            underlineColorAndroid="transparent"
            value={search}
            onChangeText={setSearch}
            style={{ color: "#fff", marginLeft: 10, flex: 1 }}
          />

          {search.length > 0 && (
  <TouchableOpacity
    onPress={() =>
      setSearch("")
    }
  >
    <Ionicons
      name="close-circle"
      size={18}
      color="#666"
    />
  </TouchableOpacity>
)}
        </View>
      </BlurView>

      {/* LIST */}
  <FlashList
        data={filtered}
drawDistance={600}
removeClippedSubviews
showsVerticalScrollIndicator={false}
        keyExtractor={(i) => String(i._id)}
        renderItem={({ item, index }) => {
          const isPinned = pinned.includes(item._id);

          return (
      <TouchableOpacity
  activeOpacity={0.9}
  onLongPress={() => confirmDelete(item._id)}
  style={{
    backgroundColor:
      NOTE_COLORS[
        index %
        NOTE_COLORS.length
      ],

    borderRadius: 28,

  marginTop:
  index === 0
    ? 12
    : stackedView
    ? -14
    : 12,

    marginBottom: 4,

 zIndex:
  stackedView
    ? filtered.length -
      index
    : 1,

    padding: 22,

    minHeight: 160,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.08)",

    shadowColor: "#000",

    shadowOpacity: 0.35,

    shadowRadius: 12,

    elevation: 8,

 transform: stackedView
  ? [
      {
        rotate:
          index === 0
            ? "0deg"
            : index % 2 === 0
            ? "-1deg"
            : "1deg",
      },
      {
        scale:
          index === 0
            ? 1
            : 0.99,
      },
    ]
  : [],
  }}
>
 <View
  style={{
    position: "absolute",
    top: 16,
    right: 16,
  }}
>
  <Ionicons
    name={
      isPinned
        ? "bookmark"
        : "bookmark-outline"
    }
    size={18}
    color="#facc15"
  />
</View>

<Text
  style={{
    color: "#cbd5e1",
    fontSize: 12,
    marginBottom: 12,
  }}
>
  {`${new Date(
  item.updatedAt
).toLocaleDateString(
  "en-IN",
  {
    day: "numeric",
    month: "long",
  }
)} • ${new Date(
  item.updatedAt
).toLocaleTimeString(
  "en-IN",
  {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }
)}`}
</Text>

<Text
  style={{
    color: "#fff",
    fontSize: 18,
fontWeight: "600",
    lineHeight: 24,
    paddingRight: 28,
  }}
>
  {item.content}
</Text>

  {/* ACTIONS */}
  <View
  style={{
    flexDirection: "row",

    marginTop: 20,

    paddingTop: 14,

    borderTopWidth: 1,

    borderTopColor:
      "rgba(255,255,255,0.08)",

    justifyContent:
      "center",
      gap:80,
  }}
>
    <TouchableOpacity
      onPress={async () => {
        await Clipboard.setStringAsync(item.content);
        showToast("Copied");
      }}
      style={actionBtn("#4ade80")}
    >
 <View
  style={{
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 16,
    }}
  >
    📋
  </Text>

  <Text
    style={{
      color: "#4ade80",
      fontWeight: "700",
      marginTop: 4,
      textAlign: "center",
    }}
  >
    Copy
  </Text>
</View>
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
   <View
  style={{
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 16,
    }}
  >
    📌
  </Text>

  <Text
    style={{
      color: "#facc15",
      fontWeight: "700",
      marginTop: 4,
      textAlign: "center",
    }}
  >
    Pin
  </Text>
</View>
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
    <View
  style={{
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 16,
    }}
  >
    ✏️
  </Text>

  <Text
    style={{
      color: "#60a5fa",
      fontWeight: "700",
      marginTop: 4,
      textAlign: "center",
    }}
  >
    Edit
  </Text>
</View>
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

  bottom: 46,

  right: 22,

  width: 58,

  height: 58,

  borderRadius: 34,

  alignItems: "center",

  justifyContent: "center",

backgroundColor:
  "rgba(34,197,94,0.18)",

borderWidth: 1,

borderColor:
  "rgba(34,197,94,0.25)",

  shadowColor: "#57750c",

  shadowOpacity: 0.45,

  shadowRadius: 16,

  elevation: 14,
}}
      >
      <View
  style={{
    alignItems: "center",
  }}
>
<Ionicons
  name="create-outline"
  size={24}
  color="#22c55e"
/>
</View>
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