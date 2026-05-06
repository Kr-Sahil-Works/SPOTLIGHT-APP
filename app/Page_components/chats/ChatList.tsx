import { FlatList, View } from "react-native";
import ChatItem from "./ChatItem";
import NoChats from "./NoChats";

export default function ChatList({
  data,
  search,
  isSearching,
  onOpenSuggestions,
}: any){
  if (!data || data.length === 0) {
    return <NoChats
  search={search}
  onOpenSuggestions={onOpenSuggestions}
/>
  }

  return (
    <View style={{
      flex: 1,
      marginTop: 28,
      marginHorizontal: 6,
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
    }}>
      <FlatList
        data={data}
        keyExtractor={(item: any) =>
          String(item.userId ?? item._id)
        }
        renderItem={({ item }) => <ChatItem item={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}