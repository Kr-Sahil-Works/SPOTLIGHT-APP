import { api } from "@/convex/_generated/api";
import useNetwork from "@/hooks/useNetwork";
import {
  getChatListCache,
  saveChatListCache,
} from "@/lib/cache/chatListCache";
import {
  saveProfileCache,
} from "@/lib/cache/profileCache";
import { useQuery } from "convex/react";
import {
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatHeader from "../../features/chats/ChatHeader";
import ChatList from "../../features/chats/ChatList";
import ChatSearch from "../../features/chats/ChatSearch";
import SuggestionTray from "../../features/chats/SuggestionTray";

export default function Chats() {
  const isOnline =
  useNetwork();
  const [search, setSearch] = useState("");
const insets = useSafeAreaInsets();
const TAB_BAR_HEIGHT = 60 + insets.bottom;
const [openSuggestions, setOpenSuggestions] = useState(false);

  /* =========================
     🔥 DATA
  ========================= */
  const chats = useQuery(api.messages.index.getChatList);
  const [
  cachedChats,
  setCachedChats,
] = useState<any[]>(
  getChatListCache()
);
  const allUsers = useQuery(api.users.index.getAllUsers);

useEffect(() => {
  if (
    chats &&
    chats.length > 0
  ) {
    setCachedChats(
      chats
    );

    saveChatListCache(
      chats
    );

    chats.forEach(
      (chat: any) => {
        saveProfileCache(
          String(
            chat.userId
          ),
          {
            _id:
              chat.userId,

            fullname:
              chat.fullname,

            image:
              chat.image,
          }
        );
      }
    );
  }
}, [chats]);

const chatCount =
  (
    chats ??
    cachedChats
  )?.length || 0;

  const showFullSuggestions = chatCount === 0;
  const showPeekTray = chatCount > 0 && chatCount < 3;

  const searchUsers = useQuery(api.users.index.searchUsers, {
    search: search || "",
  });

  /* =========================
     🔎 LOGIC
  ========================= */
  const isSearching = search.trim().length > 0;
const data =
  isSearching
    ? searchUsers || []
    : chats &&
      chats.length > 0
    ? chats
    : cachedChats;

  /* =========================
     🎯 UI
  ========================= */
  return (
    <View style={{ flex: 1, backgroundColor: "#030405" }}>
      {/* HEADER */}
      <ChatHeader />

      {/* SEARCH */}
      <ChatSearch value={search} onChange={setSearch} />

      {/* LIST */}
   <ChatList
  data={data}
  search={search}
  isSearching={isSearching}
  onOpenSuggestions={() => setOpenSuggestions(true)}
/>

      {/* 🔥 FIXED TRAY POSITION */}
{isOnline &&
  (showFullSuggestions ||
    showPeekTray ||
    openSuggestions) && (
  <View
    style={{
      position: "absolute",
      bottom: TAB_BAR_HEIGHT , 
      left: 0,
      right: 0,
 zIndex: 9999,
elevation: 999,
    }}
  >
<SuggestionTray
  users={allUsers || []}
  forceOpen={openSuggestions}
/>
  </View>
)}
    </View>
  );
}