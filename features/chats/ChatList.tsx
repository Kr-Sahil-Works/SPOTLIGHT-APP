import useChatListTheme from "@/hooks/useChatListTheme";
import { storage } from "@/lib/mmkv";
import { FlatList, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

import ChatItem from "./ChatItem";
import NoChats from "./NoChats";

export default function ChatList({
  data,
  search,
  isSearching,
  onOpenSuggestions,
}: any) {
  const theme =
    useChatListTheme();

const [layout] =
  useMMKVString(
    "chat-list-layout",
    storage
  );


  if (
    !data ||
    data.length === 0
  ) {
    return (
      <NoChats
        search={search}
        onOpenSuggestions={
          onOpenSuggestions
        }
      />
    );
  }

  return (
    <View
      style={
(layout ??
  "classic") ===
"container"
          ? {
              flex: 1,

              marginTop: 28,

              marginHorizontal: 6,

              borderTopLeftRadius: 36,

              borderTopRightRadius: 36,

              backgroundColor:
                theme.cardBg,

              borderWidth: 1,

              borderColor:
                theme.cardBorder,

              overflow:
                "hidden",
            }
          : {
              flex: 1,

              marginTop: 28,
            }
      }
    >
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
        keyExtractor={(
          item: any
        ) =>
          String(
            item.userId ??
              item._id
          )
        }
        renderItem={({
          item,
        }) => (
          <ChatItem
            item={item}
          />
        )}
        contentContainerStyle={{
          padding: 16,
        }}
      />
    </View>
  );
}