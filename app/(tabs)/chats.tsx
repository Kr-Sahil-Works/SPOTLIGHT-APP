import { useQuery } from "convex/react";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/convex/_generated/api";

import ChatHeader from "../Page_components/chats/ChatHeader";
import ChatList from "../Page_components/chats/ChatList";
import ChatSearch from "../Page_components/chats/ChatSearch";
import SuggestionTray from "../Page_components/chats/SuggestionTray";

export default function Chats() {
  const [search, setSearch] = useState("");
const insets = useSafeAreaInsets();
const TAB_BAR_HEIGHT = 60 + insets.bottom;
const [openSuggestions, setOpenSuggestions] = useState(false);

  /* =========================
     🔥 DATA
  ========================= */
  const chats = useQuery(api.messages.index.getChatList);
  const allUsers = useQuery(api.users.index.getAllUsers);

  const chatCount = chats?.length || 0;

  const showFullSuggestions = chatCount === 0;
  const showPeekTray = chatCount > 0 && chatCount < 3;

  const searchUsers = useQuery(api.users.index.searchUsers, {
    search: search || "",
  });

  /* =========================
     🔎 LOGIC
  ========================= */
  const isSearching = search.trim().length > 0;

  const data = isSearching
    ? searchUsers || []
    : chats || [];

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
     {(showFullSuggestions || showPeekTray || openSuggestions) && (
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